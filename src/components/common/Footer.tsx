import React from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { Building2, MapPin, Phone, Mail, ShieldCheck, Heart, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setFilters, setShowSupabaseModal } = usePropertyContext();

  const handleCityClick = (city: string) => {
    setFilters((prev) => ({ ...prev, city, purpose: 'all' }));
    setActiveView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (type: string) => {
    setFilters((prev) => ({ ...prev, type, purpose: 'all' }));
    setActiveView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-4 h-4 text-emerald-100" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Property<span className="text-emerald-400">Markaz</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Pakistan's modern, mobile-first real estate marketplace. Connecting property buyers, sellers, and overseas Pakistanis across all provinces, territories, and Azad Jammu & Kashmir.
            </p>

            <div className="space-y-1 text-slate-400 text-xs pt-2">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>ISE Towers, Blue Area, Islamabad, Pakistan</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+92 51 289 1000 · Direct WhatsApp Available</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowSupabaseModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Supabase & Free Deployment Setup</span>
              </button>
            </div>
          </div>

          {/* Quick Cities */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Major Cities
            </h3>
            <ul className="space-y-2 text-slate-400">
              {['Islamabad', 'Mirpur AJK', 'Rawalpindi', 'Lahore', 'Karachi', 'Faisalabad', 'Peshawar', 'Quetta', 'Gilgit'].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => handleCityClick(c)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Properties in {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Categories */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-2 text-slate-400">
              {['House', 'Apartment', 'Residential Plot', 'Commercial Plot', 'Shop', 'Office', 'Agricultural Land'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {cat}s for Sale / Rent
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal Navigation & Legal */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Company & Legal
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About PropertyMarkaz
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Contact & Regional Desks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('sell');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Post Property Advertisement
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Admin Verification Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} PropertyMarkaz. Pakistan's Nationwide Real Estate Marketplace.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Prices displayed in Pakistani Rupees (PKR)</span>
            <span>·</span>
            <span>Demonstration prototype for appraisal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
