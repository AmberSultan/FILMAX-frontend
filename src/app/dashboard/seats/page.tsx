"use client";

import React, { useEffect, useState } from 'react';

interface Hall {
  _id: string;
  hallname: string;
}

interface Seat {
  _id: string;
  seatNumber: string[];
  status: 'available' | 'booked' | 'unavailable';
  price: number;
  hall: Hall | null;
}

export default function SeatsPage() {
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch("http://localhost:4001/api/seats/get-seat");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          console.log("Fetched seats:", result.data);
          setSeats(result.data);
        } else {
          console.error("Failed to fetch seats:", result.message);
        }
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
    fetchSeats();
  }, []);

  const handleDelete = async (seatId: string) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete this booked seat?");
    // if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:4001/api/seats/delete/${seatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setSeats(seats.filter(seat => seat._id !== seatId));
        console.log("Seat deleted successfully");
      } else {
        console.error("Failed to delete seat:", result.message);
      }
    } catch (error) {
      console.error("Error deleting seat:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="px-2 text-lg mb-4">Seat Statistics</h1>
      <table className="min-w-full bg-transparent border border-black-200">
        <thead>
          <tr>
            <th className="py-2 border-b">Seat Number</th>
            <th className="py-2 border-b">Status</th>
            <th className="py-2 border-b">Price per seat</th>
            <th className="py-2 border-b">Hall Name</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {seats.length > 0 ? (
            seats.map(seat => (
              <tr key={seat._id}>
                <td className="py-2 font-light px-10 border-b">{seat.seatNumber.join(', ')}</td>
                <td className="py-2 font-light px-10 border-b">{seat.status}</td>
                <td className="py-2 font-light px-10 border-b">Rs. {seat.price}</td>
                <td className="py-2 font-light px-10 border-b">{seat.hall?.hallname ?? "Unknown"}</td>
                <td className="py-2 font-light px-10 border-b">
                  {seat.status === 'booked' && (
                    <button
                      onClick={() => handleDelete(seat._id)}
                      className=" text-red-900 font-bold py-1 px-2 rounded"
                    >
                      Cancel Booking
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-2 px-4 text-sm text-center">No seats found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
