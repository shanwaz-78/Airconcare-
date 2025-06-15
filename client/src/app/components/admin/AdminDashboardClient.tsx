"use client";

import React, { useEffect, useState } from "react";
import { getAdminContracts } from "@/lib/api";
import { ContractAdminCard } from "@/components/admin/   ContractAdminCard";
import { Contract } from "@/lib/types";
import FullPageSkeleton from "../FullPageSkeleton";

const AdminDashboardClient = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await getAdminContracts();
        setContracts(data);
      } catch (error) {
        console.error("Failed to load contracts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  if (loading) return <FullPageSkeleton />;

  return (
    <div className="grid grid-cols-1 gap-6">
      {contracts?.map((contract) => (
        <ContractAdminCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
};

export default AdminDashboardClient;
