import { Album } from "../types/Album";

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <a
      href={`/albums/${album.id}`}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        {album.coverUrl ? (
          <img
            src={album.coverUrl}
            alt={album.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">No cover</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{album.name}</h3>
        {album.description && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {album.description}
          </p>
        )}
      </div>
    </a>
  );
}
