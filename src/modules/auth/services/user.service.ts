import { User } from "../types/User";

export async function getUsers(): Promise<User[]> {
  const { http } = await import("@/shared/services/http");
  return http<User[]>("/user");
}

export async function getUserById(id: string): Promise<User> {
  const { http } = await import("@/shared/services/http");
  return http<User>(`/user/${id}`);
}

export async function getUserByUsername(username: string): Promise<User> {
  const { http } = await import("@/shared/services/http");
  return http<User>(`/user/username/${username}`);
}

export async function createUser(data: {
  username: string;
  password: string;
  roleIds?: string[];
}): Promise<User> {
  const { http } = await import("@/shared/services/http");
  return http<User>("/user/create", {
    method: "POST",
    body: data,
  });
}

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<User> {
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
  newPassword: string
): Promise<void> {
  const { http } = await import("@/shared/services/http");
  return http<void>(`/user/${id}/password`, {
    method: "PATCH",
    body: { newPassword },
  });
}

export async function lockUser(id: string, until?: string): Promise<void> {
  const { http } = await import("@/shared/services/http");
  const query = until ? `?until=${until}` : "";
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
