"use client";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/shared/components/Loading";
import { useAlbums, useCreateAlbum } from "@/modules/album/hooks/useAlbum";
import AlbumGrid from "@/modules/album/components/AlbumGrid";

export default function AlbumsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { albums, isLoading: albumsLoading, refetch } = useAlbums();
  const { create, isLoading: isCreating } = useCreateAlbum();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return <Loading />;

  const handleCreate = async () => {
    const title = prompt("Album title:");
    if (!title) return;
    const summary = prompt("Album summary:") || "";
    await create({ title, summary });
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Albums</h1>
          <nav className="flex gap-4 items-center">
            <a href="/albums" className="text-blue-600 font-medium">
              Albums
            </a>
            <a href="/users" className="text-gray-600 hover:text-gray-900">
              Users
            </a>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Albums</h2>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "New Album"}
          </button>
        </div>

        {albumsLoading ? <Loading /> : <AlbumGrid albums={albums} />}
      </main>
    </div>
  );
}
