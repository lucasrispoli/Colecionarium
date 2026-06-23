import { AlbumSticker } from "../types/Album";

interface StickerCardProps {
  sticker: AlbumSticker;
  onToggleCollected?: (id: string) => void;
}

export default function StickerCard({ sticker, onToggleCollected }: StickerCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        sticker.collected
          ? "bg-green-50 border-green-300"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-mono text-gray-500">
            #{sticker.number}
          </span>
          {sticker.name && (
            <h4 className="font-medium mt-1">{sticker.name}</h4>
          )}
          {sticker.description && (
            <p className="text-gray-600 text-sm mt-1">{sticker.description}</p>
          )}
        </div>
        <button
          onClick={() => onToggleCollected?.(sticker.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            sticker.collected
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-500"
          }`}
          title={sticker.collected ? "Mark as not collected" : "Mark as collected"}
        >
          {sticker.collected && "✓"}
        </button>
      </div>
      {sticker.imageUrl && (
        <img
          src={sticker.imageUrl}
          alt={sticker.name || `Sticker #${sticker.number}`}
          className="w-full h-32 object-cover rounded mt-3"
        />
      )}
    </div>
  );
}
