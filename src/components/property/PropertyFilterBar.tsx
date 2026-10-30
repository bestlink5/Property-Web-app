import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import {
  PAKISTAN_CITIES,
  PROPERTY_TYPES,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  DEVELOPMENT_TYPES,
} from '../../data/locations';
import { AreaUnit, DevelopmentType } from '../../types/property';
import {
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
  Landmark,
  Building,
  Compass,
  Trees,
  MapPin,
  Layers,
} from 'lucide-react';

interface PropertyFilterBarProps {
  compact?: boolean;
}

export const PropertyFilterBar: React.FC<PropertyFilterBarProps> = ({ compact = false }) => {
  const { filters, updateFilter, resetFilters, filteredProperties } = usePropertyContext();
  const [expanded, setExpanded] = useState(!compact);

  // Determine available areas based on selected city and development type
  const selectedCityData = PAKISTAN_CITIES.find(
    (c) => c.name.toLowerCase() === filters.city.toLowerCase()
  );

  const getCategorizedAreas = (): string[] => {
    if (selectedCityData) {
      if (filters.developmentType === 'Sector') return selectedCityData.sectors;
      if (filters.developmentType === 'Society') return selectedCityData.societies;
      if (filters.developmentType === 'Town') return selectedCityData.towns;
      if (filters.developmentType === 'Private Land') return selectedCityData.privateLands;
      return selectedCityData.popularAreas;
    }

    // Across all cities
    if (filters.developmentType === 'Sector') {
      return Array.from(new Set(PAKISTAN_CITIES.flatMap((c) => c.sectors)));
    }
    if (filters.developmentType === 'Society') {
      return Array.from(new Set(PAKISTAN_CITIES.flatMap((c) => c.societies)));
    }
    if (filters.developmentType === 'Town') {
      return Array.from(new Set(PAKISTAN_CITIES.flatMap((c) => c.towns)));
    }
    if (filters.developmentType === 'Private Land') {
      return Array.from(new Set(PAKISTAN_CITIES.flatMap((c) => c.privateLands)));
    }
    return Array.from(new Set(PAKISTAN_CITIES.flatMap((c) => c.popularAreas)));
  };

  const areasList = getCategorizedAreas();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Top Row: Purpose Switcher + Main Keyword Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        {/* Purpose Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => updateFilter('purpose', 'all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filters.purpose === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Listings
          </button>
          <button
            onClick={() => updateFilter('purpose', 'buy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filters.purpose === 'buy'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buy Property
          </button>
          <button
            onClick={() => updateFilter('purpose', 'rent')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filters.purpose === 'rent'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rent Property
          </button>
        </div>

        {/* Search bar input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Search custom sector, town, society, Mouza, Khasra #, or DHA..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Results indicator & mobile toggle */}
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-700">
            {filteredProperties.length} properties found
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-emerald-800 font-semibold p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{expanded ? 'Less Filters' : 'More Filters'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Row 2: Development Classification Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          Zone:
        </span>
        {[
          { id: 'all', label: 'All Developments' },
          { id: 'Sector', label: '🏛️ Sectors (CDA/MDA)', icon: Landmark },
          { id: 'Society', label: '🏘️ Housing Societies (DHA/Bahria)', icon: Building },
          { id: 'Town', label: '🏙️ Planned Towns', icon: Compass },
          { id: 'Private Land', label: '🌾 Private Land & Mouza', icon: Trees },
        ].map((item) => {
          const isSelected = filters.developmentType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                updateFilter('developmentType', item.id as any);
                updateFilter('area', ''); // reset area selection when zone changes
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer text-xs ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* City Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            City in Pakistan
          </label>
          <select
            value={filters.city}
            onChange={(e) => {
              updateFilter('city', e.target.value);
              updateFilter('area', ''); // reset area when city changes
            }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
          >
            <option value="">All Cities (Nationwide)</option>
            {PAKISTAN_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.province})
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Sector / Town / Society / Mouza Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 truncate">
            {filters.developmentType === 'Sector'
              ? 'Specific Sector'
              : filters.developmentType === 'Society'
              ? 'Housing Society'
              : filters.developmentType === 'Town'
              ? 'Town / Scheme'
              : filters.developmentType === 'Private Land'
              ? 'Mouza / Private Land'
              : 'Society / Sector / Town'}
          </label>
          <select
            value={filters.area}
            onChange={(e) => updateFilter('area', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
          >
            <option value="">
              {filters.city
                ? `All ${filters.developmentType === 'all' ? 'Areas' : filters.developmentType + 's'} in ${filters.city}`
                : `All ${filters.developmentType === 'all' ? 'Areas' : filters.developmentType + 's'} (Nationwide)`}
            </option>
            {areasList.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Property Category
          </label>
          <select
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
          >
            <option value="">All Categories</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Sort Listings
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="date-newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="area-desc">Area: Largest First</option>
          </select>
        </div>
      </div>

      {/* Expanded Filters Drawer (Price range, Bedrooms, Bathrooms, Area) */}
      {expanded && (
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Min Price (PKR) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Min Price (PKR)
              </label>
              <select
                value={filters.minPrice ?? ''}
                onChange={(e) =>
                  updateFilter('minPrice', e.target.value === '' ? null : Number(e.target.value))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="">No Minimum</option>
                {filters.purpose === 'rent' ? (
                  <>
                    <option value="30000">PKR 30,000</option>
                    <option value="50000">PKR 50,000</option>
                    <option value="100000">PKR 1 Lakh</option>
                    <option value="200000">PKR 2 Lakh</option>
                  </>
                ) : (
                  <>
                    <option value="5000000">PKR 50 Lakh (0.5 Cr)</option>
                    <option value="10000000">PKR 1 Crore</option>
                    <option value="20000000">PKR 2 Crore</option>
                    <option value="50000000">PKR 5 Crore</option>
                    <option value="100000000">PKR 10 Crore</option>
                  </>
                )}
              </select>
            </div>

            {/* Max Price (PKR) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Max Price (PKR)
              </label>
              <select
                value={filters.maxPrice ?? ''}
                onChange={(e) =>
                  updateFilter('maxPrice', e.target.value === '' ? null : Number(e.target.value))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="">No Maximum</option>
                {filters.purpose === 'rent' ? (
                  <>
                    <option value="100000">PKR 1 Lakh</option>
                    <option value="200000">PKR 2 Lakh</option>
                    <option value="500000">PKR 5 Lakh</option>
                    <option value="1000000">PKR 10 Lakh</option>
                  </>
                ) : (
                  <>
                    <option value="15000000">PKR 1.5 Crore</option>
                    <option value="35000000">PKR 3.5 Crore</option>
                    <option value="60000000">PKR 6 Crore</option>
                    <option value="100000000">PKR 10 Crore</option>
                    <option value="300000000">PKR 30 Crore</option>
                  </>
                )}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Bedrooms
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateFilter('minBedrooms', null)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                    filters.minBedrooms === null
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Any
                </button>
                {[1, 2, 3, 4, 5].map((bed) => (
                  <button
                    key={bed}
                    onClick={() => updateFilter('minBedrooms', bed)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                      filters.minBedrooms === bed
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {bed}+
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Bathrooms
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateFilter('minBathrooms', null)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                    filters.minBathrooms === null
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Any
                </button>
                {[1, 2, 3, 4].map((bath) => (
                  <button
                    key={bath}
                    onClick={() => updateFilter('minBathrooms', bath)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                      filters.minBathrooms === bath
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {bath}+
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Filters Action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
