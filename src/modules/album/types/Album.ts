export interface AlbumDto {
  id: string;
  title: string;
  summary: string;
  authorId: string;
}

export interface AlbumPageDto {
  id: string;
  title: string;
  description: string;
  slots: number;
  numberPage: number;
}

export interface AlbumStickerDto {
  id: string;
  name: string;
  description: string;
  slot: number;
  imageTag: string;
  pageId: string;
  photo: string | null;
}

export interface AlbumInputDto {
  title: string;
  summary: string;
}

export interface AlbumPageInputDto {
  title: string;
  description: string;
  slots: number;
  albumId: string;
}

export interface AlbumStickerInputDto {
  name: string;
  description: string;
  slot: number;
  imageTag: string;
  pageId: string;
  photo: string | null;
}

export type Album = AlbumDto;
export type AlbumPage = AlbumPageDto;
export type AlbumSticker = AlbumStickerDto;
export type AlbumInput = AlbumInputDto;
export type AlbumPageInput = AlbumPageInputDto;
export type AlbumStickerInput = AlbumStickerInputDto;
