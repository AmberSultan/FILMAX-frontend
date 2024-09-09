import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className=" py-10 mt-20 w-70 ">
      <div className="container mx-auto flex justify-around gap-10">
        <div className="flex flex-col ms-0">
          <Link href="/" className=" hover:text-red-900">
            Home
          </Link>
          <Link href="/" className=" hover:text-red-900">
            Now Showing
          </Link>
          <Link href="/" className=" hover:text-red-900">
            Coming Soon
          </Link>
        </div>

        <div className="flex flex-col ">
          
          <Link href="/" className=" hover:text-red-900">
            Cinemas
          </Link>
          <Link href="/" className=" hover:text-red-900">
            Experiences
          </Link>
          <Link href="/" className=" hover:text-red-900">
            About Us
          </Link>
        </div>

        <div className="flex flex-col me-0">
   
          <Link href="/" className=" hover:text-red-900">
            Contact Us
          </Link>
          <Link href="/" className=" hover:text-red-900">
            Events
          </Link>
          <Link href="/" className=" hover:text-red-900">
            Locations
          </Link>
        </div>
      </div>

      <div className="container mx-auto mt-10 border-t pt-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} FILMAX. All rights reserved.</p>
      </div>

    </footer>
  );
}
