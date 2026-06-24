"use client";

import { AlbumSticker } from "../types/Album";

interface Props {
  sticker: AlbumSticker;
  pageName: string;
  onClose: () => void;
}

export default function StickerDetailModal({ sticker, pageName, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close button (mobile absolute, desktop flow) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image side */}
        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-900 relative">
          {sticker.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sticker.photo.startsWith("data:image") ? sticker.photo : `data:image/jpeg;base64,${sticker.photo}`} alt={sticker.name} className="w-full h-full object-cover min-h-[300px]" />
          ) : (
            <div className="w-full h-full min-h-[300px] flex items-center justify-center text-gray-300">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="absolute top-4 left-4">
            <div className="bg-fuchsia-500 text-white font-bold px-3 py-1 rounded-lg shadow-lg">
              #{sticker.slot}
            </div>
          </div>
        </div>

        {/* Content side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{sticker.name}</h2>
            <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-semibold tracking-wide">
              {pageName}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descrição</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {sticker.description || "Nenhuma descrição disponível."}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tag (MD5)</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <code className="text-sm font-mono text-fuchsia-600 dark:text-fuchsia-400 break-all">
                  {sticker.imageTag}
                </code>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
