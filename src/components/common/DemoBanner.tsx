import React from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { Database, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { setShowSupabaseModal, currentUser, switchDemoRole } = usePropertyContext();

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            Prototype Preview Mode
          </span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="text-slate-400">
            Listings are demonstration samples. State stored in local browser session.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400 hidden md:inline">Demo Role:</span>
            <select
              value={currentUser?.role || 'guest'}
              onChange={(e) => switchDemoRole(e.target.value as any)}
              className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="guest">Guest Visitor</option>
              <option value="buyer">Buyer (Ahmed Zubair)</option>
              <option value="seller">Seller (Raja Asif - Mirpur)</option>
              <option value="agent">Agent (Tariq - Islamabad)</option>
              <option value="admin">Admin Moderator</option>
            </select>
          </div>

          <button
            onClick={() => setShowSupabaseModal(true)}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase & Hosting Guide</span>
          </button>
        </div>
      </div>
    </div>
  );
};
