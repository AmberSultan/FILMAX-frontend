"use client";

import { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ScheduleEntry {
  date: string;
  showtiming: string;
}

interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  releaseDate: string;
  language: string;
  rating: string;
  schedule: ScheduleEntry[];
  thumbnail: string;
  trailer: string;
}

const Page = () => {
  const [update, setUpdate] = useState(1)
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Movie, '_id'>>({
    title: '',
    description: '',
    genre: '',
    duration: '',
    releaseDate: '',
    language: '',
    rating: '',
    schedule: [{ date: '', showtiming: '' }],
    thumbnail: '',
    trailer: ''
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, files } = e.target as HTMLInputElement;

    if (type === 'file') {
      if (files?.[0]) {
        setThumbnail(files[0]);
        setForm(prevForm => ({
          ...prevForm,
          thumbnail: files[0].name
        }));
      }
    } else if (id.startsWith('schedule')) {
      const [_, index, key] = id.split('-');
      const idx = parseInt(index, 10);
      setForm(prevForm => ({
        ...prevForm,
        schedule: prevForm.schedule.map((entry, i) =>
          i === idx ? { ...entry, [key]: value } : entry
        )
      }));
    } else {
      setForm(prevForm => ({
        ...prevForm,
        [id]: value
      }));
    }
  };

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
  }, [update]);

  const handleAddSchedule = () => {
    setForm(prevForm => ({
      ...prevForm,
      schedule: [...prevForm.schedule, { date: '', showtiming: '' }]
    }));
  };

  const handleRemoveSchedule = (index: number) => {
    setForm(prevForm => ({
      ...prevForm,
      schedule: prevForm.schedule.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!Array.isArray(form.schedule) || !form.schedule.every(entry => entry.date && entry.showtiming)) {
      setError("Please fill in all schedule entries.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('genre', form.genre);
      formData.append('duration', form.duration);
      formData.append('releaseDate', form.releaseDate);
      formData.append('language', form.language);
      formData.append('rating', form.rating);
      formData.append('trailer', form.trailer);
      formData.append('schedule', JSON.stringify(form.schedule));
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
  
      const url = editingMovieId 
        ? `http://localhost:4001/api/movies/update/${editingMovieId}`
        : 'http://localhost:4001/api/movies/create';
      const method = editingMovieId ? 'PUT' : 'POST';
  
      console.log(`Submitting to URL: ${url} with method: ${method}`);


      const response = await fetch(url, {
        method,
        body: formData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save movie: ${errorText}`);
      }
  
      const savedMovie = await response.json();
      if (editingMovieId) {
        setMovies(movies.map(movie => (movie._id === savedMovie._id ? savedMovie : movie)));
      } else {
        setMovies([...movies, savedMovie]);
      }
      resetForm();
    } catch (error) {
      console.error("error in saving movie data in db", error);
      setError("An error occurred while saving the movie.");
    }finally{
      setUpdate(update+1)
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovieId(movie._id);
    setForm({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      language: movie.language,
      rating: movie.rating,
      schedule: movie.schedule,
      thumbnail: movie.thumbnail || '',
      trailer: movie.trailer,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4001/api/movies/delete/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete movie: ${errorText}`);
      }

      setMovies(movies.filter(movie => movie._id !== id));
    } catch (error) {
      console.error("error in deleting movie data in db", error);
      setError("An error occurred while deleting the movie.");
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      genre: '',
      duration: '',
      releaseDate: '',
      language: '',
      rating: '',
      schedule: [{ date: '', showtiming: '' }],
      thumbnail: '',
      trailer: ''
    });
    setThumbnail(null);
    setEditingMovieId(null);
  };

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex flex-1 justify-end me-9 text-lg">
            {editingMovieId ? 'Edit Movie' : 'Add Movie'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="container">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 grid-flow-row gap-4">
                  <div className="w-full">
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                    <input type="text" id="title" value={form.title} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea id="description" value={form.description} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="genre" className="block text-gray-700 font-medium mb-2">Genre</label>
                    <input type="text" id="genre" value={form.genre} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">Duration</label>
                    <input type="text" id="duration" value={form.duration} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="releaseDate" className="block text-gray-700 font-medium mb-2">Release Date</label>
                    <input type="date" id="releaseDate" value={form.releaseDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="language" className="block text-gray-700 font-medium mb-2">Language</label>
                    <input type="text" id="language" value={form.language} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="rating" className="block text-gray-700 font-medium mb-2">Rating</label>
                    <input type="number" id="rating" value={form.rating} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="trailer" className="block text-gray-700 font-medium mb-2">Trailer URL</label>
                    <input type="text" id="trailer" value={form.trailer} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="thumbnail" className="block text-gray-700 font-medium mb-2">Thumbnail</label>
                    <input type="file" id="thumbnail" onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  {form.schedule.map((entry, index) => (
                    <div key={index} className="mb-4 col-span-2 flex gap-4">
                      <div className="w-1/2">
                        <label htmlFor={`schedule-${index}-date`} className="block text-gray-700 font-medium mb-2">Schedule Date</label>
                        <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white" id={`schedule-${index}-date`} value={entry.date} onChange={handleInputChange} />
                      </div>
                      <div className="w-1/2">
                        <label htmlFor={`schedule-${index}-showtiming`} className="block text-gray-700 font-medium mb-2">Show Timing</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white" id={`schedule-${index}-showtiming`} value={entry.showtiming} onChange={handleInputChange} />
                      </div>
                      {/* <button type="button" onClick={() => handleRemoveSchedule(index)} className="self-end text-red-500 hover:text-red-700">
                        Remove
                      </button> */}
                    </div>
                  ))}
                  <div className="mb-4 col-span-2">
                    <button type="button" onClick={handleAddSchedule} className="px-0 py-2 bg-black-500 text-white rounded-md hover:bg-blue-600">Add Schedule</button>
                  </div>
                  <div className="mb-4 col-span-2">
                    <button type="submit" className="px-4 py-2 bg-red-950 text-white rounded-md hover:bg-red-900">
                      {editingMovieId ? 'Update Movie' : 'Submit'}
                    </button>
                    {editingMovieId && (
                      <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ml-4">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div>
        <h1 className='mt-2 ms-2 mb-2 text-lg font-bold'>Movies List</h1>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300  px-4 py-2">Title</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Description</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Genre</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Duration</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Release Date</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Language</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Rating</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Schedule</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Thumbnail</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Trailer Link</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-thin">
            {movies.map((movie) => (
              <tr key={movie._id}>
                <td className="border text-sm border-gray-300 px-4 py-2">{movie.title}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{movie.description}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{movie.genre}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{movie.duration}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{movie.releaseDate}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{movie.language}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{movie.rating}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">
                  {movie.schedule && Array.isArray(movie.schedule) && movie.schedule.length > 0 ? (
                    movie.schedule.map((entry, index) => (
                      <div key={index}>
                        {entry.date} at {entry.showtiming}
                      </div>
                    ))
                  ) : (
                    'No Schedule'
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {movie.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`http://localhost:4001/${movie.thumbnail}`} alt="image" className="w-32 h-32 object-cover" />
                  ) : (
                    'No Thumbnail'
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{movie.trailer}</td>
                <td className=" border-gray-300 px-4 py-5 flex mt-5 gap-2">
                  <button onClick={() => handleEdit(movie)} className="p-2 text-white-500 hover:text-white-600">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(movie._id)} className="p-2 text-red-500 hover:text-red-600">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Page;
