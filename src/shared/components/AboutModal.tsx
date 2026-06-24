"use client";

interface Props {
  onClose: () => void;
}

export default function AboutModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Sobre o Projeto</h2>
        <p className="text-indigo-300 text-sm mb-6">Trabalho da disciplina</p>

        <div className="space-y-4 text-gray-300 text-sm">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="font-semibold text-white mb-1">Nome do trabalho</p>
            <p>Álbum de Figurinhas</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="font-semibold text-white mb-1">Integrantes</p>
            <ul className="list-disc list-inside">
              <li>Membro 1</li>
              <li>Membro 2</li>
              <li>Membro 3</li>
            </ul>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/5 grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-white mb-1">Disciplina</p>
              <p>IST</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Professor</p>
              <p>Mozar Silva</p>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="font-semibold text-white mb-1">Tecnologias Utilizadas</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">Java</span>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">Spring Boot</span>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">Next.js</span>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">Tailwind CSS</span>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">SQLite</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
