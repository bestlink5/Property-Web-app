import React, { useState } from 'react';
import { Property } from '../../types/property';
import { usePropertyContext } from '../../context/PropertyContext';
import { formatPKR, formatArea, getWhatsAppUrl } from '../../utils/formatters';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  Edit3,
  Landmark,
  Compass,
  Trees,
  FileCheck,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { navigateToProperty, toggleSaveProperty, isPropertySaved, openEditPropertyModal } = usePropertyContext();
  const [imageError, setImageError] = useState(false);
  const isSaved = isPropertySaved(property.id);

  const mainImage = property.images && property.images.length > 0 ? property.images[0] : null;

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Top Image Showcase */}
      <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
        {!imageError && mainImage ? (
          <img
            src={mainImage}
            alt={property.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          /* Zero-Broken-Image Policy: High polish CSS/SVG fallback container */
          <div className="w-full h-full bg-linear-to-br from-slate-100 via-slate-50 to-emerald-50/50 flex flex-col items-center justify-center p-4 text-slate-400">
            <Building className="w-10 h-10 text-emerald-700/40 mb-1" />
            <span className="text-xs font-semibold text-slate-600">{property.type}</span>
            <span className="text-[11px] text-slate-500">{property.city}</span>
          </div>
        )}

        {/* Top Badges overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1 z-10 max-w-[80%]">
          <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs">
            {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
          </span>

          {property.developmentType && (
            <span
              className={`backdrop-blur-xs text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs flex items-center gap-1 ${
                property.developmentType === 'Private Land'
                  ? 'bg-amber-900/90 text-amber-200'
                  : property.developmentType === 'Sector'
                  ? 'bg-sky-900/90 text-sky-200'
                  : property.developmentType === 'Society'
                  ? 'bg-emerald-900/90 text-emerald-200'
                  : 'bg-indigo-900/90 text-indigo-200'
              }`}
            >
              {property.developmentType === 'Sector' && <Landmark className="w-2.5 h-2.5" />}
              {property.developmentType === 'Society' && <Building className="w-2.5 h-2.5" />}
              {property.developmentType === 'Town' && <Compass className="w-2.5 h-2.5" />}
              {property.developmentType === 'Private Land' && <Trees className="w-2.5 h-2.5" />}
              <span>{property.developmentType}</span>
            </span>
          )}

          {property.isCustomLocation && (
            <span className="bg-purple-900/85 backdrop-blur-xs text-purple-200 text-[9px] font-mono px-1.5 py-0.5 rounded">
              Custom
            </span>
          )}

          {property.featured && (
            <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Quick Edit button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEditPropertyModal(property.id);
          }}
          aria-label="Edit price, land or contact"
          title="Edit price, land or owner/agent"
          className="absolute top-2.5 right-12 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-emerald-700 hover:bg-white flex items-center justify-center transition-colors shadow-xs z-10 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        {/* Save button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProperty(property.id);
          }}
          aria-label={isSaved ? 'Remove from favorites' : 'Save property'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-600 hover:bg-white flex items-center justify-center transition-colors shadow-xs z-10 cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Demo data marker & updated tag */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1">
          <span className="bg-black/60 backdrop-blur-xs text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded">
            Demo Listing #{property.id}
          </span>
          {property.updatedAt && (
            <span className="bg-emerald-900/80 backdrop-blur-xs text-emerald-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">
              Updated
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Price Header in PKR */}
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {formatPKR(property.price)}
              {property.purpose === 'rent' && (
                <span className="text-xs font-normal text-slate-500 ml-1 font-sans">/ month</span>
              )}
            </span>
            <div className="flex items-center gap-1.5">
              {property.priceNegotiable !== false && (
                <span className="text-[10px] text-slate-400 font-medium">Neg.</span>
              )}
              <span className="text-xs font-semibold text-emerald-800">
                {property.type}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-600 mb-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Property Title */}
          <h3
            onClick={() => navigateToProperty(property.id)}
            className="text-sm font-bold text-slate-800 hover:text-emerald-700 line-clamp-2 transition-colors cursor-pointer mb-3 leading-snug"
          >
            {property.title}
          </h3>

          {/* Key specs: Clean, unboxed metadata with bullet separators (anti-pill) */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 py-2 border-t border-b border-slate-100 mb-3">
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{formatArea(property.areaValue, property.areaUnit)}</span>
            </div>

            {property.bedrooms !== undefined && (
              <>
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              </>
            )}

            {property.bathrooms !== undefined && (
              <>
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </>
            )}

            {property.landDetails?.titleType && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-amber-800 font-semibold">{property.landDetails.titleType}</span>
              </>
            )}

            {property.landDetails?.khasraNumber && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600 font-mono text-[11px] truncate max-w-[150px]">
                  {property.landDetails.khasraNumber}
                </span>
              </>
            )}

            {property.landDetails?.roadFrontageFt && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600">{property.landDetails.roadFrontageFt}ft Frontage</span>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions: WhatsApp Quick Contact + Details Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <a
            href={getWhatsAppUrl(property.agent.whatsapp, property.title, property.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button
            onClick={() => navigateToProperty(property.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
