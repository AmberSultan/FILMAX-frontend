"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'react-feather';

interface User {
  username: string;
  email: string;
  password: string;
  fullname: string;
  phone: string;
}

export default function LoginForm() {
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
    fullname: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ password?: string }>({});
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [id]: value,
    }));
    
    // Clear errors when user starts typing
    if (id === 'password') {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: value.length < 8 ? 'Password must be at least 8 characters long' : '',
      }));
    }
  };

  const isFormValid = () => {
    return user.username && user.email && user.password && user.fullname && user.phone;
  };

  const onSignup = async () => {
    // Validate password length before submitting
    if (user.password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters long' });
      return;
    }

    try {
      console.log("User data:", user);
      const response = await fetch("http://localhost:4001/api/users/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log("Signup response", data);

      if (response.status === 409) { 
        toast.error("User already exists.");
      } else if (response.ok) { 
        toast.success("SignUp Successfully.");
        router.push('/login');
      } else {
        toast.error("SignUp failed.");
      }
    } catch (error) {
      console.error("Signup failed", error);
      toast.error("SignUp failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={user.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullname">Full name</Label>
                <Input
                  id="fullname"
                  value={user.fullname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={user.password}
                onChange={handleInputChange}
                minLength={8}
                required
              />
              <button
                type="button"
                className="absolute top-7 right-2 flex items-center p-1 bg-transparent border-none"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="text-black w-4 h-4" />
                ) : (
                  <Eye className="text-black w-4 h-4" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={user.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button
              type="button"
              onClick={onSignup}
              className="w-full"
              disabled={!isFormValid()} 
            >
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
