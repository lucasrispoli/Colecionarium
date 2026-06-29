"use client";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import AboutModal from "./AboutModal";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const roleName = user?.roles?.[0]?.name?.replace("ROLE_", "") || "";

  return (
    <>
      <header className="w-full bg-black/80 backdrop-blur-x1 border-b border-white/70 shadow-sm z-40 fixed top-0 left-0 bottom-10 right-0 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Collecionarium</span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-none">{user?.username}</p>
              <p className="text-xs text-indigo-300 mt-1">{roleName}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 border-2 border-white/20 flex items-center justify-center text-white font-bold overflow-hidden shadow-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden z-50 transform origin-top-right transition-all">
              <div className="px-4 py-3 border-b border-white/10 sm:hidden">
                <p className="text-sm font-semibold text-white">{user?.username}</p>
                <p className="text-xs text-indigo-300">{roleName}</p>
              </div>
              <button 
                onClick={() => { setIsPasswordModalOpen(true); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-indigo-600/30 hover:text-white transition-colors"
              >
                Mudar Senha
              </button>
              <button 
                onClick={() => { setIsAboutModalOpen(true); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-indigo-600/30 hover:text-white transition-colors"
              >
                Sobre
              </button>
              <div className="border-t border-white/10 mt-1 pt-1">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {isPasswordModalOpen && (
        <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />
      )}

      {isAboutModalOpen && (
        <AboutModal onClose={() => setIsAboutModalOpen(false)} />
      )}
    </>
  );
}
