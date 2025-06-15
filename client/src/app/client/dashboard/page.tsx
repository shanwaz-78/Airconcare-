"use client";

import { useEffect, useState } from "react";
import { ContractCard } from "@/components/client/ContractCard";
import { NewContractForm } from "@/components/client/ NewContractForm";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import { getContract } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Contract } from "@/lib/types";
import FullPageSkeleton from "@/app/components/FullPageSkeleton";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchContracts = async () => {
    try {
      if (user) {
        const data = await getContract(user.id);
        console.log(data);
        if (data && Array.isArray(data)) {
          setContracts(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch contracts", err);
      setContracts([]);
    } finally {
      setLoadingContracts(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user]);

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchContracts();
  };

  return (
    <ProtectedRoute>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">My Contracts</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {showForm ? "Close" : "Add Contract"}
            </button>
          </div>

          {showForm && (
            <div className="mt-4">
              <NewContractForm onSuccess={handleFormSuccess} />
            </div>
          )}

          <div className="mt-8">
            {loadingContracts ? (
              <FullPageSkeleton />
            ) : contracts.length === 0 ? (
              <p className="text-center color-red text-2xl">
                No contracts found.
              </p>
            ) : (
              contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
