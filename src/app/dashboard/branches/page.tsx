"use client";

import React, { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Branch {
  _id: string;
  branchname: string;
  phoneNumber: string;
  email: string;
  city: string;
  openingTime: string;
  closingTime: string;
  noOfHalls: number;
  organization: string;
}

interface Organization {
  _id: string;
  name: string;
}

const BranchComponent: React.FC = () => {
  const [update, setUpdate] = useState(1)
  const [branches, setBranches] = useState<Branch[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Branch>>({
    branchname: "",
    phoneNumber: "",
    email: "",
    city: "",
    openingTime: "",
    closingTime: "",
    noOfHalls: 0,
    organization: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBranches();
    fetchOrganizations();
  }, [update]);

  const fetchBranches = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/branches/get-branch");
      const data = await response.json();
      if (data.success) {
        setBranches(data.data);
      }
      console.log("Fetched branches:", data.data); // Debug: Log fetched branches
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
      console.log("Fetched organizations:", data.data); // Debug: Log fetched organizations
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.branchname || !form.phoneNumber || !form.email || !form.city || !form.organization) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const url = editingBranchId 
        ? `http://localhost:4001/api/branches/update/${editingBranchId}`
        : 'http://localhost:4001/api/branches/create';
      const method = editingBranchId ? 'PUT' : 'POST';

      console.log(`Submitting to URL: ${url} with method: ${method}`);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save branch: ${errorText}`);
      }

      const savedBranch = await response.json();
      if (editingBranchId) {
        setBranches(branches.map(branch => (branch._id === savedBranch._id ? savedBranch : branch)));
      } else {
        setBranches([...branches, savedBranch]);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving branch data in DB", error);
      setError("An error occurred while saving the branch.");
    }
    finally{
      setUpdate(update+1)
    }
  };

  const resetForm = () => {
    setForm({
      branchname: "",
      phoneNumber: "",
      email: "",
      city: "",
      openingTime: "",
      closingTime: "",
      noOfHalls: 0,
      organization: "",
    });
    setEditingBranchId(null);
    setError(null);
  };

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex flex-1 justify-end me-9 text-lg">
            {editingBranchId ? 'Edit Branch' : 'Add Branch'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="container">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 grid-flow-row gap-4">
                  {/* Form Fields */}
                  <div className="w-full">
                    <label htmlFor="branchname" className="block text-gray-700 font-medium mb-2">Branch Name</label>
                    <input type="text" id="branchname" value={form.branchname} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input type="text" id="phoneNumber" value={form.phoneNumber} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input type="email" id="email" value={form.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                    <input type="text" id="city" value={form.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="openingTime" className="block text-gray-700 font-medium mb-2">Opening Time</label>
                    <input type="time" id="openingTime" value={form.openingTime} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="closingTime" className="block text-gray-700 font-medium mb-2">Closing Time</label>
                    <input type="time" id="closingTime" value={form.closingTime} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="noOfHalls" className="block text-gray-700 font-medium mb-2">Number of Halls</label>
                    <input type="number" id="noOfHalls" value={form.noOfHalls} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="organization" className="block text-gray-700 font-medium mb-2">Organization</label>
                    <select id="organization" value={form.organization} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                      <option value="">Select an organization</option>
                      {organizations.map(org => (
                        <option key={org._id} value={org._id}>{org.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 col-span-2">
                    <button type="submit" className="px-4 py-2 bg-red-950 text-white rounded-md hover:bg-red-900">
                      {editingBranchId ? 'Update Branch' : 'Submit'}
                    </button>
                    {editingBranchId && (
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

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Branches List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Branch Name</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Phone Number</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Email</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">City</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Opening Time</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Closing Time</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Number of Halls</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Organization</th>
              <th className="border text-xs text-white uppercase tracking-wider border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch._id}>
                <td className="border text-sm border-gray-300 px-4 py-2">{branch.branchname}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{branch.phoneNumber}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{branch.email}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{branch.city}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{branch.openingTime}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{branch.closingTime}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">{branch.noOfHalls}</td>
                <td className="border text-sm border-gray-300 px-4 py-2">
                  {organizations.find(org => org._id === branch.organization)?.name || 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button onClick={() => setEditingBranchId(branch._id)} className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchComponent;
