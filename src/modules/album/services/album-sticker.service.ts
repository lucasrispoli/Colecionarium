import { AlbumSticker, AlbumStickerInput } from "../types/Album";

export async function getStickers(
  pageId?: string
): Promise<AlbumSticker[]> {
  const { http } = await import("@/shared/services/http");
  const query = pageId ? `?pageId=${pageId}` : "";
  return http<AlbumSticker[]>(`/sticker${query}`);
}

export async function getStickerById(id: string): Promise<AlbumSticker> {
  const { http } = await import("@/shared/services/http");
  return http<AlbumSticker>(`/sticker/${id}`);
}

export async function createSticker(
  data: AlbumStickerInput
): Promise<AlbumSticker> {
  const { http } = await import("@/shared/services/http");
  return http<AlbumSticker>("/sticker", {
    method: "POST",
    body: data,
  });
}

export async function updateSticker(
  id: string,
  data: AlbumStickerInput
): Promise<AlbumSticker> {
  const { http } = await import("@/shared/services/http");
  return http<AlbumSticker>(`/sticker/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteSticker(id: string): Promise<void> {
  const { http } = await import("@/shared/services/http");
  return http<void>(`/sticker/${id}`, {
    method: "DELETE",
  });
}
