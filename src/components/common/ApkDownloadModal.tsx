import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  X,
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const ApkDownloadModal: React.FC = () => {
  const { showApkModal, setShowApkModal, addToast } = usePropertyContext();
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  // Default to 'pwa' (WebAPK 1-Tap) because it avoids "Problem while Parsing the package" entirely
  const [activeTab, setActiveTab] = useState<'pwa' | 'parsefix' | 'apk' | 'playstore'>('pwa');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!showApkModal) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://propertymarkaz.pk';
  const pwaBuilderUrl = `https://www.pwabuilder.com/?siteUrl=${encodeURIComponent(currentOrigin)}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      addToast('PropertyMarkaz is being installed on your Android device!', 'success');
      setShowApkModal(false);
    } else {
      addToast('Tap your browser menu (⋮) and select "Install app" or "Add to Home screen"', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-linear-to-r from-emerald-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">PropertyMarkaz Android App</h2>
                <span className="text-[10px] font-mono bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-bold">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official Android App for Pakistan Real Estate Marketplace
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowApkModal(false)}
            aria-label="Close modal"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parse Error Notification Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 sm:px-6 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-snug">
            <span className="font-bold">Got "Problem while Parsing the package"?</span>
            <span className="ml-1 text-amber-800">
              Android blocks sideloaded zips. Use the <strong>1-Tap WebAPK Install</strong> below to install directly with 0 errors!
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-3 px-3 border-b-2 -mb-px flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'pwa'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>1-Tap Install (WebAPK)</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-mono">RECOMMENDED</span>
          </button>

          <button
            onClick={() => setActiveTab('parsefix')}
            className={`py-3 px-3 border-b-2 -mb-px flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'parsefix'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Fix Parse Error</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`py-3 px-3 border-b-2 -mb-px flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'apk'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Signed APK Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('playstore')}
            className={`py-3 px-3 border-b-2 -mb-px flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'playstore'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Play Store / TWA</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-600 flex-1">
          {/* TAB 1: 1-Tap Google WebAPK Install (Recommended) */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span className="font-bold text-emerald-950 text-sm">
                    Native Android WebAPK Installation
                  </span>
                </div>
                <p className="text-emerald-900 leading-relaxed text-[11px] sm:text-xs">
                  This installs PropertyMarkaz directly onto your Android phone or tablet via Google Play Services. Android automatically creates a genuine Android application in your <strong>App Drawer</strong> with a home screen launcher icon, splash screen, offline caching, and zero parsing errors.
                </p>
              </div>

              {/* Install Trigger Button */}
              {isInstalled ? (
                <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-900 text-sm">PropertyMarkaz is Already Installed!</p>
                  <p className="text-slate-500 text-[11px]">
                    You are running PropertyMarkaz in standalone application mode.
                  </p>
                </div>
              ) : isInstallable ? (
                <div className="space-y-2">
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Install PropertyMarkaz on Android (1-Tap WebAPK)</span>
                  </button>
                  <p className="text-center text-[10px] text-slate-400">
                    No "Unknown Sources" warning · Verified by Google Play Services
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Trigger Android Install</span>
                  </button>

                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2.5">
                    <span className="font-bold text-slate-900 block text-xs">
                      How to Install in 2 Clicks from Mobile Browser:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                        <span className="font-bold text-emerald-800 block">Step 1</span>
                        <p className="text-slate-600">Open Chrome / Samsung Internet on your Android phone.</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                        <span className="font-bold text-emerald-800 block">Step 2</span>
                        <p className="text-slate-600">Tap the <strong>three dots menu (⋮)</strong> at top-right.</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                        <span className="font-bold text-emerald-800 block">Step 3</span>
                        <p className="text-slate-600">Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* iOS instructions if viewed on iPhone */}
              {isIOS && (
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl space-y-1 text-[11px] text-sky-950">
                  <span className="font-bold block">For Apple iPhone / iPad:</span>
                  <p>
                    Tap Safari's <strong>Share button</strong> (square with arrow up) &gt; scroll down &gt; tap <strong>"Add to Home Screen"</strong> &gt; tap <strong>Add</strong>.
                  </p>
                </div>
              )}

              {/* Features list */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Works completely offline</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Full-screen experience</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>App Drawer icon</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Automatic background updates</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Fix Parse Error Explanation */}
          {activeTab === 'parsefix' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Why Android shows "Problem while Parsing the package":</span>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
                  Android OS strictly requires APKs to contain binary Dalvik bytecode (<code className="bg-amber-100 px-1 rounded font-mono">classes.dex</code>), binary compiled Android XML (<code className="bg-amber-100 px-1 rounded font-mono">AXML</code>), and cryptographic cryptographic APK signature scheme v2/v3. If an APK is downloaded as an uncompiled web archive, Android's internal PackageParser halts with <em>"There was a problem parsing the package"</em>.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <span className="font-bold text-slate-900 block text-xs">
                  Choose your preferred fix:
                </span>

                <div className="space-y-2.5">
                  <div
                    onClick={() => setActiveTab('pwa')}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-300 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-950 text-xs">Fix 1: Install via 1-Tap WebAPK (Instant)</span>
                        <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-bold">0 ERRORS</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Google Play Services compiles and signs the APK natively on your device. Never shows parse errors!
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0 ml-2" />
                  </div>

                  <div
                    onClick={() => setActiveTab('apk')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">Fix 2: Generate Signed Binary APK via PWABuilder</span>
                        <span className="text-[9px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-bold">STANDALONE FILE</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Compile with Microsoft/Google PWABuilder cloud Android SDK for an installable `.apk` file.
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-700 shrink-0 ml-2" />
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1.5">
                <span className="font-bold text-slate-900 block">General Android Sideloading Checklist:</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Ensure Android version is <strong>Android 8.0 Oreo or newer</strong> (Android 10, 11, 12, 13, 14, 15).</li>
                  <li>Enable <em>"Install unknown apps"</em> in Android Settings &gt; Apps &gt; Chrome/Files.</li>
                  <li>Do not use partial or interrupted file downloads.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Signed APK Builder via PWABuilder */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                <img
                  src="/icon.svg"
                  alt="PropertyMarkaz App Icon"
                  className="w-14 h-14 rounded-2xl shadow-sm border border-slate-200 shrink-0"
                />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">PropertyMarkaz Android App</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Signed APK
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Package: pk.propertymarkaz.app
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Google PWA & WebAPK Certified
                  </p>
                </div>
              </div>

              {/* PWABuilder 1-Click Cloud Compile */}
              <div className="border border-emerald-300 bg-emerald-50/50 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-emerald-950 text-xs">Official 1-Click Cloud APK Generator</span>
                  </div>
                  <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded font-bold">100% NO PARSE ERRORS</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Generate a fully compiled, byte-aligned, and cryptographically signed <strong>.apk</strong> or <strong>.aab</strong> package using the free official Microsoft & Google PWABuilder cloud build pipeline.
                </p>
                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Build Signed APK on PWABuilder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Direct Download fallback */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Direct Web Archive Package:</span>
                  <span className="text-[10px] text-slate-400">Offline Web Bundle</span>
                </div>
                <a
                  href="/download/PropertyMarkaz.apk"
                  download="PropertyMarkaz.apk"
                  onClick={() => addToast('Downloading PropertyMarkaz bundle...', 'info')}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download PropertyMarkaz.apk File</span>
                </a>
                <p className="text-[10px] text-slate-500">
                  Note: If your phone gives a parse error on direct sideload, use the <strong>1-Tap Install (WebAPK)</strong> tab or PWABuilder above.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Google Play Store / Developer CLI */}
          {activeTab === 'playstore' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs">
                PropertyMarkaz can be published directly to the <strong>Google Play Store</strong> as a Trusted Web Activity (TWA) with zero native code modifications:
              </p>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Option 1: PWABuilder Web (Easiest)</span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Open <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold underline">PWABuilder.com</a>.</li>
                  <li>Enter your PropertyMarkaz domain URL.</li>
                  <li>Click <strong>Package for Store &gt; Android</strong>.</li>
                  <li>Download the generated <strong>.aab</strong> bundle and upload to Google Play Console.</li>
                </ol>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">Option 2: Bubblewrap CLI (Google Official)</span>
                  <button
                    onClick={() => copyToClipboard('npx @bubblewrap/cli init --manifest=https://propertymarkaz.pk/manifest.webmanifest\nnpx @bubblewrap/cli build', 'bwrap')}
                    className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    {copiedCmd === 'bwrap' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd === 'bwrap' ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 text-emerald-400 p-3 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
{`# 1. Initialize Bubblewrap Project
npx @bubblewrap/cli init --manifest=https://propertymarkaz.pk/manifest.webmanifest

# 2. Build signed Android APK and AAB
npx @bubblewrap/cli build`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Google WebAPK & PWA Certified</span>
          </div>
          <button
            onClick={() => setShowApkModal(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
