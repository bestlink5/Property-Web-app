import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { X, Lock, Mail, User, Phone, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalTab,
    setAuthModalTab,
    setCurrentUser,
    addToast,
    switchDemoRole,
  } = usePropertyContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'agent'>('buyer');
  const [agencyName, setAgencyName] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      addToast('Please enter both email and password.', 'error');
      return;
    }

    if (authModalTab === 'login') {
      setCurrentUser({
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email,
        phone: '+92 300 1234567',
        role: 'buyer',
        savedPropertyIds: ['PM-101'],
      });
      addToast(`Signed in successfully as ${email}! (Client session)`, 'success');
    } else {
      setCurrentUser({
        id: `usr-${Date.now()}`,
        name: name || 'New User',
        email,
        phone: phone || '+92 300 0000000',
        role,
        agencyName: role === 'agent' ? agencyName : undefined,
        savedPropertyIds: [],
      });
      addToast(`Account registered as ${role.toUpperCase()}! (Client session)`, 'success');
    }

    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {authModalTab === 'login' ? 'Sign In to PropertyMarkaz' : 'Create an Account'}
            </h2>
            <p className="text-[11px] text-slate-500">
              Access saved listings, inquiries, and post property advertisements
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 bg-white">
          <button
            onClick={() => setAuthModalTab('login')}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 -mb-px cursor-pointer transition-colors ${
              authModalTab === 'login'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthModalTab('register')}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 -mb-px cursor-pointer transition-colors ${
              authModalTab === 'register'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {authModalTab === 'register' && (
            <>
              {/* Role Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Account Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['buyer', 'seller', 'agent'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-2 rounded-lg border text-xs font-bold capitalize cursor-pointer transition-colors ${
                        role === r
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-1 ring-emerald-600'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {r === 'buyer' ? 'Buyer' : r === 'seller' ? 'Owner / Seller' : 'Agent'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Pakistan Phone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {role === 'agent' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Agency / Brokerage Firm Name *
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Margalla Prime Real Estate"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.pk"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {authModalTab === 'login' ? 'Sign In' : 'Complete Registration'}
          </button>

          {/* Fast Demo Accounts */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2 font-semibold text-center">
              Or Fast Switch Demo Role (1-Click)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('buyer');
                  setShowAuthModal(false);
                }}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-semibold cursor-pointer"
              >
                Buyer (Ahmed)
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('seller');
                  setShowAuthModal(false);
                }}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-semibold cursor-pointer"
              >
                Seller (Mirpur)
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('agent');
                  setShowAuthModal(false);
                }}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-semibold cursor-pointer"
              >
                Agent (Islamabad)
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('admin');
                  setShowAuthModal(false);
                }}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-900 rounded text-white font-semibold cursor-pointer"
              >
                Admin Moderator
              </button>
            </div>
          </div>

          {/* Database Notice */}
          <p className="text-[10px] text-slate-400 text-center leading-normal">
            Note: Prepared for Supabase Auth integration. Active sessions currently run in local client memory.
          </p>
        </form>
      </div>
    </div>
  );
};
