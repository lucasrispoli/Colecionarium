import { AlbumPage } from "../types/Album";

interface AlbumPageCardProps {
  page: AlbumPage;
  stickerCount?: number;
  collectedCount?: number;
}

export default function AlbumPageCard({
  page,
  stickerCount = 0,
  collectedCount = 0,
}: AlbumPageCardProps) {
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
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>
            {collectedCount}/{stickerCount} collected
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  stickerCount > 0 ? (collectedCount / stickerCount) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </a>
  );
}
