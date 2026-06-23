"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import Loading from "@/shared/components/Loading";
import { useStickers } from "@/modules/album/hooks/useSticker";
import { AlbumSticker } from "@/modules/album/types/Album";
import { createSticker, updateSticker } from "@/modules/album/services/album-sticker.service";
import StickerGrid from "@/modules/album/components/StickerGrid";

export default function StickerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { stickers, isLoading: stickersLoading, refetch } = useStickers(id);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return <Loading />;

  const handleToggleCollected = async (stickerId: string) => {
    const sticker = stickers.find((s) => s.id === stickerId);
    if (!sticker) return;

    try {
      await updateSticker(stickerId, { collected: !sticker.collected });
      refetch();
    } catch {
      console.error("Failed to update sticker");
    }
  };

  const handleCreateSticker = async () => {
    const numberStr = prompt("Sticker number:");
    if (!numberStr) return;
    const number = parseInt(numberStr, 10);
    if (isNaN(number)) return;

    const name = prompt("Sticker name (optional):") || undefined;

    try {
      await createSticker({
        pageId: id,
        number,
        name,
      });
      refetch();
    } catch {
      console.error("Failed to create sticker");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/albums" className="text-gray-600 hover:text-gray-900">
              ← Albums
            </a>
            <h1 className="text-xl font-bold">Stickers</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Page Stickers</h2>
            <p className="text-gray-500 text-sm mt-1">
              {stickers.filter((s) => s.collected).length} / {stickers.length}{" "}
              collected
            </p>
          </div>
          <button
            onClick={handleCreateSticker}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            New Sticker
          </button>
        </div>

        {stickersLoading ? (
          <Loading />
        ) : (
          <StickerGrid
            stickers={stickers}
            onToggleCollected={handleToggleCollected}
          />
        )}
      </main>
    </div>
  );
}
