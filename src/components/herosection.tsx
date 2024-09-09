"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "./ui/images-slider";

export default function ImagesSliderDemo() {
  const images = [
    // "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRoZWF0ZXJ8ZW58MHx8MHx8fDA%3D",
  ];
  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.1,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Book Your Entertainment
        </motion.p>
        <p className="text-white text-xs md:text-sm lg:text-base xl:text-base mx-4 md:mx-6 lg:mx-8 xl:mx-12 text-center">🎥 Seamless Booking | 🎟️ Instant Confirmation | 🍿 Best Seats Guaranteed</p>
        {/* <button className=" px-4 py-2 backdrop-blur-sm border bg-black-300/10 border-white-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Pick a movie →</span>
          <div className=" absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-red-500 to-transparent" />
        </button> */}
      </motion.div>
    </ImagesSlider>
  );
}
