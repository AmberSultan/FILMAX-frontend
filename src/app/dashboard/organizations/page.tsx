"use client";
import React, { useEffect, useState } from "react";

interface Address {
  area: string;
  postalCode: string;
}

interface Organization {
  _id: string;
  name: string;
  address: Address[];
}

const Dashboard: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [name, setName] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");

  useEffect(() => {
    fetchOrganizations();
  }, []);

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

  const handleCreateOrganization = async () => {
    const newOrganization: Partial<Organization> = {
      name,
      address: [
        {
          area,
          postalCode,
        },
      ],
    };

    try {
      const response = await fetch("http://localhost:4001/api/organizations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrganization),
      });

      const data = await response.json();
      if (data.success) {
        fetchOrganizations(); // Refresh the list after creating
      }
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  const handleDeleteOrganization = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4001/api/organizations/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        fetchOrganizations();
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  return (
    <div className="container mt-2">

      <div>
        <h2 className="mb-4 mt-4 text-lg">Create Organization</h2>
        <input
        className="me-2 py-1 rounded-lg"
          type="text"
          placeholder="   Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
        className="me-2 py-1 rounded-lg"
          type="text"
          placeholder="   Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <input
        className="me-2 py-1 rounded-lg"
          type="text"
          placeholder="   Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <button onClick={handleCreateOrganization}>Create</button>
      </div>

      <div>
        <h2 className="mt-4 text-lg">Organization</h2>
        <ul className="mt-5 ">
          {organizations.map((org) => (
            <li key={org._id}>
              {org.name} - {org.address[0]?.area}, {org.address[0]?.postalCode}
              <button
              className="ms-10 right-0"
               onClick={() => handleDeleteOrganization(org._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
