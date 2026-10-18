import React from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { Building2, ShieldCheck, MapPin, Users, Globe, Award, Target, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView } = usePropertyContext();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
          About PropertyMarkaz
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Transforming Pakistani Real Estate Through Trust & Technology
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Founded to bring transparency, verified documentation, and frictionless digital search to property buyers, sellers, and overseas Pakistanis across all 4 provinces, Azad Jammu & Kashmir, and Gilgit-Baltistan.
        </p>
      </div>

      {/* Vision & Mission Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To eliminate opaque brokerage practices, duplicate spam ads, and title uncertainty in Pakistan's real estate sector by providing an authoritative, mobile-optimized digital platform that connects legitimate buyers with verified property owners and vetted agencies.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Overseas Pakistani Liaison</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            With over 9 million overseas Pakistanis sending billions in remittances annually, PropertyMarkaz is dedicated to safeguarding diaspora investments in Mirpur AJK, Islamabad, Lahore, and Karachi through genuine video walkthroughs, transparent PKR valuations, and direct WhatsApp connectivity.
          </p>
        </div>
      </div>

      {/* Nationwide Presence */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Nationwide Coverage
          </span>
          <h2 className="text-2xl font-bold">From the Karakoram Mountains to the Arabian Sea</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Our market coverage spans major metropolitan capitals and strategic secondary centers:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="border border-slate-800 p-3 rounded-lg bg-slate-800/40">
            <span className="font-bold text-emerald-400 block mb-0.5">Islamabad & Rawalpindi</span>
            <span className="text-slate-400">CDA Sectors, DHA & Bahria Town</span>
          </div>
          <div className="border border-slate-800 p-3 rounded-lg bg-slate-800/40">
            <span className="font-bold text-emerald-400 block mb-0.5">Mirpur AJK</span>
            <span className="text-slate-400">Sectors F-1, B-3 & New Mirpur City</span>
          </div>
          <div className="border border-slate-800 p-3 rounded-lg bg-slate-800/40">
            <span className="font-bold text-emerald-400 block mb-0.5">Lahore</span>
            <span className="text-slate-400">DHA Phases 1-9, Gulberg & Cantt</span>
          </div>
          <div className="border border-slate-800 p-3 rounded-lg bg-slate-800/40">
            <span className="font-bold text-emerald-400 block mb-0.5">Karachi</span>
            <span className="text-slate-400">Clifton, DHA Karachi & PECHS</span>
          </div>
          <div className="border border-slate-800 p-3 rounded-lg bg-slate-800/40">
            <span className="font-bold text-emerald-400 block mb-0.5">Peshawar & Quetta</span>
            <span className="text-slate-400">Hayatabad, Samungli & Zarghoon</span>
          </div>
          <div className="border border-slate-800 p-3 rounded-lg bg-slate-800/40">
            <span className="font-bold text-emerald-400 block mb-0.5">Gilgit-Baltistan</span>
            <span className="text-slate-400">Jutial Colony & Scenic Orchards</span>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center">Our Core Operating Standards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Strict Moderation</h3>
            <p>Every submitted advertisement is verified by admin staff to prevent fictitious pricing and duplicate records.</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <Building2 className="w-6 h-6 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Authentic PKR Pricing</h3>
            <p>Formatted in intuitive Pakistani Lakhs and Crores, ensuring absolute transparency without hidden agent premiums.</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <Users className="w-6 h-6 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Direct Contact Freedom</h3>
            <p>Zero barrier communication. Call or WhatsApp owners and agents directly without paying paywalls.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-emerald-950">Looking to Sell or Rent in Pakistan?</h3>
          <p className="text-xs text-emerald-800 mt-1">Post your property advertisement in under 3 minutes.</p>
        </div>
        <button
          onClick={() => setActiveView('sell')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <span>Post Advertisement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
