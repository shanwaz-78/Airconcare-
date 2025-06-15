"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                AirconCare
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : "/client/dashboard"
                  }
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <span className="text-sm text-gray-500 mr-4">
                  Logged in as {user.email} ({user.name})
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 mr-4"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
