"use client";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./Loading";
import Topbar from "./Topbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return <Loading />;

  return (
<div className="min-h-screen bg-blue-950 text-black flex flex-col">
        <Topbar />
      <main className="flex-1 pt-22 p-4 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
