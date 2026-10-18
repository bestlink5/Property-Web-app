import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { Building2, Plus, User, Heart, ShieldCheck, Menu, X, ChevronDown, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    setShowAuthModal,
    setAuthModalTab,
    savedPropertyIds,
    setFilters,
  } = usePropertyContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'buy' | 'rent' | 'sell' | 'listings' | 'admin') => {
    if (view === 'buy') {
      setFilters((prev) => ({ ...prev, purpose: 'buy' }));
      setActiveView('listings');
    } else if (view === 'rent') {
      setFilters((prev) => ({ ...prev, purpose: 'rent' }));
      setActiveView('listings');
    } else if (view === 'sell') {
      setActiveView('sell');
    } else {
      setActiveView(view);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark & architectural emblem */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left text-slate-900 focus:outline-none cursor-pointer whitespace-nowrap shrink-0 group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
              <Building2 className="w-5 h-5 text-emerald-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                Property<span className="text-emerald-700">Markaz</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase mt-0.5">
                Pakistan Real Estate
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 concise single-line text links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button
              onClick={() => handleNavClick('buy')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'listings' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => handleNavClick('rent')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Rent
            </button>
            <button
              onClick={() => handleNavClick('sell')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'sell' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              Sell Property
            </button>
            <button
              onClick={() => {
                setActiveView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Offices
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1 hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'admin' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Saved properties indicator */}
            <button
              onClick={() => {
                setActiveView('listings');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100 cursor-pointer hidden sm:flex items-center justify-center"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {savedPropertyIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {savedPropertyIds.length}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-xs text-slate-700"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                      <p className="font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveView('sell');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-400" />
                      Post New Advertisement
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveView('admin');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      Admin Moderation Console
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setShowAuthModal(true);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-600 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      Switch Account / Role
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setShowAuthModal(true);
                }}
                className="text-xs font-semibold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
            )}

            {/* Primary Action Button: Add Property */}
            <button
              onClick={() => handleNavClick('sell')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => handleNavClick('buy')}
              className="py-2.5 px-3 rounded-lg text-xs font-bold text-slate-800 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-center cursor-pointer"
            >
              Buy Properties
            </button>
            <button
              onClick={() => handleNavClick('rent')}
              className="py-2.5 px-3 rounded-lg text-xs font-bold text-slate-800 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-center cursor-pointer"
            >
              Rent Properties
            </button>
          </div>

          <button
            onClick={() => handleNavClick('sell')}
            className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Property (Sell / Rent Out)</span>
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Admin Review & Approval Console</span>
          </button>

          <button
            onClick={() => {
              setActiveView('about');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            About PropertyMarkaz
          </button>

          <button
            onClick={() => {
              setActiveView('contact');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Regional Offices & Contact
          </button>
        </div>
      )}
    </header>
  );
};
