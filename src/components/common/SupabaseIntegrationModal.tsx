import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { X, Check, Copy, Database, Server, KeyRound, Globe, HardDrive, ShieldCheck } from 'lucide-react';

export const SupabaseIntegrationModal: React.FC = () => {
  const { showSupabaseModal, setShowSupabaseModal, addToast } = usePropertyContext();
  const [activeTab, setActiveTab] = useState<'deployment' | 'database' | 'auth' | 'storage'>('deployment');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!showSupabaseModal) return null;

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlSchema = `-- ==========================================
-- PropertyMarkaz Supabase PostgreSQL Schema
-- ==========================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'agent', 'admin')),
  agency_name TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Properties Table
CREATE TABLE public.properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(15, 2) NOT NULL, -- in PKR
  purpose TEXT NOT NULL CHECK (purpose IN ('buy', 'rent')),
  property_type TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  location TEXT NOT NULL,
  area_value NUMERIC(10, 2) NOT NULL,
  area_unit TEXT NOT NULL CHECK (area_unit IN ('Marla', 'Kanal', 'Sq. Yd', 'Sq. Ft')),
  covered_area_sqft NUMERIC(10, 2),
  bedrooms INT,
  bathrooms INT,
  parking_spaces INT DEFAULT 0,
  year_built INT,
  furnishing TEXT DEFAULT 'Unfurnished',
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
  rejection_reason TEXT,
  featured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Inquiries / Leads Table
CREATE TABLE public.inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved properties
CREATE POLICY "Public can view approved properties"
  ON public.properties FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

-- Authenticated users can insert their own properties
CREATE POLICY "Users can insert property"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can update any property (approve/reject)
CREATE POLICY "Admins have full access"
  ON public.properties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                PropertyMarkaz Backend Integration & Deployment Guide
              </h2>
              <p className="text-xs text-slate-500">
                Current prototype state & turnkey roadmap for Supabase, PostgreSQL & Free Hosting
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSupabaseModal(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('deployment')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 -mb-px flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'deployment'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Free Hosting & Preview
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 -mb-px flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'database'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            PostgreSQL Schema
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 -mb-px flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'auth'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Supabase Auth & Roles
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 -mb-px flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'storage'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            Image Storage & Environment
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600">
          {activeTab === 'deployment' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs leading-relaxed">
                <strong>Current Status:</strong> The frontend is fully functional in this preview sandbox. All actions
                (filtering, searching, posting new properties, favoriting, admin approving/rejecting) run in a reactive
                client-side state engine with localStorage persistence. No private credentials or live databases are
                hooked up until you add your Supabase credentials.
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">How to Preview & Test Locally</h3>
                <p className="text-xs text-slate-500 mb-2">
                  To run this repository locally on your computer with Node.js 18+:
                </p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs flex justify-between items-center">
                  <code>npm install && npm run build && npm run preview</code>
                  <button
                    onClick={() => copyToClipboard('npm install && npm run build && npm run preview', 'cmd')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedSection === 'cmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Zero-Cost Deployment Options for Pakistan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <span className="font-semibold text-slate-900 block mb-1">Option A: Vercel (Recommended)</span>
                    <p className="text-slate-600">
                      Free tier with global edge CDN, automatic HTTPS, and instant GitHub continuous deployments. Zero
                      configuration required for Vite/React SPA.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <span className="font-semibold text-slate-900 block mb-1">Option B: Cloudflare Pages</span>
                    <p className="text-slate-600">
                      100% free with unlimited bandwidth, exceptionally low latency across Pakistani ISPs (Karachi &
                      Lahore edge nodes), and DDoS protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">Ready-to-Run Supabase SQL Migration:</span>
                <button
                  onClick={() => copyToClipboard(sqlSchema, 'sql')}
                  className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  {copiedSection === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy SQL</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-emerald-300 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                {sqlSchema}
              </pre>
              <p className="text-xs text-slate-500">
                Paste this directly into the Supabase SQL Editor. It creates tables for properties, user profiles,
                inquiries, and implements Row Level Security (RLS) policies for Buyer, Seller, Agent, and Admin roles.
              </p>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Supabase Authentication Architecture</h3>
              <p>
                PropertyMarkaz supports 4 distinct user roles:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Buyers:</strong> Can search, bookmark properties, send direct inquiries, and access mortgage tools.</li>
                <li><strong>Property Owners / Sellers:</strong> Can submit private houses, plots, and apartments for moderation.</li>
                <li><strong>Estate Agents:</strong> Can post high-volume listings, showcase verified badge, agency name, and phone/WhatsApp contacts.</li>
                <li><strong>Admin Moderators:</strong> Can review, approve, reject with reason, or feature advertisements.</li>
              </ul>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <span className="font-semibold block mb-0.5">Security Compliance Note:</span>
                In production, Supabase Auth tokens are managed through HTTP-only cookies or secure headers. No secret service role keys are exposed in client-side code.
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Supabase Storage & Environment Setup</h3>
              <p className="text-slate-600">
                When deploying live, create a public Supabase Storage bucket named <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">property-photos</code> with maximum file upload size of 5MB per image.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono">
                <div className="text-slate-400 mb-1"># .env (production)</div>
                <div>VITE_SUPABASE_URL="https://your-project.supabase.co"</div>
                <div>VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."</div>
              </div>
              <p className="text-slate-500">
                The frontend code is isolated from backend dependencies so it cleanly falls back to mock/demo data whenever Supabase environment variables are omitted.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setShowSupabaseModal(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Understood, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
