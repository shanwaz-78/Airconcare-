import { Metadata } from "next";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "AirconCare - Admin Dashboard",
};

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              All Contracts
            </h2>
            <AdminDashboardClient />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
