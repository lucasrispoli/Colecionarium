"use client";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/shared/components/Loading";
import UserTable from "@/modules/auth/components/UserTable";

export default function UsersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return null;

  const hasAdminRole = user?.roles.some(
    (r) => r.name === "ADM" || r.name === "DEV"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Users</h1>
          <nav className="flex gap-4">
            <a href="/albums" className="text-gray-600 hover:text-gray-900">
              Albums
            </a>
            <a href="/users" className="text-blue-600 font-medium">
              Users
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {hasAdminRole ? (
          <UserTable />
        ) : (
          <div className="text-center py-12 text-gray-500">
            You don&apos;t have permission to view this page.
          </div>
        )}
      </main>
    </div>
  );
}
