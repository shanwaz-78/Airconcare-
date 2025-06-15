import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";
import React from "react";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
export const metadata: Metadata = {
  title: "AirconCare - Login",
};

export default function LoginPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <LoginForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
