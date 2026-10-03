"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/utils/useApp";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "investor" | "admin" | "manager";
}

export default function ProtectedRoute({
  children,
  requiredRole = "investor",
}: ProtectedRouteProps) {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/");
      } else if (requiredRole && user.role !== requiredRole) {
        router.replace("/");
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040B18] flex items-center justify-center text-slate-400">
        <p className="animate-pulse text-sm">Loading session...</p>
      </div>
    );
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null; // Prevent rendering protected content before redirect completes
  }

  return <>{children}</>;
}