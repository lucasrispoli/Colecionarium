import { AlbumSticker } from "../types/Album";
import StickerCard from "./StickerCard";

interface StickerGridProps {
  stickers: AlbumSticker[];
}

export default function StickerGrid({ stickers }: StickerGridProps) {
  if (stickers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">No stickers found</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stickers.map((sticker) => (
        <StickerCard key={sticker.id} sticker={sticker} />
      ))}
    </div>
  );
}
