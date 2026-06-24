"use client";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import UserTable from "@/modules/auth/components/UserTable";
import MainLayout from "@/shared/components/MainLayout";

export default function UsersPage() {
  const { user } = useAuth();

  const hasAdminRole = user?.roles?.some(
    (r) => r.name === "ADM" || r.name === "ROLE_ADM" || r.name === "DEV"
  );

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Usuários</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gerencie os usuários e permissões do sistema.</p>
      </div>

      {hasAdminRole ? (
        <UserTable />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Acesso Negado</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2">Você não tem permissão para visualizar esta página. Faça login com uma conta de Administrador.</p>
        </div>
      )}
    </MainLayout>
  );
}
