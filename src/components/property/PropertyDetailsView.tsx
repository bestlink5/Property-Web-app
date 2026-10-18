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
} from 'lucide-react';

export const PropertyDetailsView: React.FC = () => {
  const {
    properties,
    selectedPropertyId,
    setActiveView,
    toggleSaveProperty,
    isPropertySaved,
    navigateToAgent,
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
              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {property.type}
              </span>
              <span className="font-mono text-slate-400">Ref: {property.id}</span>
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

            <button
              onClick={() => navigateToAgent(property.agent.id)}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              View Agent Profile & Listings ({property.agent.activeListingsCount})
            </button>
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
