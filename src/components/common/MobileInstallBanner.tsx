import React, { useState, useEffect } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';

export const MobileInstallBanner: React.FC = () => {
  const { setShowApkModal, addToast } = usePropertyContext();
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in session storage
    const wasDismissed = sessionStorage.getItem('pm_install_dismissed');
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pm_install_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        addToast('PropertyMarkaz is being installed on your device!', 'success');
        setDismissed(true);
        return;
      }
    }
    // If beforeinstallprompt hasn't fired yet or dismissed, open the detailed modal
    setShowApkModal(true);
  };

  return (
    <div className="fixed bottom-14 md:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-slate-900 text-white rounded-2xl p-3 shadow-2xl border border-emerald-600/50 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3">
        <img
          src="/icon.svg"
          alt="PropertyMarkaz App"
          className="w-10 h-10 rounded-xl bg-emerald-800 p-1 shrink-0 border border-emerald-400/40 shadow-xs"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-white truncate">Install PropertyMarkaz</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-400/30">
              Android
            </span>
          </div>
          <p className="text-[11px] text-slate-300 truncate">
            1-Tap Install · Works Offline · 0 Parse Errors
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstall}
            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss install banner"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
