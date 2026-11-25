import React, { useEffect, useMemo, useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { PropertyCard } from '../property/PropertyCard';
import { formatPKR } from '../../utils/formatters';
import {
  Heart,
  Bookmark,
  Search,
  LayoutGrid,
  List,
  Trash2,
  ArrowRight,
  LogIn,
  UserPlus,
  MapPin,
  Building2,
  RotateCcw,
} from 'lucide-react';

type SavedPurposeFilter = 'all' | 'buy' | 'rent';
type SavedSortOption = 'saved-order' | 'price-asc' | 'price-desc' | 'area-desc';

export const SavedPropertiesView: React.FC = () => {
  const {
    properties,
    currentUser,
    savedPropertyIds,
    clearSavedProperties,
    setActiveView,
    setShowAuthModal,
    setAuthModalTab,
  } = usePropertyContext();

const SAVED_VIEW_PREFS_KEY = 'propertymarkaz_saved_prefs_v1';

  const [purposeFilter, setPurposeFilter] = useState<SavedPurposeFilter>(() => {
    try {
      const raw = localStorage.getItem(SAVED_VIEW_PREFS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed.purposeFilter === 'all' || parsed.purposeFilter === 'buy' || parsed.purposeFilter === 'rent') {
        return parsed.purposeFilter;
      }
    } catch {
      // ignore
    }
    return 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SavedSortOption>(() => {
    try {
      const raw = localStorage.getItem(SAVED_VIEW_PREFS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      if (
        parsed.sortBy === 'saved-order' ||
        parsed.sortBy === 'price-asc' ||
        parsed.sortBy === 'price-desc' ||
        parsed.sortBy === 'area-desc'
      ) {
        return parsed.sortBy;
      }
    } catch {
      // ignore
    }
    return 'saved-order';
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    try {
      const raw = localStorage.getItem(SAVED_VIEW_PREFS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed.viewMode === 'grid' || parsed.viewMode === 'list') {
        return parsed.viewMode;
      }
    } catch {
      // ignore
    }
    return 'grid';
  });
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        SAVED_VIEW_PREFS_KEY,
        JSON.stringify({ purposeFilter, sortBy, viewMode })
      );
    } catch {
      // ignore
    }
  }, [purposeFilter, sortBy, viewMode]);

  // Preserve saved bookmark order (most recently saved first) while matching live property records
  const savedProperties = useMemo(() => {
    const byId = new Map(properties.map((p) => [p.id, p]));
    return savedPropertyIds
      .map((id) => byId.get(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [properties, savedPropertyIds]);

  const saleCount = useMemo(
    () => savedProperties.filter((p) => p.purpose === 'buy').length,
    [savedProperties]
  );
  const rentCount = useMemo(
    () => savedProperties.filter((p) => p.purpose === 'rent').length,
    [savedProperties]
  );
  const citiesCovered = useMemo(
    () => new Set(savedProperties.map((p) => p.city)).size,
    [savedProperties]
  );
  const priceBounds = useMemo(() => {
    if (savedProperties.length === 0) return null;
    const prices = savedProperties.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [savedProperties]);

  const visibleProperties = useMemo(() => {
    const filtered = savedProperties.filter((p) => {
      if (purposeFilter !== 'all' && p.purpose !== purposeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          (p.developmentName?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'area-desc') {
      return [...filtered].sort((a, b) => b.areaValue - a.areaValue);
    }
    return filtered;
  }, [savedProperties, purposeFilter, searchQuery, sortBy]);

  // Logged-out view: prompt user to sign in or register to unlock saved collection
  if (!currentUser) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 sm:py-16 min-w-0">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              Saved Properties Collection
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Sign In to Access Your Favorites
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bookmark houses, commercial plots, and private land across Pakistan so you can compare PKR pricing and contact agents anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setShowAuthModal(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthModalTab('register');
                setShowAuthModal(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-700" />
              <span>Create Account</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setActiveView('listings');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              <span>Browse All Nationwide Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
            </span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Saved Collection · {currentUser.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Favorites & Saved Properties
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {savedProperties.length === 0
              ? 'Your personal shortlist of bookmarked properties'
              : `${savedProperties.length} bookmarked ${
                  savedProperties.length === 1 ? 'listing' : 'listings'
                } saved to ${currentUser.email}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {savedProperties.length > 0 && (
            confirmClear ? (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 text-xs">
                <span className="font-semibold text-rose-800">Remove all?</span>
                <button
                  type="button"
                  onClick={() => {
                    clearSavedProperties();
                    setConfirmClear(false);
                  }}
                  className="px-2 py-0.5 bg-rose-700 hover:bg-rose-800 text-white rounded font-bold cursor-pointer"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => {
              setActiveView('listings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <span>Browse More Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Empty Collection State */}
      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              No saved properties yet
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tap the heart icon on any property card, listing details page, or interactive map listing to bookmark it into your personal collection.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveView('listings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Explore Properties</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Total Bookmarked
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums mt-0.5 block">
                {savedProperties.length}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Buy / Rent Split
              </span>
              <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-800">
                <span className="text-emerald-700">{saleCount} For Sale</span>
                <span className="text-slate-300">·</span>
                <span className="text-sky-700">{rentCount} For Rent</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Cities Shortlisted
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {citiesCovered}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Saved Price Range
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-800 font-mono tabular-nums mt-1.5 block truncate">
                {priceBounds
                  ? priceBounds.min === priceBounds.max
                    ? formatPKR(priceBounds.min)
                    : `${formatPKR(priceBounds.min)} – ${formatPKR(priceBounds.max)}`
                  : '—'}
              </span>
            </div>
          </div>

          {/* Collection Filter, Search, Sort & Layout Bar */}
          <div className="w-full min-w-0 bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Purpose Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg w-full lg:w-auto overflow-x-auto shrink-0">
              {[
                { id: 'all' as SavedPurposeFilter, label: `All (${savedProperties.length})` },
                { id: 'buy' as SavedPurposeFilter, label: `For Sale (${saleCount})` },
                { id: 'rent' as SavedPurposeFilter, label: `For Rent (${rentCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPurposeFilter(tab.id)}
                  className={`flex-1 lg:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    purposeFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search, Sort & View Mode */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 lg:justify-end min-w-0">
              <div className="relative flex-1 sm:max-w-xs min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter saved by city, sector, society..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SavedSortOption)}
                aria-label="Sort saved properties"
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="saved-order">Recently Bookmarked</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-desc">Area: Largest First</option>
              </select>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    viewMode === 'list'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Collection Grid / List OR Filtered Empty State */}
          {visibleProperties.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                No saved properties match this filter
              </h3>
              <p className="text-xs text-slate-500">
                Reset your collection search or switch tabs to view all {savedProperties.length} saved listings.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPurposeFilter('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show All Saved</span>
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 w-full ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
                  : 'grid-cols-1 max-w-6xl mx-auto'
              }`}
            >
              {visibleProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} layout={viewMode} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
