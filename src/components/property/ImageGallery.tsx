import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize, X, Building } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const validImages = images && images.length > 0 ? images : [''];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const currentHasError = imageErrors[currentIndex] || !validImages[currentIndex];

  return (
    <div className="space-y-3">
      {/* Primary Display Viewport */}
      <div className="relative aspect-16/10 sm:aspect-16/9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
        {!currentHasError ? (
          <img
            src={validImages[currentIndex]}
            alt={`${title} - Photo ${currentIndex + 1}`}
            referrerPolicy="no-referrer"
            onError={() => handleImageError(currentIndex)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-6">
            <Building className="w-12 h-12 text-emerald-700/40 mb-2" />
            <p className="text-xs font-semibold text-slate-600">{title}</p>
            <p className="text-[11px] text-slate-400">High-Resolution Architectural Photo</p>
          </div>
        )}

        {/* Counter Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-mono px-2.5 py-1 rounded">
          {currentIndex + 1} / {validImages.length}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setFullscreenOpen(true)}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/80 hover:bg-white text-slate-800 transition-colors shadow-xs cursor-pointer"
          title="Full Screen View"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-colors cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-colors cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Bar */}
      {validImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                currentIndex === idx
                  ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              {!imageErrors[idx] && img ? (
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(idx)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                  Photo {idx + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[85vh] w-full flex items-center justify-center relative">
            {!currentHasError ? (
              <img
                src={validImages[currentIndex]}
                alt={`${title} fullscreen`}
                referrerPolicy="no-referrer"
                className="max-h-[85vh] max-w-full object-contain rounded"
              />
            ) : (
              <div className="text-white text-center">
                <Building className="w-16 h-16 mx-auto mb-2 text-emerald-400" />
                <p className="font-semibold">{title}</p>
              </div>
            )}

            {validImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
