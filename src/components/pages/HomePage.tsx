import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { PropertyCard } from '../property/PropertyCard';
import { AreaUnitConverter } from '../property/AreaUnitConverter';
import { PAKISTAN_CITIES, PROPERTY_TYPES } from '../../data/locations';
import {
  Search,
  Building,
  Home,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Globe2,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { properties, setFilters, setActiveView, navigateToProperty } = usePropertyContext();

  const [heroPurpose, setHeroPurpose] = useState<'buy' | 'rent'>('buy');
  const [heroCity, setHeroCity] = useState('');
  const [heroType, setHeroType] = useState('');
  const [heroKeyword, setHeroKeyword] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      purpose: heroPurpose,
      city: heroCity,
      type: heroType,
      searchQuery: heroKeyword,
    }));
    setActiveView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickCategory = (type: string) => {
    setFilters((prev) => ({ ...prev, type, purpose: 'all' }));
    setActiveView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickCity = (city: string) => {
    setFilters((prev) => ({ ...prev, city, purpose: 'all' }));
    setActiveView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured properties
  const featuredListings = properties.filter((p) => p.status === 'approved' && p.featured).slice(0, 6);
  // Recent additions
  const recentListings = properties.filter((p) => p.status === 'approved' && !p.featured).slice(0, 3);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Subtle geometric architectural pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Pakistan's Premier Real Estate Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Find Your Dream Property in <span className="text-emerald-400">Pakistan</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Connecting buyers, tenants, and overseas Pakistanis with verified residential houses, commercial plazas, and prime plots nationwide.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-100">
            {/* Purpose Tabs */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setHeroPurpose('buy')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  heroPurpose === 'buy'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setHeroPurpose('rent')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  heroPurpose === 'rent'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Rent Properties
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* City */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  City
                </label>
                <select
                  value={heroCity}
                  onChange={(e) => setHeroCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="">All Pakistan Cities</option>
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Property Type
                </label>
                <select
                  value={heroType}
                  onChange={(e) => setHeroType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location or Keyword */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Location / Society
                </label>
                <input
                  type="text"
                  value={heroKeyword}
                  onChange={(e) => setHeroKeyword(e.target.value)}
                  placeholder="DHA, Bahria, F-7, Clifton..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Properties</span>
                </button>
              </div>
            </form>

            {/* Quick search tags */}
            <div className="flex items-center flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Trending Areas:</span>
              {['Mirpur Sector F-1', 'DHA Islamabad', 'Gulberg Lahore', 'Clifton Karachi', 'Bahria Town'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, searchQuery: loc, purpose: 'all' }));
                    setActiveView('listings');
                  }}
                  className="text-slate-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-xs text-slate-500">Browse houses, commercial properties, and land across Pakistan</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Houses & Villas', type: 'House', count: '10,000+' },
            { label: 'Apartments & Flats', type: 'Apartment', count: '4,500+' },
            { label: 'Residential Plots', type: 'Residential Plot', count: '8,200+' },
            { label: 'Commercial Plots', type: 'Commercial Plot', count: '2,100+' },
            { label: 'Shops & Showrooms', type: 'Shop', count: '1,800+' },
            { label: 'Agri Land / Farms', type: 'Agricultural Land', count: '900+' },
          ].map((cat) => (
            <button
              key={cat.type}
              onClick={() => handleQuickCategory(cat.type)}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-600/60 hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <Building className="w-6 h-6 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                {cat.label}
              </h3>
              <span className="text-[10px] text-slate-400 block mt-0.5">{cat.count} listings</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Verified Listings</h2>
            <p className="text-xs text-slate-500">
              Prime luxury bungalows, modern apartments, and strategic investment land
            </p>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, purpose: 'all' }));
              setActiveView('listings');
            }}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <span>View All Listings ({properties.filter((p) => p.status === 'approved').length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* Major Pakistani Hubs Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-2xl p-6 sm:p-8 border border-slate-200">
          <div className="max-w-2xl mb-6">
            <h2 className="text-lg font-bold text-slate-900">Explore Top Real Estate Hubs</h2>
            <p className="text-xs text-slate-600">
              Properties spanning Pakistan's key federal capital, provincial headquarters, and Azad Kashmir
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { name: 'Mirpur AJK', tagline: 'Overseas Hub & Sectors F-1, B-3' },
              { name: 'Islamabad', tagline: 'CDA Sectors, DHA & Margalla' },
              { name: 'Rawalpindi', tagline: 'Bahria Town & DHA Phases' },
              { name: 'Lahore', tagline: 'DHA, Gulberg & Cantt' },
              { name: 'Karachi', tagline: 'Clifton, DHA & Sea View' },
              { name: 'Faisalabad', tagline: 'Canal Road & Kohinoor' },
              { name: 'Peshawar', tagline: 'Hayatabad & DHA Peshawar' },
              { name: 'Quetta', tagline: 'Samungli & Cantonment' },
              { name: 'Gilgit', tagline: 'Jutial & River View Land' },
            ].map((city) => (
              <button
                key={city.name}
                onClick={() => handleQuickCity(city.name)}
                className="p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-600 hover:shadow-xs text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{city.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1 truncate">{city.tagline}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pakistan Land Area Converter widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <AreaUnitConverter initialValue={1} initialUnit="Kanal" />
          </div>

          {/* Trust Value Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">PropertyMarkaz Guarantee</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>Direct WhatsApp & Calls:</strong> Connect instantly with verified listing agents.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>Admin Moderation:</strong> Strict spam and fraudulent listing filters.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>Overseas Pakistani Assistance:</strong> Trusted liaison for diaspora in UK, US & Gulf.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Recent Properties Grid */}
      {recentListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recently Added Listings</h2>
            <p className="text-xs text-slate-500">Fresh properties submitted by owners and realtors</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
