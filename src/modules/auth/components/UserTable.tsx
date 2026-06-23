"use client";

import { useEffect, useState } from "react";
import { User } from "../types/User";
import { getUsers, deleteUser, lockUser, unlockUser } from "../services/user.service";
import Loading from "@/shared/components/Loading";
import Button from "@/shared/components/Button";

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      console.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch {
      console.error("Failed to delete user");
    }
  };

  const handleLock = async (id: string) => {
    try {
      await lockUser(id);
      fetchUsers();
    } catch {
      console.error("Failed to lock user");
    }
  };

  const handleUnlock = async (id: string) => {
    try {
      await unlockUser(id);
      fetchUsers();
    } catch {
      console.error("Failed to unlock user");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border">Username</th>
            <th className="p-3 text-left border">Roles</th>
            <th className="p-3 text-left border">Status</th>
            <th className="p-3 text-left border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="p-3 border">{user.username}</td>
              <td className="p-3 border">
                {user.roles.map((r) => r.name).join(", ")}
              </td>
              <td className="p-3 border">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.accountLocked
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.accountLocked ? "Locked" : "Active"}
                </span>
              </td>
              <td className="p-3 border">
                <div className="flex gap-2">
                  {user.accountLocked ? (
                    <Button
                      variant="secondary"
                      onClick={() => handleUnlock(user.id)}
                    >
                      Unlock
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      onClick={() => handleLock(user.id)}
                    >
                      Lock
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
