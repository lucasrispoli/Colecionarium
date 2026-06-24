"use client";

import { useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/shared/components/Loading";
import { User } from "@/modules/auth/types/User";

function getRedirectPath(user: User | null) {
  if (!user) return "/login";
  const roles = user.roles.map((r) => r.name);
  if (roles.includes("ROLE_ADM") || roles.includes("ADM")) {
    return "/admin/users";
  }
  return "/album"; // Default for Autor and Colecionador
}

export default function LoginPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(getRedirectPath(user));
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading || isAuthenticated) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl transition-all duration-300">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

function LoginForm() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ username, password });
      // The useEffect in LoginPage will handle redirection once 'user' is populated,
      // but if we want to redirect immediately without waiting for the re-render:
      // However, 'user' state might be slightly delayed. Let's rely on useEffect.
    } catch (err: unknown) {
      const apiError = err as { title?: string };
      setError(apiError.title || "Credenciais inválidas ou erro no servidor");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo(a)</h1>
        <p className="text-indigo-200 text-sm">Faça login para acessar o Collecionarium</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm backdrop-blur-sm animate-pulse">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="username">
            Usuário
          </label>
          <input
            id="username"
            type="text"
            placeholder="Digite seu nome"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-indigo-900 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2"
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : "Entrar"}
      </button>
    </form>
  );
}
