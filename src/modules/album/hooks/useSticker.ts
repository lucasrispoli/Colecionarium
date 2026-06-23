"use client";

import { useCallback, useEffect, useState } from "react";
import { AlbumSticker } from "../types/Album";
import {
  getStickers,
  getStickerById,
  createSticker,
  updateSticker,
  deleteSticker,
} from "../services/album-sticker.service";

export function useStickers(pageId?: string) {
  const [stickers, setStickers] = useState<AlbumSticker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStickers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getStickers(pageId);
      setStickers(data);
    } catch {
      console.error("Failed to fetch stickers");
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchStickers();
  }, [fetchStickers]);

  return { stickers, isLoading, refetch: fetchStickers };
}

export function useSticker(id: string) {
  const [sticker, setSticker] = useState<AlbumSticker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getStickerById(id)
      .then(setSticker)
      .catch(() => console.error("Failed to fetch sticker"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const update = useCallback(
    async (data: Partial<AlbumSticker>) => {
      if (!id) return;
      const updated = await updateSticker(id, data);
      setSticker(updated);
      return updated;
    },
    [id]
  );

  const toggleCollected = useCallback(async () => {
    if (!sticker) return;
    const updated = await updateSticker(sticker.id, {
      collected: !sticker.collected,
    });
    setSticker(updated);
    return updated;
  }, [sticker]);

  const remove = useCallback(async () => {
    if (!id) return;
    await deleteSticker(id);
  }, [id]);

  return { sticker, isLoading, update, toggleCollected, remove };
}

export function useCreateSticker() {
  const [isLoading, setIsLoading] = useState(false);

  const create = useCallback(
    async (data: {
      pageId: string;
      number: number;
      name?: string;
      description?: string;
      imageUrl?: string;
    }) => {
      setIsLoading(true);
      try {
        const sticker = await createSticker(data);
        return sticker;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { create, isLoading };
}
