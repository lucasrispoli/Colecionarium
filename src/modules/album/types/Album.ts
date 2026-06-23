export interface Album {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface AlbumPage {
  id: string;
  albumId: string;
  numberPage: number;
  title?: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface AlbumSticker {
  id: string;
  pageId: string;
  number: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  collected: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateAlbumRequest {
  name: string;
  description?: string;
  coverUrl?: string;
}

export interface CreatePageRequest {
  albumId: string;
  numberPage: number;
  title?: string;
}

export interface CreateStickerRequest {
  pageId: string;
  number: number;
  name?: string;
  description?: string;
  imageUrl?: string;
}
