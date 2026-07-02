"use client";

import { useState } from "react";
import { createPage, updatePage } from "../services/album-page.service";
import { AlbumPage, AlbumPageInput } from "../types/Album";

interface Props {
  albumId: string;
  pageToEdit?: AlbumPage | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AlbumPageFormModal({ albumId, pageToEdit, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(pageToEdit?.title || "");
  const [description, setDescription] = useState(pageToEdit?.description || "");
  const [slots, setSlots] = useState(pageToEdit?.slots || 10);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("O título não pode ser vazio.");
      return;
    }

    if (slots < 0) {
      setError("A quantidade de slots não pode ser negativa.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: AlbumPageInput = {
        title,
        description,
        slots,
        albumId,
      };

      if (pageToEdit) {
        await updatePage(pageToEdit.id, payload);
      } else {
        await createPage(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.title || "Erro ao salvar página");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <h2 className="text-2xl text-white font-bold mb-6">
          {pageToEdit ? "Editar Página" : "Nova Página"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-white w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
              Quantidade de Slots
            </label>
            <input
              type="number"
              min="0"
              value={slots}
              onChange={(e) => setSlots(parseInt(e.target.value))}
              className="text-white w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
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
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-800/30 disabled:opacity-70"
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
