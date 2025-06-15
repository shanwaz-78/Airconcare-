"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import FullPageSkeleton from "./FullPageSkeleton";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  console.log(user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user && pathname !== "/login") {
      router.push("/login");
    }

    if (user && pathname === "/login") {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/client/dashboard");
      }
    }

    if (user && user.role === "admin" && pathname.startsWith("/client")) {
      router.push("/admin/dashboard");
    }

    if (user && user.role === "client" && pathname.startsWith("/admin")) {
      router.push("/client/dashboard");
    }
  }, [user, loading, pathname, router]);

  if (loading) return <FullPageSkeleton />;

  if (user || pathname === "/login") {
    return children;
  }

  return null;
}
