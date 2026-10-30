import React, { useRef, useState } from 'react';
import {
  Upload,
  Camera,
  Trash2,
  Star,
  Plus,
  Link as LinkIcon,
  X,
  Eye,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { compressMultipleImages } from '../../utils/imageCompressor';

interface PropertyImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const SAMPLE_PROPERTY_PHOTOS = [
  {
    label: 'Modern House Exterior',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Luxury Living Room',
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Designer Kitchen',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Master Bedroom Suite',
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Commercial Front',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
  },
];

export const PropertyImageUploader: React.FC<PropertyImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 15,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle local file uploads
  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      setErrorMessage(`Maximum limit of ${maxImages} property photos reached.`);
      return;
    }

    const filesArray = Array.from(fileList).slice(0, availableSlots);
    const validImageFiles = filesArray.filter((file) => file.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      setErrorMessage('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    if (validImageFiles.length < filesArray.length) {
      setErrorMessage('Some non-image files were skipped.');
    }

    try {
      setIsProcessing(true);
      setProcessingStatus(`Optimizing ${validImageFiles.length} photo${validImageFiles.length > 1 ? 's' : ''}...`);

      const compressedDataUrls = await compressMultipleImages(validImageFiles, {
        maxDimension: 1280,
        quality: 0.82,
      });

      onChange([...images, ...compressedDataUrls]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process selected photos.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Add photo via Web URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const trimmed = urlInput.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      setErrorMessage('Please enter a valid image URL starting with https://');
      return;
    }

    if (images.length >= maxImages) {
      setErrorMessage(`Maximum limit of ${maxImages} property photos reached.`);
      return;
    }

    onChange([...images, trimmed]);
    setUrlInput('');
    setShowUrlInput(false);
    setErrorMessage(null);
  };

  // Set selected photo as primary cover (move to index 0)
  const setAsCover = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const updated = [item, ...images.filter((_, i) => i !== index)];
    onChange(updated);
  };

  // Move photo left/earlier in order
  const moveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Move photo right/later in order
  const moveRight = (index: number) => {
    if (index >= images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Remove photo
  const removePhoto = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Add a sample photo
  const addSamplePhoto = (url: string) => {
    if (images.length >= maxImages) {
      setErrorMessage(`Maximum limit of ${maxImages} property photos reached.`);
      return;
    }
    if (images.includes(url)) {
      setErrorMessage('This sample photo is already in your gallery.');
      return;
    }
    setErrorMessage(null);
    onChange([...images, url]);
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Header and Photo Counter */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-slate-800">
            Property Photographs *
          </label>
          <span className="text-[11px] text-slate-500">
            First photo is your listing's main cover photo. High-resolution photos attract 5x more buyers.
          </span>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              images.length === 0
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {images.length} / {maxImages} Photos
          </span>
        </div>
      </div>

      {/* Error message alert */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-700 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-400'
        }`}
      >
        {isProcessing ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
            <p className="text-xs font-bold text-slate-800">{processingStatus}</p>
            <p className="text-[11px] text-slate-500">Compressing for lightning-fast loading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
              Drag & drop property pictures here, or browse from device
            </p>
            <p className="text-[11px] text-slate-500 max-w-md mb-4">
              Supports JPG, PNG, WebP up to 15MB each. Automatically optimized and resized for fast loading in Pakistan.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= maxImages}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={images.length >= maxImages}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-slate-600" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>{showUrlInput ? 'Hide URL' : 'Add via URL'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* URL Input Drawer */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="p-3 bg-slate-100 rounded-lg flex items-center gap-2 animate-fadeIn">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/property-photo.jpg"
            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Add Photo
          </button>
        </form>
      )}

      {/* Sample Property Photos Quick Selector */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Sample Pakistani Architecture Photos (1-Click Test):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_PROPERTY_PHOTOS.map((sample) => {
            const isAdded = images.includes(sample.url);
            return (
              <button
                key={sample.label}
                type="button"
                onClick={() => addSamplePhoto(sample.url)}
                disabled={isAdded || images.length >= maxImages}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1 cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-medium'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 font-normal'
                }`}
              >
                <span>{sample.label}</span>
                {isAdded ? (
                  <span className="text-[10px] text-emerald-600 font-bold">✓ Added</span>
                ) : (
                  <Plus className="w-2.5 h-2.5 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery of Uploaded Photos */}
      {images.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800">
              Attached Gallery ({images.length} photo{images.length > 1 ? 's' : ''})
            </h4>
            {images.length > 1 && (
              <span className="text-[10px] text-slate-400">
                Use arrows to change order or click star to set cover
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, index) => {
              const isCover = index === 0;

              return (
                <div
                  key={`${img.slice(0, 30)}-${index}`}
                  className={`group relative rounded-xl overflow-hidden border bg-white transition-all shadow-2xs ${
                    isCover
                      ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Aspect Ratio Container */}
                  <div className="aspect-4/3 relative bg-slate-100 overflow-hidden">
                    <img
                      src={img}
                      alt={`Property Photo ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Cover Photo / Number Badge */}
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                      {isCover ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Cover</span>
                        </span>
                      ) : (
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Delete & Preview Buttons */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(img)}
                        title="View Fullscreen"
                        className="w-6 h-6 rounded-md bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        title="Remove photo"
                        className="w-6 h-6 rounded-md bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Bottom Action Bar inside photo */}
                    <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between text-white text-[10px]">
                      {!isCover ? (
                        <button
                          type="button"
                          onClick={() => setAsCover(index)}
                          className="bg-black/70 hover:bg-emerald-700 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Star className="w-2.5 h-2.5" />
                          <span>Set Cover</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-200 font-semibold drop-shadow-xs">
                          Primary Display
                        </span>
                      )}

                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-0.5 ml-auto">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveLeft(index)}
                            title="Move Earlier"
                            className="w-5 h-5 rounded bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-2.5 h-2.5" />
                          </button>
                        )}
                        {index < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveRight(index)}
                            title="Move Later"
                            className="w-5 h-5 rounded bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">No property photos uploaded yet</p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Please upload at least one photo or pick from the sample architecture photos above so potential buyers can inspect the property.
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <span>Close</span>
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Full Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
