"use client";

import { useState, useEffect } from "react";
import { AlbumSticker, AlbumStickerInput } from "../types/Album";
import { createSticker, updateSticker } from "../services/album-sticker.service";
import MD5 from "crypto-js/md5";
import encBase64 from "crypto-js/enc-base64";
import encHex from "crypto-js/enc-hex";

interface Props {
  pageId: string;
  stickerToEdit?: AlbumSticker | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function StickerFormModal({ pageId, stickerToEdit, onClose, onSaved }: Props) {
  const [name, setName] = useState(stickerToEdit?.name || "");
  const [slot, setSlot] = useState<number>(stickerToEdit?.slot || 1);
  const [description, setDescription] = useState(stickerToEdit?.description || "");
  const [imageTag, setImageTag] = useState(stickerToEdit?.imageTag || "");
  const [photo, setPhoto] = useState<string | null>(stickerToEdit?.photo || null);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate if it's an image
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem válido (png, jpg, jpeg).");
      return;
    }
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhoto(result);
      
      // Calculate MD5 of the base64 string
      const hash = MD5(result).toString(encHex);
      setImageTag(hash);
    };
    reader.onerror = () => {
      setError("Erro ao ler o arquivo.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }

    if (!slot) {
      setError("O número é obrigatório.");
      return;
    }

    if (!imageTag || !photo) {
      setError("A imagem é obrigatória e a Tag (MD5) deve ser gerada.");
      return;
    }

    setIsLoading(true);

    try {
      // Remove data:image/...;base64, prefix
      const base64Data = photo.includes("base64,") ? photo.split("base64,")[1] : photo;

      const payload: AlbumStickerInput = {
        name,
        description,
        slot,
        imageTag,
        pageId,
        photo: base64Data
      };

      if (stickerToEdit) {
        await updateSticker(stickerToEdit.id, payload);
      } else {
        await createSticker(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.title || "Erro ao salvar figurinha. O número pode já estar em uso.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{stickerToEdit ? "Editar Figurinha" : "Nova Figurinha"}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
                Número
              </label>
              <input
                type="number"
                value={slot}
                onChange={(e) => setSlot(parseInt(e.target.value))}
                min={1}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
              Foto (Upload)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
            />
          </div>

          {photo && (
            <div className="mt-2 w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
              Tag (MD5) - Gerado Automáticamente
            </label>
            <input
              type="text"
              value={imageTag}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 font-mono text-sm cursor-not-allowed"
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
