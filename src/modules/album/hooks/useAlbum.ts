"use client";

import { useCallback, useEffect, useState } from "react";
import { Album } from "../types/Album";
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from "../services/album.service";

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlbums = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAlbums();
      setAlbums(data);
    } catch {
      console.error("Failed to fetch albums");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return { albums, isLoading, refetch: fetchAlbums };
}

export function useAlbum(id: string) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getAlbumById(id)
      .then(setAlbum)
      .catch(() => console.error("Failed to fetch album"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const update = useCallback(
    async (data: Partial<Album>) => {
      if (!id) return;
      const updated = await updateAlbum(id, data);
      setAlbum(updated);
      return updated;
    },
    [id]
  );

  const remove = useCallback(async () => {
    if (!id) return;
    await deleteAlbum(id);
  }, [id]);

  return { album, isLoading, update, remove };
}

export function useCreateAlbum() {
  const [isLoading, setIsLoading] = useState(false);

  const create = useCallback(
    async (data: { name: string; description?: string; coverUrl?: string }) => {
      setIsLoading(true);
      try {
        const album = await createAlbum(data);
        return album;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { create, isLoading };
}
