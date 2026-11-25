import React from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { FAQSection } from '../common/FAQSection';
import { ArrowLeft, Search, Plus, MessageCircle, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { setActiveView, setFilters } = usePropertyContext();

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Back button */}
      <button
        onClick={() => setActiveView('home')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help Center & Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Buying, Selling & Renting on PropertyMarkaz
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Clear answers on searching Pakistani properties, posting listings with photos, understanding Marla/Kanal conversions, and verifying land records.
        </p>
      </div>

      {/* Main FAQ Component */}
      <FAQSection />

      {/* Bottom Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Looking to Buy or Rent?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explore verified houses, apartments, plots, and land across Pakistan.
            </p>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, purpose: 'all' }));
              setActiveView('listings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse Properties</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ready to Post an Ad?</h3>
            <p className="text-xs text-slate-500 mt-1">
              List your house, commercial plot, or private land in under 3 minutes.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveView('sell');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Still Have a Question?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Reach our regional desks in Islamabad, Mirpur AJK, Lahore, or Karachi.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};
