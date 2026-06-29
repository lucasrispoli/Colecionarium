"use client";

import { useEffect, useState } from "react";
import { getPages, createPage } from "../services/album-page.service";
import { getStickers, deleteSticker } from "../services/album-sticker.service";
import { AlbumPage, AlbumSticker } from "../types/Album";
import Loading from "@/shared/components/Loading";
import StickerFormModal from "./StickerFormModal";
import StickerDetailModal from "./StickerDetailModal";

interface Props {
  isAuthor: boolean;
}

export default function AlbumBook({ isAuthor }: Props) {
  const [pages, setPages] = useState<AlbumPage[]>([]);
  const [stickers, setStickers] = useState<AlbumSticker[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Multi-select state
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);

  // Modals state
  const [isStickerFormOpen, setIsStickerFormOpen] = useState(false);
  const [stickerToEdit, setStickerToEdit] = useState<AlbumSticker | null>(null);
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [stickerToDetail, setStickerToDetail] = useState<AlbumSticker | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedPages = await getPages();
      const sortedPages = fetchedPages.sort((a, b) => a.numberPage - b.numberPage);
      setPages(sortedPages);
      
      const fetchedStickers = await getStickers();
      setStickers(fetchedStickers);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePage = async () => {
    const nextPageNumber = pages.length;
    const name = prompt("Nome da página:");
    if (!name) return;
    const description = prompt("Descrição:") || "";
    
    try {
      await createPage({ name, description, slots: 10 });
      fetchData();
    } catch {
      alert("Erro ao criar página");
    }
  };

  const currentPage = pages[currentPageIndex];
  const pageStickers = stickers.filter(s => s.pageId === currentPage?.id);

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      setSelectedStickers([]);
    }
  };

  const nextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      setSelectedStickers([]);
    }
  };

  const handleStickerClick = (sticker: AlbumSticker) => {
    if (!isAuthor) return;
    
    if (multiSelect) {
      setSelectedStickers(prev => 
        prev.includes(sticker.id) ? prev.filter(id => id !== sticker.id) : [...prev, sticker.id]
      );
    } else {
      setSelectedStickers(prev => 
        prev.includes(sticker.id) && prev.length === 1 ? [] : [sticker.id]
      );
    }
  };

  const handleStickerDoubleClick = (sticker: AlbumSticker) => {
    setStickerToDetail(sticker);
    setIsDetailOpen(true);
  };

  const openNewStickerForm = () => {
    if (!currentPage) return;
    setStickerToEdit(null);
    setIsStickerFormOpen(true);
  };

  const openEditStickerForm = () => {
    if (selectedStickers.length !== 1) return;
    const sticker = stickers.find(s => s.id === selectedStickers[0]);
    if (sticker) {
      setStickerToEdit(sticker);
      setIsStickerFormOpen(true);
    }
  };

  const handleDeleteStickers = async () => {
    if (!selectedStickers.length) return;
    if (confirm(`Deseja deletar ${selectedStickers.length} figurinha(s)?`)) {
      try {
        for (const id of selectedStickers) {
          await deleteSticker(id);
        }
        setSelectedStickers([]);
        fetchData();
      } catch {
        alert("Erro ao deletar figurinha(s)");
      }
    }
  };

  if (isLoading && !pages.length) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Book Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-black/80 dark:bg-black/80 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={prevPage}
            disabled={currentPageIndex === 0}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <span className="font-semibold text-lg text-gray-700 dark:text-gray-200 min-w-[100px] text-center">
            {currentPage ? `Página ${currentPage.numberPage}` : "Sem páginas"}
          </span>

          <button 
            onClick={nextPage}
            disabled={currentPageIndex >= pages.length - 1}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {isAuthor && (
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Multi Select</span>
              <input 
                type="checkbox" 
                checked={multiSelect}
                onChange={(e) => {
                  setMultiSelect(e.target.checked);
                  if (!e.target.checked) setSelectedStickers([]);
                }}
                className="w-5 h-5 accent-fuchsia-500 rounded"
              />
            </label>
            
            <div className="flex gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
              <button 
                disabled={selectedStickers.length !== 1}
                onClick={openEditStickerForm}
                className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 transition-colors font-medium"
              >
                Editar
              </button>
              <button 
                disabled={selectedStickers.length === 0}
                onClick={handleDeleteStickers}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors font-medium"
              >
                Excluir
              </button>
            </div>

            <button
              onClick={handleCreatePage}
              className="px-4 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium ml-2"
            >
              Nova Página
            </button>
          </div>
        )}
      </div>

      {/* Book Page Area */}
      <div className="bg-black/80 dark:bg-black/80 backdrop-blur-md rounded-[2rem] shadow-xl border border-gray-200 dark:border-gray-700 min-h-[600px] p-8 flex flex-col items-center relative overflow-hidden ring-4 ring-white/50 dark:ring-gray-800/50">
        
        {/* Book spine decorative effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-900/50" />

        {currentPage ? (
          <>
            <div className="text-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 w-full max-w-2xl">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                {currentPage.title || currentPage.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">{currentPage.description}</p>
              <div className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Página {currentPage.numberPage}
              </div>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {pageStickers.map(sticker => {
                const isSelected = selectedStickers.includes(sticker.id);
                return (
                  <div 
                    key={sticker.id}
                    onClick={() => handleStickerClick(sticker)}
                    onDoubleClick={() => handleStickerDoubleClick(sticker)}
                    className={`
                      relative group cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300
                      ${isSelected ? 'ring-4 ring-fuchsia-500 scale-105' : 'hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-700'}
                      ${!isAuthor && 'cursor-default hover:scale-100 hover:shadow-md'}
                    `}
                  >
                    <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-900 relative">
                      {sticker.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={sticker.photo.startsWith("data:image") ? sticker.photo : `data:image/jpeg;base64,${sticker.photo}`} 
                          alt={sticker.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                      
                      {/* Sticker Overlay Info */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                        <div className="text-white text-sm font-bold truncate">{sticker.name}</div>
                        <div className="text-white/70 text-xs font-mono">#{sticker.slot}</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Sticker Button */}
              {isAuthor && (
                <button
                  onClick={openNewStickerForm}
                  className="aspect-[3/4] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-100 flex items-center justify-center mb-2 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-sm font-medium">Adicionar</span>
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <h3 className="text-xl font-bold text-white">O Álbum está vazio</h3>
            {isAuthor && (
              <button onClick={handleCreatePage} className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30">
                Criar Primeira Página
              </button>
            )}
          </div>
        )}
      </div>

      {isStickerFormOpen && currentPage && (
        <StickerFormModal 
          pageId={currentPage.id}
          stickerToEdit={stickerToEdit}
          onClose={() => setIsStickerFormOpen(false)}
          onSaved={() => {
            setIsStickerFormOpen(false);
            fetchData();
          }}
        />
      )}

      {isDetailOpen && stickerToDetail && (
        <StickerDetailModal 
          sticker={stickerToDetail}
          pageName={pages.find(p => p.id === stickerToDetail.pageId)?.name || "Desconhecida"}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
}
