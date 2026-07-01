"use client";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import MainLayout from "@/shared/components/MainLayout";
import AlbumBook from "@/modules/album/components/AlbumBook";

export default function AlbumPage() {
  const { user } = useAuth();

  const isAuthor = user?.roles?.some(
    (r) => r.name === "AUTHOR" || r.name === "ROLE_AUTHOR" || r.name === "ADM" || r.name === "ROLE_ADM"
  );

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Álbum de Figurinhas</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {isAuthor ? "Gerencie as figurinhas do álbum." : "Visualize as suas figurinhas da coleção."}
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-5xl mx-auto">
        <AlbumBook isAuthor={true} />
      </div>
    </MainLayout>
  );
}
