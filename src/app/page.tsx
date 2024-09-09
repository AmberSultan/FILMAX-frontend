"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from 'react-hot-toast';

import Navbar from "@/components/navbar";
import Herosection from "@/components/herosection";
import Nowplaying from "@/app/now-playing/page";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <Navbar />
        <Herosection />
        <Nowplaying />
        <Footer />
        <Toaster />
      </ThemeProvider>
    </>
  );
}
