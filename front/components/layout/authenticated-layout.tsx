"use client";

import { useAuth } from "@/contexts/auth-context";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
