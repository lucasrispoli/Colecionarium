import { AlbumPage, AlbumPageInput } from "../types/Album";

export async function getPages(): Promise<AlbumPage[]> {
  const { http } = await import("@/shared/services/http");
  return http<AlbumPage[]>("/page");
}

export async function getPageById(id: string): Promise<AlbumPage> {
  const { http } = await import("@/shared/services/http");
  return http<AlbumPage>(`/page/${id}`);
}

export async function getPageByNumber(
  numberPage: number
): Promise<AlbumPage> {
  const { http } = await import("@/shared/services/http");
  return http<AlbumPage>(`/page/by-number/${numberPage}`);
}

export async function createPage(
  data: AlbumPageInput
): Promise<AlbumPage> {
  const { http } = await import("@/shared/services/http");
  return http<AlbumPage>("/page", {
    method: "POST",
    body: data,
  });
}

export async function updatePage(
  id: string,
  data: AlbumPageInput
): Promise<AlbumPage> {
  const { http } = await import("@/shared/services/http");
  return http<AlbumPage>(`/page/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deletePage(id: string): Promise<void> {
  const { http } = await import("@/shared/services/http");
  return http<void>(`/page/${id}`, {
    method: "DELETE",
  });
}
