import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { formatPKR, formatFullPKR, formatArea, getWhatsAppUrl, getTelUrl } from '../../utils/formatters';
import { ImageGallery } from './ImageGallery';
import { AreaUnitConverter } from './AreaUnitConverter';
import { MortgageCalculator } from './MortgageCalculator';
import { PropertyCard } from './PropertyCard';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Car,
  ShieldCheck,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Mail,
  Send,
  Building,
  CheckCircle2,
  ArrowLeft,
  Info,
  Edit3,
  Landmark,
  Trees,
  Compass,
  Droplets,
  Zap,
  FileText,
  Check,
} from 'lucide-react';

export const PropertyDetailsView: React.FC = () => {
  const {
    properties,
    selectedPropertyId,
    setActiveView,
    toggleSaveProperty,
    isPropertySaved,
    navigateToAgent,
    openEditPropertyModal,
    addToast,
  } = usePropertyContext();

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState(
    'Assalam-o-Alaikum, I am interested in this property. Please contact me with more information.'
  );
  const [inquirySent, setInquirySent] = useState(false);

  const property = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-500 mb-4">Property not found.</p>
        <button
          onClick={() => setActiveView('listings')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  const isSaved = isPropertySaved(property.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `${property.title} in ${property.city} for ${formatPKR(property.price)} on PropertyMarkaz`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Property link copied to clipboard!', 'success');
    }
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      addToast('Please provide your name and contact phone number.', 'error');
      return;
    }
    setInquirySent(true);
    addToast(
      `Inquiry successfully submitted to ${property.agent.name}. The agent will reach out shortly!`,
      'success'
    );
  };

  // Find similar properties in the same city or category
  const similarProperties = properties
    .filter((p) => p.id !== property.id && (p.city === property.city || p.type === property.type))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <button
          onClick={() => setActiveView('listings')}
          className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Edit Option after approval */}
          <button
            onClick={() => openEditPropertyModal(property.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            title="Edit Price, Land Size, or Owner/Agent Contact Details"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Edit Price, Land & Contact</span>
          </button>

          <button
            onClick={() => toggleSaveProperty(property.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save Property'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Gallery + Details / Right Sticky Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols on desktop): Gallery & Full Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <ImageGallery images={property.images} title={property.title} />

          {/* Title & Location Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
              </span>

              {property.developmentType && (
                <span
                  className={`font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                    property.developmentType === 'Private Land'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : property.developmentType === 'Sector'
                      ? 'bg-sky-100 text-sky-900 border border-sky-300'
                      : property.developmentType === 'Society'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                  }`}
                >
                  {property.developmentType === 'Sector' && <Landmark className="w-3 h-3 text-sky-700" />}
                  {property.developmentType === 'Society' && <Building className="w-3 h-3 text-emerald-700" />}
                  {property.developmentType === 'Town' && <Compass className="w-3 h-3 text-indigo-700" />}
                  {property.developmentType === 'Private Land' && <Trees className="w-3 h-3 text-amber-800" />}
                  <span>{property.developmentType}</span>
                </span>
              )}

              {property.isCustomLocation && (
                <span className="font-semibold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                  Custom Location
                </span>
              )}

              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {property.type}
              </span>

              {property.landDetails?.titleType && (
                <span className="font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {property.landDetails.titleType}
                </span>
              )}

              <span className="font-mono text-slate-400">Ref: {property.id}</span>
              {property.status === 'approved' && (
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Approved Listing
                </span>
              )}
              {property.priceNegotiable !== false && (
                <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Negotiable
                </span>
              )}
              {property.updatedAt && (
                <span className="text-[10px] text-slate-500 font-mono">
                  Updated: {new Date(property.updatedAt).toLocaleDateString()}
                </span>
              )}
              {property.featured && (
                <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-snug">
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{property.location}, {property.city}, {property.province}</span>
            </div>

            {/* Mobile Price Banner (only visible on mobile) */}
            <div className="lg:hidden mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Demanded Price</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatPKR(property.price)}
                </span>
                <span className="text-xs text-slate-500 block">{formatFullPKR(property.price)}</span>
              </div>
            </div>
          </div>

          {/* Key Facts / Specifications Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              Overview & Specifications
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-1">Land Area</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Maximize2 className="w-4 h-4 text-emerald-700" />
                  <span>{formatArea(property.areaValue, property.areaUnit)}</span>
                </div>
              </div>

              {property.coveredAreaSqFt && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block mb-1">Covered Area</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>{property.coveredAreaSqFt.toLocaleString()} Sq. Ft</span>
                  </div>
                </div>
              )}

              {property.bedrooms !== undefined && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block mb-1">Bedrooms</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Bed className="w-4 h-4 text-emerald-700" />
                    <span>{property.bedrooms} Master Beds</span>
                  </div>
                </div>
              )}

              {property.bathrooms !== undefined && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block mb-1">Bathrooms</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Bath className="w-4 h-4 text-emerald-700" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                </div>
              )}

              {property.parkingSpaces !== undefined && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block mb-1">Car Parking</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Car className="w-4 h-4 text-emerald-700" />
                    <span>{property.parkingSpaces} Vehicles</span>
                  </div>
                </div>
              )}

              {property.yearBuilt && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block mb-1">Year Built</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>{property.yearBuilt}</span>
                  </div>
                </div>
              )}

              {property.furnishing && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block mb-1">Furnishing</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>{property.furnishing}</span>
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-1">Listed By</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{property.sellerType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
              Property Description
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

            <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200/60 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
              <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <span>
                <strong>Demonstration Listing Notice:</strong> This listing is demonstration data on PropertyMarkaz
                prototype. In live production, verified title registry records and legal clearances are vetted.
              </span>
            </div>
          </div>

          {/* Amenities & Features */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              Amenities & Utilities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.features.map((feat, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Private Land & Patwar Revenue Specifications (if Private Land or landDetails present) */}
          {(property.developmentType === 'Private Land' ||
            Boolean(property.landDetails) ||
            ['Agricultural Land', 'Private Land', 'Farmhouse Land'].includes(property.type)) && (
            <div className="bg-white rounded-xl border border-amber-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <Trees className="w-5 h-5 text-amber-800" />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Private Land & Patwar Revenue Record
                    </h2>
                    <span className="text-[11px] text-slate-500">
                      Pakistan Land Revenue & Mutation (Inteqal) Verification
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded border border-amber-300">
                  Revenue Title Deed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                {/* Mouza Name */}
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    Mouza / Revenue Estate
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {property.landDetails?.mouzaName || property.location}
                  </span>
                </div>

                {/* Khasra / Khatooni # */}
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    Khasra / Khatooni #
                  </span>
                  <span className="font-bold font-mono text-slate-900 mt-0.5 block">
                    {property.landDetails?.khasraNumber || 'Clear Revenue Record'}
                  </span>
                </div>

                {/* Legal Title Deed */}
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    Title & Document Deed
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {property.landDetails?.titleType || 'Registry & Inteqal'}
                  </span>
                </div>

                {/* Physical Possession */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    Possession Status
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {property.landDetails?.possessionStatus || 'Immediate Possession'}
                  </span>
                </div>

                {/* Road Frontage */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    Road Access & Frontage
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {property.landDetails?.roadFrontageFt
                      ? `${property.landDetails.roadFrontageFt} ft Frontage`
                      : 'Direct Road Access'}
                    {property.landDetails?.roadWidthFt ? ` (${property.landDetails.roadWidthFt}ft Road)` : ''}
                  </span>
                </div>

                {/* Water & Irrigation */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    Water / Irrigation
                  </span>
                  <div className="flex items-center gap-1 mt-0.5 font-bold text-slate-900">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    <span>{property.landDetails?.waterSource || 'Boring / Available'}</span>
                  </div>
                </div>

                {/* Electricity / Transformer */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2 md:col-span-3">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                    Electricity & Grid Connection
                  </span>
                  <div className="flex items-center gap-1 mt-0.5 font-bold text-slate-900">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>{property.landDetails?.electricityStatus || 'WAPDA Grid / Transformer Available'}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-950">
                <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>
                  <strong>Patwari Verification:</strong> Registry Deed, Fard Malkiat, Aks Shajra, and Mutation (Inteqal) are verified through the local Sub-Registrar and Patwar Halqa.
                </span>
              </div>
            </div>
          )}

          {/* Pakistani Land Area Converter */}
          <AreaUnitConverter initialValue={property.areaValue} initialUnit={property.areaUnit} />

          {/* Home Loan / Installment Calculator */}
          {property.purpose === 'buy' && (
            <MortgageCalculator initialPrice={property.price} />
          )}
        </div>

        {/* Right Column: Sticky Contact Module & Agent Card */}
        <div className="space-y-6 lg:sticky lg:top-20">
          {/* Price Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
              Asking Price
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {formatPKR(property.price)}
              {property.purpose === 'rent' && (
                <span className="text-xs font-normal text-slate-500 ml-1 font-sans">/ month</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">{formatFullPKR(property.price)}</p>

            {/* Direct Instant Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-5">
              <a
                href={getWhatsAppUrl(property.agent.whatsapp, property.title, property.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={getTelUrl(property.agent.phone)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Agent</span>
              </a>
            </div>

            {/* Edit Option after approval */}
            <button
              onClick={() => openEditPropertyModal(property.id)}
              className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              title="Edit Price, Land, or Owner/Agent"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Edit Price, Land or Agent Details</span>
            </button>
          </div>

          {/* Agent Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{property.agent.name}</h3>
                  {property.agent.verified && (
                    <span title="Verified Agent">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{property.agent.agency}</p>
                <p className="text-[11px] text-emerald-800">{property.agent.city} Specialist</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 line-clamp-2">
              {property.agent.bio}
            </p>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => navigateToAgent(property.agent.id)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                View Agent Profile & Listings ({property.agent.activeListingsCount})
              </button>

              <button
                onClick={() => openEditPropertyModal(property.id)}
                className="w-full py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title="Edit Agent / Owner Contact"
              >
                <Edit3 className="w-3 h-3 text-emerald-700" />
                <span>Change Contact / Assign Broker</span>
              </button>
            </div>
          </div>

          {/* Direct Send Inquiry Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Send Direct Inquiry</h3>
            <p className="text-xs text-slate-500 mb-4">
              Message will be transmitted directly to the assigned agent.
            </p>

            {inquirySent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center text-emerald-900">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h4 className="text-xs font-bold">Inquiry Sent Successfully!</h4>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Agent {property.agent.name} has received your inquiry and will contact you via phone or WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Usman Tariq"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="pt-8 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Similar Properties in {property.city}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((simProp) => (
              <PropertyCard key={simProp.id} property={simProp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
