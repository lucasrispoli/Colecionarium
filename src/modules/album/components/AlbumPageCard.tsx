import { AlbumPage } from "../types/Album";

interface AlbumPageCardProps {
  page: AlbumPage;
}

export default function AlbumPageCard({ page }: AlbumPageCardProps) {
  return (
    <a
      href={`/stickers/${page.id}`}
      className="block border rounded-lg p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Page {page.numberPage}</h3>
          {page.title && (
            <p className="text-gray-600 text-sm">{page.title}</p>
          )}
          {page.description && (
            <p className="text-gray-500 text-sm">{page.description}</p>
          )}
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>{page.slots} slots</div>
        </div>
      </div>
    </a>
  );
}
