import React from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    savedPropertyIds,
    setShowAuthModal,
    setAuthModalTab,
    currentUser,
  } = usePropertyContext();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 h-14 flex items-center justify-around px-2 shadow-lg">
      <button
        onClick={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
          activeView === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => {
          setActiveView('listings');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
          activeView === 'listings' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Search className="w-4 h-4 mb-0.5" />
        <span>Browse</span>
      </button>

      {/* Post Ad prominent central action */}
      <button
        onClick={() => {
          setActiveView('sell');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold text-emerald-700"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-sm -mt-3 mb-0.5">
          <PlusCircle className="w-5 h-5" />
        </div>
        <span>Post Ad</span>
      </button>

      <button
        onClick={() => {
          setActiveView('listings');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium relative transition-colors ${
          savedPropertyIds.length > 0 && activeView === 'listings'
            ? 'text-emerald-700 font-bold'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Heart className="w-4 h-4 mb-0.5" />
        <span>Saved</span>
        {savedPropertyIds.length > 0 && (
          <span className="absolute top-1 right-5 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
            {savedPropertyIds.length}
          </span>
        )}
      </button>

      <button
        onClick={() => {
          if (currentUser) {
            setActiveView('admin');
          } else {
            setAuthModalTab('login');
            setShowAuthModal(true);
          }
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
          activeView === 'admin' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <User className="w-4 h-4 mb-0.5" />
        <span>{currentUser ? 'Portal' : 'Login'}</span>
      </button>
    </nav>
  );
};
