import React from 'react';
import { PropertyProvider, usePropertyContext } from './context/PropertyContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { SupabaseIntegrationModal } from './components/common/SupabaseIntegrationModal';
import { AuthModal } from './components/auth/AuthModal';

import { HomePage } from './components/pages/HomePage';
import { ListingPage } from './components/pages/ListingPage';
import { PropertyDetailsView } from './components/property/PropertyDetailsView';
import { AddPropertyForm } from './components/forms/AddPropertyForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AgentProfileView } from './components/agents/AgentProfileView';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PolicyPage } from './components/pages/PolicyPage';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, notifications, removeToast } = usePropertyContext();

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'listings':
      case 'buy':
      case 'rent':
        return <ListingPage />;
      case 'details':
        return <PropertyDetailsView />;
      case 'sell':
        return <AddPropertyForm />;
      case 'admin':
        return <AdminDashboard />;
      case 'agent':
        return <AgentProfileView />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PolicyPage type="privacy" />;
      case 'terms':
        return <PolicyPage type="terms" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 md:pb-0">
      {/* Top Demo Banner */}
      <DemoBanner />

      {/* Main Top Bar Navigation */}
      <Navbar />

      {/* Dynamic View Content */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile-First Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Modals */}
      <AuthModal />
      <SupabaseIntegrationModal />

      {/* Toast Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {notifications.map((toast) => (
            <div
              key={toast.id}
              className={`p-3.5 rounded-xl shadow-lg border text-xs flex items-center justify-between gap-3 pointer-events-auto transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                toast.type === 'success'
                  ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
                  : toast.type === 'error'
                  ? 'bg-rose-900 text-rose-50 border-rose-700'
                  : 'bg-slate-900 text-slate-50 border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
                <span className="font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PropertyProvider>
      <AppContent />
    </PropertyProvider>
  );
}
