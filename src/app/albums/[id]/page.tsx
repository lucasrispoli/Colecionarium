"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import Loading from "@/shared/components/Loading";
import { useAlbum } from "@/modules/album/hooks/useAlbum";
import { AlbumPage } from "@/modules/album/types/Album";
import { getPages, createPage } from "@/modules/album/services/album-page.service";
import AlbumPageCard from "@/modules/album/components/AlbumPageCard";

export default function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { album, isLoading: albumLoading, remove } = useAlbum(id);
  const [pages, setPages] = useState<AlbumPage[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (id) {
      setPagesLoading(true);
      getPages()
        .then(setPages)
        .catch(() => console.error("Failed to fetch pages"))
        .finally(() => setPagesLoading(false));
    }
  }, [id]);

  if (isLoading || !isAuthenticated) return <Loading />;
  if (albumLoading) return <Loading />;

  if (!album) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Album not found</p>
      </div>
    );
  }

  const handleCreatePage = async () => {
    const name = prompt("Page title:");
    if (!name) return;
    const description = prompt("Page description:") || "";
    const slotsStr = prompt("Page slots:");
    if (!slotsStr) return;
    const slots = parseInt(slotsStr, 10);
    if (isNaN(slots)) return;

    try {
      const newPage = await createPage({
        name,
        description,
        slots,
      });
      setPages((prev) => [...prev, newPage]);
    } catch {
      console.error("Failed to create page");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this album?")) return;
    try {
      await remove();
      router.push("/albums");
    } catch {
      console.error("Failed to delete album");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/albums" className="text-gray-600 hover:text-gray-900">
              Albums
            </a>
            <h1 className="text-xl font-bold">{album.title}</h1>
          </div>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Album
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {album.summary && (
          <p className="text-gray-600 mb-6">{album.summary}</p>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pages</h2>
          <button
            onClick={handleCreatePage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            New Page
          </button>
        </div>

        {pagesLoading ? (
          <Loading />
        ) : pages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No pages yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pages
              .sort((a, b) => a.numberPage - b.numberPage)
              .map((page) => (
                <AlbumPageCard key={page.id} page={page} />
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
