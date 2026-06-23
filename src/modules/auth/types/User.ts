export interface User {
  id: string;
  username: string;
  roles: Role[];
  accountLocked: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  lockUntil: string | null;
  updatedAt: string | null;
}

export interface Role {
  id: string;
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface UpdatePasswordRequest {
  newPassword: string;
}
