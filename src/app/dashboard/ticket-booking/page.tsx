// 'use client';

// import React, { useEffect, useState } from 'react';

// interface Seats {
//   seatNumber: string;
//   status: string;
// }

// interface User {
//   _id: string;
//   movie: string;
//   hall: string;
//   seat: Seats[];
//   showtime: string;
//   date: string;
//   user: string;
  

// }

// export default function UsersPage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch("http://localhost:4001/api/users/get-users")
//         //   method: 'GET',
//         //   headers: {
//         //     'Content-Type': 'application/json',
//         //   },
//         // });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setUsers(data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="p-4">
//       <h1 className=" px-2 text-lg mb-4">SignedIn Users Data</h1>
//       <table className="min-w-full bg-transparent border border-black-200">
//         <thead>
//           <tr>
//             <th className="py-0 px-0 border-b">Username</th>
//             <th className="py-2 px-4 border-b">Full Name</th>
//             <th className="py-2 px-4 border-b">Email</th>
//             <th className="py-2 px-4 border-b">Phone</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length > 0 ? (
//             users.map(user => (
//               <tr key={user._id}>
//                 <td className="py-2 font-light px-4 border-b">{user.username}</td>
//                 <td className="py-2 font-light px-4 border-b">{user.fullname}</td>
//                 <td className="py-2 font-light px-4 border-b">{user.email}</td>
//                 <td className="py-2 font-light px-4 border-b">{user.phone}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={4} className="py-2 px-4 text-sm text-center">No users found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
