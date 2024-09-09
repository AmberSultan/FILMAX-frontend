"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch("http://localhost:4001/api/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error("Invalid credentials.");
      } else if (response.ok) {
        // Save the token to local storage
        localStorage.setItem('authToken', data.token); // Adjust 'data.token' based on your response

        toast.success("Login successful.");
        router.push('/');
      } else {
        toast.error("Login failed.");
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("User not exist.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="mx-auto max-w-sm sm:max-w-xs md:max-w-md lg:max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={handleLogin} 
            >
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
