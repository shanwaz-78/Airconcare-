"use client";

import { Contract } from "@/lib/types";
import { STATUS_COLORS, STATUS_TRANSITIONS } from "@/lib/constants";
import Link from "next/link";
import { StatusUpdateForm } from "./StatusUpdateForm";
import { formatDate } from "@/app/utils/formatDate";
import React from "react";

export function ContractAdminCard({ contract }: { contract: Contract }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Contract #{contract.id ? contract.id.slice(0, 6) : "N/A"} -{" "}
            {contract.acType}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              STATUS_COLORS[contract.status]
            }`}
          >
            {contract.status}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Client ID</p>
              <p className="text-sm font-medium text-gray-900">
                {contract.clientId ? contract.clientId.slice(0, 6) : "N/A"}...
              </p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-500">Units</p>
              <p className="text-sm font-medium text-gray-900">
                {contract.unitCount}
              </p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-sm font-medium text-gray-900">
                {contract.address}
              </p>
            </div>
          </div>
          <div>
            {contract.quoteAmount && (
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Quote Amount</p>
                <p className="text-sm font-medium text-gray-900">
                  ${Number(contract.quoteAmount).toFixed(2)}
                </p>
              </div>
            )}
            {contract.preferredDate && (
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-500">Preferred Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(contract.preferredDate)}
                </p>
              </div>
            )}
            {contract.serviceDate && (
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-500">Service Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(contract.serviceDate)}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <StatusUpdateForm contract={contract} />
        </div>
        <div className="mt-4">
          <Link
            href={`/admin/contracts/${contract.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
