import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { PropertyFilterBar } from '../property/PropertyFilterBar';
import { PropertyCard } from '../property/PropertyCard';
import { PropertyMapView } from '../property/PropertyMapView';
import { LayoutGrid, List, Map as MapIcon, SearchX, RotateCcw, X } from 'lucide-react';

export const ListingPage: React.FC = () => {
  const { filteredProperties, filters, updateFilter, resetFilters } = usePropertyContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  const hasActiveFilters = Boolean(
    filters.city ||
      filters.type ||
      filters.area ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.searchQuery ||
      filters.geofence
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 min-w-0">
      {/* Page Title & Purpose Indicator */}
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

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'grid'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'list'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'map'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Interactive Map & Geofence"
          >
            <MapIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Map</span>
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

      {/* Results View: Interactive Map OR Grid/List */}
      {viewMode === 'map' ? (
        <PropertyMapView />
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
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-5xl mx-auto'
          }`}
        >
          {filteredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
};
