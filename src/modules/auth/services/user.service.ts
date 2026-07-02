import { PageResponse, User, UserInput } from "../types/User";

export async function getUsers(filter?: string): Promise<PageResponse<User>> {
  const { http } = await import("@/shared/services/http");
  const query = filter ? `?filter=${encodeURIComponent(filter)}` : "";
  return http<PageResponse<User>>(`/user${query}`);
}

export async function getUserById(id: string): Promise<User> {
  const { http } = await import("@/shared/services/http");
  return http<User>(`/user/${id}`);
}

export async function getUserByUsername(username: string): Promise<User> {
  const { http } = await import("@/shared/services/http");
  return http<User>(`/user/username/${username}`);
}

export async function createUser(data: UserInput): Promise<User> {
  const { http } = await import("@/shared/services/http");
  return http<User>("/user/create", {
    method: "POST",
    body: data,
  });
}

export async function updateUser(id: string, data: UserInput): Promise<User> {
  const { http } = await import("@/shared/services/http");
  return http<User>(`/user/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteUser(id: string): Promise<void> {
  const { http } = await import("@/shared/services/http");
  return http<void>(`/user/${id}`, {
    method: "DELETE",
  });
}

export async function updatePassword(
  id: string,
  password: string
): Promise<void> {
  const { http } = await import("@/shared/services/http");
  return http<void>(`/user/${id}/password?password=${encodeURIComponent(password)}`, {
    method: "PATCH",
  });
}

export async function resetPassword(id: string): Promise<void> {
  const { http } = await import("@/shared/services/http");
  return http<void>(`/user/${id}/reset-password`, {
    method: "POST",
  });
}

export async function lockUser(id: string, until?: string): Promise<void> {
  const { http } = await import("@/shared/services/http");
  const query = until ? `?until=${encodeURIComponent(until)}` : "";
  return http<void>(`/user/${id}/lock${query}`, {
    method: "PATCH",
  });
}

export async function unlockUser(id: string): Promise<void> {
  const { http } = await import("@/shared/services/http");
  return http<void>(`/user/${id}/unlock`, {
    method: "PATCH",
  });
}
