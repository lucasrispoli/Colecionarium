import { AlbumSticker } from "../types/Album";

interface StickerCardProps {
  sticker: AlbumSticker;
}

export default function StickerCard({ sticker }: StickerCardProps) {
  return (
    <div className="border rounded-lg p-4 transition-all bg-white border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-mono text-gray-500">
            #{sticker.slot}
          </span>
          {sticker.name && (
            <h4 className="font-medium mt-1">{sticker.name}</h4>
          )}
          {sticker.description && (
            <p className="text-gray-600 text-sm mt-1">{sticker.description}</p>
          )}
          {sticker.imageTag && (
            <p className="text-gray-500 text-xs mt-1">{sticker.imageTag}</p>
          )}
        </div>
      </div>
      {sticker.photo && (
        <img
          src={`data:image/png;base64,${sticker.photo}`}
          alt={sticker.name || `Sticker #${sticker.slot}`}
          className="w-full h-32 object-cover rounded mt-3"
        />
      )}
    </div>
  );
}
