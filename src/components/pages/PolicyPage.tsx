import React from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export const PolicyPage: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const { setActiveView } = usePropertyContext();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={() => setActiveView('home')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            {type === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </h1>
            <p className="text-xs text-slate-500">
              PropertyMarkaz Platform Guidelines · Effective Year 2026
            </p>
          </div>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Information Collection & Privacy Commitment</h2>
              <p>
                PropertyMarkaz operates as Pakistan's trusted digital real estate marketplace. When you register an account, submit an advertisement, or send an inquiry to a property agent or owner, we collect contact credentials (name, email address, telephone, WhatsApp number, and city).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Utilization of Data</h2>
              <p>
                Your contact information is strictly utilized to facilitate direct communication between buyers, tenants, owners, and verified estate agents. We do not sell personal data to non-affiliated telemarketing operators.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Direct WhatsApp & Call Inquiries</h2>
              <p>
                When using the WhatsApp or Phone buttons on PropertyMarkaz, you initiate communication with the designated agent or property owner under end-to-end encrypted messaging protocols. PropertyMarkaz does not store chat logs conducted on external third-party applications.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Supabase & Database Architecture Compliance</h2>
              <p>
                In compliance with modern cloud security standards, authentication tokens and property records are protected with PostgreSQL Row Level Security (RLS) policies. Client passwords are encrypted using industry-standard bcrypt hashing.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Listing Accuracy & Verification Standards</h2>
              <p>
                All advertisers (sellers, agents, and developers) warrant that the information submitted—including property size (Marla, Kanal, Sq. Ft), title registry status, NOC credentials, and asking price in Pakistani Rupees (PKR)—is truthful and non-fraudulent.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Administrative Moderation & Rejection Authority</h2>
              <p>
                PropertyMarkaz reserves the right to review, edit, reject, or permanently unpublish any listing that violates community guidelines, displays unrealistic valuation figures, features copyrighted photographs, or lacks verifiable ownership credentials.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Demonstration Prototype Disclaimer</h2>
              <p>
                Sample listings indicated with demonstration reference tags represent preview prototypes designed for interface evaluation. Buyers are advised to conduct independent legal verification of land revenue records (Fard, Intiqal, Registry, CDA/LDA/MDA/MDA/QDA transfer letters) through certified revenue registrars prior to releasing financial deposits.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Jurisdiction</h2>
              <p>
                These terms are governed in accordance with the laws of the Islamic Republic of Pakistan, with exclusive territorial jurisdiction in the courts of Islamabad Capital Territory.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
