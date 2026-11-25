import React, { useRef, useState } from 'react';
import { AGENT_AVATAR_PRESETS, resizeImageFileToSquareDataUrl } from '../../utils/imageResize';
import { X, Upload, Link2, Check, User, RotateCcw, AlertCircle } from 'lucide-react';

interface AgentAvatarEditorModalProps {
  agentName: string;
  currentAvatar: string;
  defaultAvatar?: string;
  onSave: (newAvatarUrl: string) => void;
  onClose: () => void;
}

export const AgentAvatarEditorModal: React.FC<AgentAvatarEditorModalProps> = ({
  agentName,
  currentAvatar,
  defaultAvatar,
  onSave,
  onClose,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar);
  const [urlInput, setUrlInput] = useState<string>(
    currentAvatar.startsWith('data:') ? '' : currentAvatar
  );
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsProcessing(true);
    try {
      const dataUrl = await resizeImageFileToSquareDataUrl(file, 360, 0.86);
      setPreviewUrl(dataUrl);
      setPreviewError(false);
      setUrlInput('');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Unable to load image.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUploadError('Please paste an image URL first.');
      return;
    }
    setUploadError(null);
    setPreviewError(false);
    setPreviewUrl(trimmed);
  };

  const handleSave = () => {
    if (!previewUrl.trim() || previewError) {
      setUploadError('Please choose a valid profile picture before saving.');
      return;
    }
    onSave(previewUrl.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">Edit Agent Profile Picture</h2>
            <p className="text-[11px] text-slate-300 truncate">{agentName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Live Preview + Upload Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border-2 border-emerald-600/25 shadow-xs shrink-0 flex items-center justify-center">
              {previewUrl && !previewError ? (
                <img
                  src={previewUrl}
                  alt={agentName}
                  referrerPolicy="no-referrer"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                  <User className="w-8 h-8 mb-1" />
                  <span className="text-[10px]">No preview</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <p className="font-bold text-slate-900">Upload from Device</p>
              <p className="text-[11px] text-slate-500">
                Choose a clear headshot (JPG, PNG, or WebP). Automatically cropped square.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Processing...' : 'Upload Photo'}</span>
                </button>

                {defaultAvatar && previewUrl !== defaultAvatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(defaultAvatar);
                      setUrlInput(defaultAvatar);
                      setPreviewError(false);
                      setUploadError(null);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {uploadError && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{uploadError}</span>
            </div>
          )}

          {previewError && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>That image URL could not be loaded. Try uploading a photo or choosing a preset.</span>
            </div>
          )}

          {/* Paste Image URL */}
          <form onSubmit={handleApplyUrl} className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">
              Or Use Image URL
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/agent-photo.jpg"
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors cursor-pointer shrink-0"
              >
                Preview
              </button>
            </div>
          </form>

          {/* Quick Preset Avatars */}
          <div className="space-y-2">
            <span className="block text-[11px] font-bold text-slate-700 uppercase">
              Quick Portraits
            </span>
            <div className="grid grid-cols-4 gap-2.5">
              {AGENT_AVATAR_PRESETS.map((preset) => {
                const isSelected = previewUrl === preset.url;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setPreviewUrl(preset.url);
                      setUrlInput(preset.url);
                      setPreviewError(false);
                      setUploadError(null);
                    }}
                    title={preset.label}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-700 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Profile Picture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
