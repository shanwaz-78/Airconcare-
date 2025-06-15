import { Contract, FSMStatus } from "@/lib/types";
import { updateContractStatus } from "@/lib/api";
import React, { useState } from "react";

const ALL_STATUSES: FSMStatus[] = [
  "Quote Requested",
  "Quote Sent",
  "Accepted by Client",
  "Payment Completed",
  "Service Scheduled",
  "In Progress",
  "Completed",
];

export function StatusUpdateForm({ contract }: { contract: Contract }) {
  const [selectedStatus, setSelectedStatus] = useState<FSMStatus | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedStatus) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateContractStatus(contract.id, selectedStatus);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as FSMStatus)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="">Select new status</option>
        {ALL_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedStatus || isSubmitting}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Update
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
