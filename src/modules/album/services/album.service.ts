import { Album, CreateAlbumRequest } from "../types/Album";

export async function getAlbums(): Promise<Album[]> {
  const { http } = await import("@/shared/services/http");
  return http<Album[]>("/album");
}

export async function getAlbumById(id: string): Promise<Album> {
  const { http } = await import("@/shared/services/http");
  return http<Album>(`/album/${id}`);
}

export async function createAlbum(data: CreateAlbumRequest): Promise<Album> {
  const { http } = await import("@/shared/services/http");
  return http<Album>("/album", {
    method: "POST",
    body: data,
  });
}

export async function updateAlbum(
  id: string,
  data: Partial<Album>
): Promise<Album> {
  const { http } = await import("@/shared/services/http");
  return http<Album>(`/album/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteAlbum(id: string): Promise<void> {
  const { http } = await import("@/shared/services/http");
  return http<void>(`/album/${id}`, {
    method: "DELETE",
  });
}
