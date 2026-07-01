"use client";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  const { user } = useAuth();

  const hasAdminRole = user?.roles?.some(
    (r) => r.name === "ADM" || r.name === "ROLE_ADM"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (!isLoading) {
        if (isAuthenticated) {
          if (hasAdminRole) {
            router.push("/admin/users");
          } else {
            router.push("/album");
          }
        } else {
          router.push("/login");
        }
      }
    }, 5000); // 5 seconds splash

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  if (showSplash || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-blue-700 to-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          {/* We will generate a logo later, for now using an icon placeholder */}
          <div className="w-32 h-32 mb-8 bg-white/10 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 bg-white bg-clip-text text-transparent drop-shadow-sm">
            Collecionarium
          </h1>
          <p className="text-blue-200/80 font-medium tracking-widest text-sm uppercase">
            v0.1.0
          </p>
        </div>
      </div>
    );
  }

  return null;
}
