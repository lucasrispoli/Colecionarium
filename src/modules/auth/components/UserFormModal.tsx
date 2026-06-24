"use client";

import { useState, useEffect } from "react";
import { createUser, updateUser, updatePassword } from "../services/user.service";
import { User, UserInput } from "../types/User";

interface Props {
  userToEdit?: User | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function UserFormModal({ userToEdit, onClose, onSaved }: Props) {
  const [username, setUsername] = useState(userToEdit?.username || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(userToEdit?.roles?.[0]?.name.replace("ROLE_", "") || "ADM");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.username);
      setRole(userToEdit.roles?.[0]?.name.replace("ROLE_", "") || "ADM");
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("O nome não pode ser vazio.");
      return;
    }

    if (!userToEdit && !password) {
      setError("Senha é obrigatória para novos usuários.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: UserInput = {
        username,
        password: password || undefined,
        roles: [role],
        accountLocked: userToEdit ? userToEdit.accountLocked : false,
      };

      if (userToEdit) {
        await updateUser(userToEdit.id, payload);
      } else {
        await createUser(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.title || "Erro ao salvar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!userToEdit) return;
    setIsLoading(true);
    try {
      // Zerar senha gera senha padrao 123456 (ou username)
      await updatePassword(userToEdit.id, "123456");
      alert("Senha redefinida para '123456'");
    } catch (err: any) {
      setError(err.title || "Erro ao zerar senha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <h2 className="text-2xl font-bold mb-6">{userToEdit ? "Editar Usuário" : "Novo Usuário"}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
              Nome
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Senha {userToEdit && "(Deixe vazio para não alterar)"}
              </label>
              {userToEdit && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold"
                >
                  Zerar Senha
                </button>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required={!userToEdit}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
              Perfil
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              required
            >
              <option value="ADM">Administrador</option>
              <option value="AUTOR">Autor</option>
              <option value="COLECIONADOR">Colecionador</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70"
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
