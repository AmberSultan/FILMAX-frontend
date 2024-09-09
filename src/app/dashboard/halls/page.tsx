'use client';

import React, { useEffect, useState } from "react";

interface HallDetails {
  _id: string;
  hallname: string;
  capacity: number;
  branch: string;
  organization: string;
}

interface Organization {
  _id: string;
  name: string;
}

interface Branch {
  _id: string;
  branchname: string;
  city: string;
  noOfHalls: number;
  organization: string;
}

const HallComponent: React.FC = () => {
  const [update, setUpdate] = useState(1)
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [hallDetails, setHallDetails] = useState<HallDetails[]>([]);
  const [halls, setHalls] = useState<HallDetails[]>([]);

  const [form, setForm] = useState({
    organization: "",
    branch: "",
  });

  useEffect(() => {
    fetchBranches();
    fetchOrganizations();
    fetchHalls();
  }, [update]);

  const fetchBranches = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/branches/get-branch");
      const data = await response.json();
      if (data.success) {
        setBranches(data.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/organizations/get-organization");
      const data = await response.json();
      if (data.success) {
        setOrganizations(data.data);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchHalls = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/halls/get-hall");
      const data = await response.json();
      if (data.success) {
        // Map hall IDs to names
        const updatedHalls = data.data.map((hall: HallDetails) => ({
          ...hall,
          branchName: branches.find(branch => branch._id === hall.branch)?.branchname || hall.branch,
          organizationName: organizations.find(org => org._id === hall.organization)?.name || hall.organization,
        }));
        setHalls(updatedHalls);
      }
    } catch (error) {
      console.error("Error fetching halls:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    setForm(prevForm => ({
      ...prevForm,
      [id]: value,
    }));

    if (id === "organization") {
      const filtered = branches.filter(branch => branch.organization === value);
      setFilteredBranches(filtered);
      setForm(prevForm => ({
        ...prevForm,
        branch: "",
      }));
    }

    if (id === "branch") {
      const selectedBranch = branches.find(branch => branch._id === value);
      if (selectedBranch) {
        const initialHallDetails = Array(selectedBranch.noOfHalls).fill({
          _id: "",
          hallname: "",
          capacity: 0,
          branch: selectedBranch._id,
          organization: form.organization,
        });
        setHallDetails(initialHallDetails);
      }
    }
  };

  const handleHallDetailChange = (index: number, field: string, value: any) => {
    const updatedHallDetails = [...hallDetails];
    updatedHallDetails[index] = { ...updatedHallDetails[index], [field]: value };
    setHallDetails(updatedHallDetails);
  };

  const handleSave = async () => {
    try {
      // Remove _id field from each hall object
      const processedHallDetails = hallDetails.map(({ _id, ...hall }) => ({
        ...hall,
        capacity: Number(hall.capacity),
        branch: form.branch,
        organization: form.organization,
      }));
  
      console.log("Payload to be sent:", {
        halls: processedHallDetails,
      });
  
      const response = await fetch("http://localhost:4001/api/halls/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          halls: processedHallDetails,
        }),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
      if (data.success) {
        alert("Halls saved successfully");
        fetchHalls();
      } else {
        alert("Error saving halls: " + data.message);
      }
    } catch (error) {
      console.error("Error saving halls:", error);
    } finally {
      setUpdate(update + 1);
    }
  };
  

  return (
    <div>
      <div className="container">
        <form>
          <div className="grid mt-5 grid-cols-2 gap-4">
            <div className="w-full">
              <label htmlFor="organization" className="block text-white font-medium mb-4">Organization</label>
              <select id="organization" value={form.organization} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                <option value="">Select an organization</option>
                {organizations.map(org => (
                  <option key={org._id} value={org._id}>{org.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label htmlFor="branch" className="block text-white font-medium mb-4">Branch</label>
              <select id="branch" value={form.branch} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                <option value="">Select a branch</option>
                {filteredBranches.map(branch => (
                  <option key={branch._id} value={branch._id}>{branch.branchname}</option>
                ))}
              </select>
            </div>

            {hallDetails.map((hall, index) => (
              <div key={index} className="w-full border p-4 mb-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Hall {index + 1}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <label htmlFor={`hallname-${index}`} className="block text-white font-medium mb-2">Hall Name</label>
                    <input
                      type="text"
                      id={`hallname-${index}`}
                      value={hall.hallname}
                      onChange={(e) => handleHallDetailChange(index, 'hallname', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor={`capacity-${index}`} className="block text-white font-medium mb-2">Seat Capacity</label>
                    <input
                      type="number"
                      id={`capacity-${index}`}
                      value={hall.capacity}
                      onChange={(e) => handleHallDetailChange(index, 'capacity', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleSave} className="mt-4 px-4 py-2 bg-red-950 text-white rounded-md">
            Save Halls
          </button>
        </form>
      </div>

      <div className="container mt-8">
        <h2 className="text-xl font-semibold mb-4">Halls Data</h2>
        <table className="min-w-full border-collapse border border-gray-100">
          <thead>
            <tr className="">
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-white uppercase tracking-wider">Hall Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-white uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-white uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-white uppercase tracking-wider">Organization</th>
            </tr>
          </thead>
          <tbody>
            {halls.length > 0 ? (
              halls.map(hall => (
                <tr key={hall._id}>
                  <td className="px-6 py-4 border-b border-gray-300 text-sm text-white">{hall.hallname}</td>
                  <td className="px-6 py-4 border-b border-gray-300 text-sm text-white">{hall.capacity}</td>
                  <td className="px-6 py-4 border-b border-gray-300 text-sm text-white">{branches.find(branch => branch._id === hall.branch)?.branchname || hall.branch}</td>
                  <td className="px-6 py-4 border-b border-gray-300 text-sm text-white">{organizations.find(org => org._id === hall.organization)?.name || hall.organization}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No halls data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HallComponent;
