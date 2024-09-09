"use client"; 

import { useEffect, useState } from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";

import { ThemeProvider } from "@/components/theme-provider";
interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  rating?: number;
  _id: string;
 
}


export default function CardHoverEffectDemo() {

  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:4001/api/movies/get-movie');
        const result = await response.json();
        
        if (result.success) {
          setMovies(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      }
    };

    fetchMovies();
  }, []);


  const items = movies.map((movie) => ({
    thumbnail: movie.thumbnail || "https://via.placeholder.com/150",
    title: movie.title,
    description: movie.description,
    link: `/now-playing/${movie._id}`,
    rating: movie.rating ?? 0,
    _id: movie._id,
    
  }));
  

  return (

    <>
    <ThemeProvider>
    <div className="max-w-5xl mx-auto px-0">
      <h1 className="font-bold text-3xl md:text-3xl text-center py-10">
        Now Playing
      </h1>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <HoverEffect items={items} />
      )}
    </div>
    </ThemeProvider>
    </>
   
  );
}
