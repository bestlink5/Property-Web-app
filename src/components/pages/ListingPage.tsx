import React, { useEffect, useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { PropertyFilterBar } from '../property/PropertyFilterBar';
import { PropertyCard } from '../property/PropertyCard';
import { PropertyMapView } from '../property/PropertyMapView';
import { LayoutGrid, List, Map as MapIcon, Columns2, SearchX, RotateCcw, X } from 'lucide-react';

type ListingViewMode = 'split' | 'map' | 'grid' | 'list';
const LISTING_VIEW_MODE_KEY = 'propertymarkaz_listing_view_mode_v1';

export const ListingPage: React.FC = () => {
  const { filteredProperties, filters, updateFilter, resetFilters } = usePropertyContext();
  const [viewMode, setViewMode] = useState<ListingViewMode>(() => {
    try {
      const saved = localStorage.getItem(LISTING_VIEW_MODE_KEY);
      if (saved === 'split' || saved === 'map' || saved === 'grid' || saved === 'list') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'split';
  });
  const [focusedMapPropertyId, setFocusedMapPropertyId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LISTING_VIEW_MODE_KEY, viewMode);
    } catch {
      // ignore
    }
  }, [viewMode]);

  const hasActiveFilters = Boolean(
    filters.city ||
      filters.type ||
      filters.area ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.searchQuery ||
      filters.geofence
  );

  const handleFocusOnMap = (propertyId: string) => {
    setFocusedMapPropertyId(propertyId);
    if (viewMode !== 'split' && viewMode !== 'map') {
      setViewMode('split');
    }
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6 min-w-0">
      {/* Page Title & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
            {filters.purpose === 'buy'
              ? 'Properties for Sale in Pakistan'
              : filters.purpose === 'rent'
              ? 'Rental Properties in Pakistan'
              : 'All Pakistan Property Listings'}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {filters.city ? `Properties in ${filters.city}` : 'Nationwide Real Estate'}
            {filters.type ? ` · ${filters.type}` : ''}
          </h1>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              viewMode === 'split'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Split View: Interactive Map + Property Cards"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Map + Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              viewMode === 'map'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Full Interactive Map & Geofence"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Full Map</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              viewMode === 'grid'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              viewMode === 'list'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Filter Bar */}
      <PropertyFilterBar />

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Active Criteria:</span>
          {filters.city && (
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800">
              City: {filters.city}
            </span>
          )}
          {filters.type && (
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800">
              Type: {filters.type}
            </span>
          )}
          {filters.area && (
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800">
              Area: {filters.area}
            </span>
          )}
          {filters.searchQuery && (
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800">
              Query: "{filters.searchQuery}"
            </span>
          )}
          {filters.geofence && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 font-semibold">
              <span>
                Geofence:{' '}
                {filters.geofence.label ||
                  (filters.geofence.type === 'circle'
                    ? `${filters.geofence.radiusKm} km radius`
                    : 'Custom Area')}
              </span>
              <button
                type="button"
                onClick={() => updateFilter('geofence', null)}
                className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
                aria-label="Clear geofence filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-emerald-700 hover:underline font-semibold cursor-pointer ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results View */}
      {viewMode === 'map' ? (
        <PropertyMapView
          layout="full"
          focusedPropertyId={focusedMapPropertyId}
          onSelectProperty={setFocusedMapPropertyId}
        />
      ) : viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
          {/* Interactive Geographic Map Column */}
          <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-20 min-w-0 w-full">
            <PropertyMapView
              layout="embedded"
              focusedPropertyId={focusedMapPropertyId}
              onSelectProperty={setFocusedMapPropertyId}
            />
          </div>

          {/* Synchronized Property Cards Column */}
          <div className="lg:col-span-6 xl:col-span-7 min-w-0 w-full">
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
                <SearchX className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  No properties matched your criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your budget range, expanding or clearing the map geofence, or resetting filters to browse all nationwide listings.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onFocusMap={handleFocusOnMap}
                    isMapSelected={focusedMapPropertyId === prop.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
          <SearchX className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No properties matched your criteria</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your budget range, changing the selected city, clearing your geofence area, or resetting filters to browse all nationwide listings.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
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
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              layout={viewMode === 'list' ? 'list' : 'grid'}
              onFocusMap={handleFocusOnMap}
              isMapSelected={focusedMapPropertyId === prop.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
