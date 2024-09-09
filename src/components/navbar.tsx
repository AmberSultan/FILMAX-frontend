"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast';
import { Menu, Package2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from '@/components/mode-toggle';
import { useRouter } from 'next/navigation';

const NavbarLayout: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      toast.success("Logged out successfully.");
      router.push('/'); 
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Logout failed.");
    }
  };

  return (
    <header className="flex flex-col lg:flex-row h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 shadow-md">
      {/* Mobile Menu Toggle */}
      <Sheet>
        <div className="flex justify-end">
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-0 right-0 m-2 lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col lg:hidden">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-5 w-5" />
                <span className="sr-only text-white">FILMAX</span>
              </Link>
              <Link
                href="/"
                className="mx-[-0.65rem] text-base flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="mx-[-0.65rem] text-base flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Movie
              </Link>
              <Link
                href="/cinema"
                className="mx-[-0.65rem] text-base flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Cinema
              </Link>
              <Link
                href="/experiences"
                className="mx-[-0.65rem] text-base flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Experiences
              </Link>
              <Link
                href="/coming-soon"
                className="mx-[-0.65rem] text-base flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Coming Soon
              </Link>
            </nav>
          </SheetContent>
        </div>
      </Sheet>

      {/* Desktop Logo and Navigation */}
      <div className='flex flex-1 lg:justify-between items-start'>
        <Link
          href="/"
          className="absolute top-3 left-5 flex items-start text-base gap-2 font-semibold lg:hidden"
        >
          <Package2 className="h-6 w-6" />
          <span>FILMAX</span>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex flex-1 gap-4 text-lg font-medium">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Package2 className="h-5 w-5" />
            FILMAX
          </Link>
          <Link
            href="/"
            className="flex items-center text-base gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/movies"
            className="flex items-center text-base gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            Movie
          </Link>
          <Link
            href="/cinema"
            className="flex items-center text-base gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            Cinema
          </Link>
          <Link
            href="/experiences"
            className="flex items-center text-base gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            Experiences
          </Link>
          <Link
            href="/coming-soon"
            className="flex items-center text-base gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            Coming Soon
          </Link>
          <div className="ml-auto flex space-x-2 me-2">
            {isLoggedIn ? (
              <Button size="sm" style={{ marginTop: '2px' }} onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" style={{ marginTop: '2px', backgroundColor: 'grey', color: 'white' }}>
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" style={{ marginTop: '2px' }}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className='lg:flex justify-end'>
          <ModeToggle />
        </div>
      </div>
      <Toaster />
    </header>
  );
};

export default NavbarLayout;
