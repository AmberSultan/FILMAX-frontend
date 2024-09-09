"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";


interface ScheduleEntry {
  date: string;
  showtiming: string;
}

interface Movie {
  title: string;
  description: string;
  thumbnail?: string;
  rating?: number;
  _id: string;
  genre: string;
  duration: string;
  releaseDate: string;
  language: string;
  schedule: ScheduleEntry[];
  trailer: string;
}

interface MoviePageProps {
  params: {
    _id: string;
  };
}

export default function MoviePage({ params }: MoviePageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:4001/api/movies/get-movie/${params._id}`);
        const result = await response.json();

        console.log("API Response:", result);

        if (response.ok) {
          const formattedMovie = {
            ...result.data,
            // Convert UTC formatted date into a simple format
            releaseDate: new Date(result.data.releaseDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }),
          };
          console.log("Formatted Movie:", formattedMovie);
          setMovie(formattedMovie);
          // Automatically set the trailer URL to start the trailer immediately
          if (formattedMovie.trailer) {
            setTrailerUrl(formattedMovie.trailer);
          }
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      }
    };

    fetchMovie();
  }, [params._id]);

  // const handleClose = () => {
  //   setTrailerUrl(null);
  // };

  const handleEnded = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);  // Restart the video
    }
  }

  return (
    <>
      <div>
        <div className="top bg-black text-center py-4 sm:text-xs">
          UNLIMITED MOVIES OF YOUR CHOICE
        </div>
        {error ? (
          <p className="text-red-900 text-center">{error}</p>
        ) : movie ? (
          <div className="selected-movie flex flex-col h-full relative">
            {trailerUrl && (
              <div className="relative">
                <ReactPlayer
                  url={trailerUrl}
                  width="100%"  
                  height="90vh"
                  playing
                  controls
                  muted
                  ref={playerRef}
                  onEnded={handleEnded}
                  // controls={false}
                />
                {/* <button
                  onClick={handleClose}
                  className="absolute top-2 right-3 text-white text-2xl p-2 rounded-full"
                >
                  x
                </button> */}
              </div>
            )}
            <div className="flex-grow w-2/5 absolute left-5 md:left-20 top-2 md:top-20 text-left mt-10 md:mt-20 px-4 md:px-0">
              <h1 className="text-3xl md:text-5xl mt-10 font-bold mb-2 font-mono">
                {movie.title}
              </h1>
              <div className="mt-5 font-semi-bold text-sm md:font-semibold md:text-gray-400 md:text-base flex flex-wrap text-gray-900">
                <p>
                  {movie.releaseDate} | {movie.duration} | {movie.rating}+ |{" "}
                  {movie.language} | {movie.genre}
                </p>
              </div>
              <p className="mb-2 mt-5 w-full md:w-4/5 font-light">
                {movie.description}
              </p>
            </div>
          </div>
        ) : null}
      </div>

<div className="schedule mt-10 px-8">
  <h2 className="text-2xl font-bold text-white mb-4 ms-2">Show Timings</h2>
  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {movie?.schedule && movie.schedule.length > 0 ? (
      movie.schedule.map((entry, index) => (
        <div
          key={index}
          className="p-6 bg-black text-white shadow-md rounded-lg border border-red-800 transform transition-transform duration-300 hover:scale-102 hover:shadow-red-950 hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-md font-light">Date: {entry.date}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12h.01M12 15h.01M9 12h.01M12 9h.01M19 12a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-md mt-0 font-light">Time: {entry.showtiming}</p>
          <Link href={`/now-playing/${movie._id}/choose-seat?date=${encodeURIComponent(entry.date)}&time=${encodeURIComponent(entry.showtiming)}`}>
          <button
            className="mt-4 w-full py-2 bg-red-900 text-white font-md rounded-md hover:bg-red-950 transition-colors duration-300"
          >
            Choose Seat
          </button>
          </Link>
        </div>
      ))
    ) : (
      <p className="text-lg text-gray-900">No Schedule</p>
    )}
  </div>
</div>

    </>
  );
}
