"use client";

import { AuthProvider } from "@/modules/auth/context/AuthContext";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
