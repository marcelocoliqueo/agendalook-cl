'use client';

import { useState } from 'react';
import { Play, CheckCircle } from 'lucide-react';

interface LoomVideoPlayerProps {
  videoId: string;
  title?: string;
  onComplete?: () => void;
  autoplay?: boolean;
  className?: string;
}

export function LoomVideoPlayer({
  videoId,
  title = 'Video Tutorial',
  onComplete,
  autoplay = false,
  className = ''
}: LoomVideoPlayerProps) {
  const [hasWatched, setHasWatched] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  // Construir URL del embed de Loom
  const embedUrl = `https://www.loom.com/embed/${videoId}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true${autoplay ? '&autoplay=1' : ''}`;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setHasWatched(true);
    onComplete?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Contenedor del video */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-900">
        {/* Proporción 16:9 */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {!isPlaying ? (
            // Thumbnail con botón de play
            <div
              onClick={handlePlay}
              className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#FF8C61] cursor-pointer group"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-6 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-2xl">
                  <Play className="h-12 w-12 text-[#FF6B35] ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-semibold text-lg">{title}</p>
                <p className="text-white/80 text-sm mt-1">Haz clic para reproducir</p>
              </div>
            </div>
          ) : (
            // Iframe de Loom
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              allowFullScreen
              onEnded={handleVideoEnd}
            />
          )}
        </div>
      </div>

      {/* Indicador de completado */}
      {hasWatched && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 animate-in fade-in duration-300">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">¡Video completado!</p>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 mt-0.5">💡</div>
          <div className="text-blue-900 space-y-1">
            <p className="font-medium">Consejos para aprovechar el video:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800 ml-2">
              <li>Puedes pausar en cualquier momento</li>
              <li>Activa pantalla completa para ver mejor los detalles</li>
              <li>Toma notas de los pasos importantes</li>
              <li>Puedes volver a ver el tutorial cuando quieras desde el menú de Ayuda</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



