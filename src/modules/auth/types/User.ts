export interface UserDto {
  id: string;
  username: string;
  roles: Role[] | null;
  accountLocked: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  lockUntil: string | null;
  updatedAt: string | null;
}

export interface RoleDto {
  id: string;
  name: string;
}

export interface UserCredentialDto {
  id: string;
  credential: string;
  credentialType: CredentialType;
}

export interface UserAuthInputDto {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserInputDto {
  username: string;
  password: string;
  roleIds?: string[];
}

export interface UserCredentialInputDto {
  credential: string;
  credentialType: CredentialType;
}

export interface RoleInputDto {
  name: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: PageSort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: PageSort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export type User = UserDto;
export type Role = RoleDto;
export type UserCredential = UserCredentialDto;
export type LoginRequest = UserAuthInputDto;
export type CreateUserRequest = UserInputDto;
export type UserInput = UserInputDto;
export type UserCredentialInput = UserCredentialInputDto;
export type RoleInput = RoleInputDto;
export type CredentialType = "EMAIL" | "PHONE" | "STEAMID";

export interface PageSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
