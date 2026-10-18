import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { PAKISTAN_CITIES, PAKISTAN_PROVINCES, PROPERTY_TYPES } from '../../data/locations';
import { AreaUnit, PropertyPurpose, PropertyType, Province } from '../../types/property';
import { formatPKR } from '../../utils/formatters';
import { Plus, Check, ArrowRight, ArrowLeft, Upload, Building, ShieldAlert, Sparkles } from 'lucide-react';

const COMMON_AMENITIES = [
  'Electricity 24/7',
  'Sui Gas Connected',
  'Water Boring / CDA Line',
  'Underground Wiring',
  'Gated Community Security',
  'Near Mosque & Park',
  'Main Boulevard Frontage',
  'Corner Plot',
  'Solar System Ready',
  'Servant Quarter',
  'Double Kitchen',
  'Covered Car Parking',
];

export const AddPropertyForm: React.FC = () => {
  const { addProperty, currentUser, setActiveView, navigateToProperty } = usePropertyContext();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [purpose, setPurpose] = useState<PropertyPurpose>('buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('House');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Location
  const [province, setProvince] = useState<Province>('Islamabad Capital Territory');
  const [city, setCity] = useState('Islamabad');
  const [location, setLocation] = useState('');

  // Price & Area
  const [price, setPrice] = useState<number>(25000000); // 2.5 Crore default
  const [areaValue, setAreaValue] = useState<number>(10);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('Marla');
  const [coveredAreaSqFt, setCoveredAreaSqFt] = useState<number>(2800);

  // Specifications
  const [bedrooms, setBedrooms] = useState<number>(4);
  const [bathrooms, setBathrooms] = useState<number>(4);
  const [parkingSpaces, setParkingSpaces] = useState<number>(2);
  const [yearBuilt, setYearBuilt] = useState<number>(2025);
  const [furnishing, setFurnishing] = useState<'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished'>('Unfurnished');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Electricity 24/7',
    'Sui Gas Connected',
    'Gated Community Security',
  ]);

  // Contact & Seller Info
  const [sellerType, setSellerType] = useState<'Owner' | 'Agent' | 'Builder'>('Owner');
  const [contactName, setContactName] = useState(currentUser?.name || 'Chaudhry Adnan');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+92 300 7654321');
  const [contactWhatsapp, setContactWhatsapp] = useState(currentUser?.phone || '+92 300 7654321');

  // Images state (simulated file upload with sample property images)
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80',
  ]);

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !price || !areaValue) {
      alert('Please fill in all required fields.');
      return;
    }

    const newId = addProperty({
      title,
      description:
        description ||
        `Spacious and modern ${areaValue} ${areaUnit} ${propertyType} located in ${location}, ${city}. Features high-quality fittings and prime residential neighborhood.`,
      price,
      purpose,
      type: propertyType,
      province,
      city,
      location,
      areaValue,
      areaUnit,
      coveredAreaSqFt,
      bedrooms: ['House', 'Apartment', 'Penthouse'].includes(propertyType) ? bedrooms : undefined,
      bathrooms: ['House', 'Apartment', 'Penthouse'].includes(propertyType) ? bathrooms : undefined,
      parkingSpaces,
      yearBuilt,
      furnishing,
      features: selectedFeatures,
      images,
      agent: {
        id: `agent-${Date.now()}`,
        name: contactName,
        agency: sellerType === 'Agent' ? 'Verified Agency' : 'Direct Owner Listing',
        phone: contactPhone,
        whatsapp: contactWhatsapp,
        email: 'inquiry@propertymarkaz.pk',
        city,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
        verified: false,
        rating: 5.0,
        reviewsCount: 1,
        experienceYears: 5,
        activeListingsCount: 1,
        bio: `${sellerType} listing in ${city}. Verified direct contact.`,
        languages: ['Urdu', 'English'],
      },
      featured: false,
      sellerType,
    });

    // Navigate to admin portal to view pending queue
    setActiveView('admin');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
          Property Submission Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          List Your Property in Pakistan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Reach genuine buyers & tenants across Islamabad, Lahore, Karachi, Rawalpindi, Mirpur AJK, and overseas.
        </p>
      </div>

      {/* Stepper Indicators */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        {[
          { num: 1, label: 'Category & Location' },
          { num: 2, label: 'Price & Specs' },
          { num: 3, label: 'Photos & Contact' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num
                  ? 'bg-emerald-700 text-white'
                  : step > s.num
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Multi-step Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        {step === 1 && (
          <div className="space-y-5">
            {/* Purpose */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Purpose of Listing *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPurpose('buy')}
                  className={`py-3 px-4 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                    purpose === 'buy'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-1 ring-emerald-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Sell (For Sale)
                </button>
                <button
                  type="button"
                  onClick={() => setPurpose('rent')}
                  className={`py-3 px-4 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                    purpose === 'rent'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-1 ring-emerald-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Rent Out (For Rent)
                </button>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Property Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPropertyType(type)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-colors ${
                      propertyType === type
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Advertisement Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10 Marla Brand New Modern House in Sector F-1 Mirpur AJK"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Location Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Province / Territory *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value as Province)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {PAKISTAN_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.province})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specific Location / Sector / Street Address *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sector F-7/2, Street 34 or Bahria Town Phase 7, Block B"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => {
                  if (!title.trim() || !location.trim()) {
                    alert('Please enter title and location');
                    return;
                  }
                  setStep(2);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Continue to Price & Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            {/* Price in PKR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {purpose === 'buy' ? 'Demand Price (PKR) *' : 'Monthly Rent (PKR) *'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="10000"
                  required
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="e.g. 25000000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>In Pakistani Format: {formatPKR(price)}</span>
                <span className="text-slate-400">Rs. {price.toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Land Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plot / Land Area Value *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={areaValue || ''}
                  onChange={(e) => setAreaValue(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area Unit *
                </label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="Marla">Marla (225 sq ft)</option>
                  <option value="Kanal">Kanal (20 Marla)</option>
                  <option value="Sq. Yd">Square Yard / Gaz</option>
                  <option value="Sq. Ft">Square Feet</option>
                </select>
              </div>
            </div>

            {/* Bedrooms & Bathrooms if residential */}
            {['House', 'Apartment', 'Penthouse'].includes(propertyType) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bedrooms
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((b) => (
                      <option key={b} value={b}>
                        {b} Beds
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bathrooms
                  </label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((b) => (
                      <option key={b} value={b}>
                        {b} Baths
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Parking
                  </label>
                  <select
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4, 6].map((p) => (
                      <option key={p} value={p}>
                        {p} Cars
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Furnishing
                  </label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                  </select>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Property Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key features, flooring, construction material, water/gas status, registry condition..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
              ></textarea>
            </div>

            {/* Features Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Features & Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMMON_AMENITIES.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-xs text-slate-700 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(item)}
                      onChange={() => toggleFeature(item)}
                      className="accent-emerald-700 rounded"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Continue to Photos & Contact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            {/* Seller Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                You are Listing as *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Owner', 'Agent', 'Builder'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSellerType(role)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                      sellerType === role
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-1 ring-emerald-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Phone Call Number *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number (for direct chat button) *
                </label>
                <input
                  type="tel"
                  required
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Photos Upload Sandbox Simulation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Property Photographs
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-xs font-semibold text-slate-700">
                  Attached High-Resolution Sample Images ({images.length} photos)
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  In production, images upload directly to Supabase Storage bucket with automated WebP compression.
                </p>
              </div>

              {/* Thumbnails preview */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <div key={idx} className="w-20 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    <img src={img} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance / Moderation Notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Quality Assurance Notice:</span>
              <p>
                Your listing will be submitted to the PropertyMarkaz Admin Dashboard for review. Once approved by an
                admin moderator, it becomes immediately visible to nationwide buyers.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Advertisement for Approval</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
