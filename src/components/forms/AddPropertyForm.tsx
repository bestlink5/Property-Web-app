import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import {
  PAKISTAN_CITIES,
  PAKISTAN_PROVINCES,
  PROPERTY_TYPES,
  DEVELOPMENT_TYPES,
  LAND_TITLE_OPTIONS,
  LAND_POSSESSION_OPTIONS,
  ROAD_ACCESS_OPTIONS,
  LAND_WATER_OPTIONS,
  LAND_ELECTRICITY_OPTIONS,
  LAND_CLASSIFICATION_OPTIONS,
} from '../../data/locations';
import { AreaUnit, DevelopmentType, LandDetails, PropertyPurpose, PropertyType, Province } from '../../types/property';
import { formatPKR } from '../../utils/formatters';
import {
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  Building,
  ShieldAlert,
  Sparkles,
  MapPin,
  Landmark,
  Trees,
  Compass,
  FileCheck,
  Droplets,
  Zap,
} from 'lucide-react';
import { PropertyImageUploader } from './PropertyImageUploader';

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
  const { addProperty, currentUser, setActiveView, navigateToProperty, addToast } = usePropertyContext();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [purpose, setPurpose] = useState<PropertyPurpose>('buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('House');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Location & Development Hierarchy
  const [province, setProvince] = useState<Province>('Islamabad Capital Territory');
  const [city, setCity] = useState('Islamabad');
  const [developmentType, setDevelopmentType] = useState<DevelopmentType>('Sector');
  const [selectedAreaPreset, setSelectedAreaPreset] = useState<string>('Sector F-7');
  const [isCustomLocation, setIsCustomLocation] = useState<boolean>(false);
  const [customDevelopmentName, setCustomDevelopmentName] = useState<string>('');
  const [subLocation, setSubLocation] = useState<string>('Street 34');
  const [location, setLocation] = useState('Sector F-7, Street 34, Islamabad');

  // Private Land & Revenue Patwar Specifications
  const [landClassification, setLandClassification] = useState<string>('Agricultural');
  const [mouzaName, setMouzaName] = useState<string>('');
  const [khasraNumber, setKhasraNumber] = useState<string>('');
  const [titleType, setTitleType] = useState<string>('Registry & Inteqal');
  const [possessionStatus, setPossessionStatus] = useState<string>('Immediate Physical Possession');
  const [roadFrontageFt, setRoadFrontageFt] = useState<number | ''>(100);
  const [roadWidthFt, setRoadWidthFt] = useState<number | ''>(40);
  const [roadAccessType, setRoadAccessType] = useState<string>('Link Road (Paved)');
  const [waterSource, setWaterSource] = useState<string>('Tube Well Installed');
  const [electricityStatus, setElectricityStatus] = useState<string>('Transformer Installed / 3-Phase');

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

  const isLandOrPrivate =
    developmentType === 'Private Land' ||
    ['Agricultural Land', 'Private Land', 'Farmhouse Land', 'Residential Plot', 'Commercial Plot'].includes(
      propertyType
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const devName = isCustomLocation ? customDevelopmentName.trim() : selectedAreaPreset;
    const finalLocation = location.trim() || `${devName}, ${city}`;

    if (!title.trim() || !finalLocation || !price || !areaValue) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    if (isCustomLocation && !customDevelopmentName.trim()) {
      addToast(`Please enter the custom name for your ${developmentType}.`, 'error');
      return;
    }

    if (images.length === 0) {
      addToast('Please upload or select at least one property photograph.', 'error');
      return;
    }

    // Build LandDetails if applicable
    const landDetails: LandDetails | undefined = isLandOrPrivate
      ? {
          landClassification: landClassification as any,
          mouzaName:
            mouzaName.trim() ||
            (developmentType === 'Private Land' ? devName : undefined),
          khasraNumber: khasraNumber.trim() || undefined,
          titleType: titleType as any,
          possessionStatus: possessionStatus as any,
          roadFrontageFt: roadFrontageFt ? Number(roadFrontageFt) : undefined,
          roadWidthFt: roadWidthFt ? Number(roadWidthFt) : undefined,
          roadAccessType: roadAccessType as any,
          waterSource: waterSource as any,
          electricityStatus: electricityStatus as any,
        }
      : undefined;

    const newId = addProperty({
      title,
      description:
        description ||
        `Spacious and modern ${areaValue} ${areaUnit} ${propertyType} located in ${finalLocation}. ${
          isLandOrPrivate && khasraNumber ? `Khasra #${khasraNumber}. Legal Title: ${titleType}.` : ''
        } Features high-quality fittings and prime residential neighborhood.`,
      price,
      purpose,
      type: propertyType,
      province,
      city,
      location: finalLocation,
      developmentType,
      developmentName: devName || undefined,
      isCustomLocation,
      landDetails,
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

            {/* Location & Province Selectors */}
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
                  City in Pakistan *
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setCity(newCity);
                    const cData = PAKISTAN_CITIES.find((c) => c.name === newCity);
                    if (cData) {
                      setProvince(cData.province);
                      const presets =
                        developmentType === 'Sector'
                          ? cData.sectors
                          : developmentType === 'Society'
                          ? cData.societies
                          : developmentType === 'Town'
                          ? cData.towns
                          : developmentType === 'Private Land'
                          ? cData.privateLands
                          : cData.popularAreas;
                      if (presets && presets.length > 0) {
                        setSelectedAreaPreset(presets[0]);
                      }
                    }
                  }}
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

            {/* Development Type: Sector, Society, Town, Private Land, General Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Development Classification *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'Sector' as DevelopmentType, label: 'Sector', icon: Landmark, desc: 'CDA/MDA/KDA' },
                  { id: 'Society' as DevelopmentType, label: 'Society', icon: Building, desc: 'DHA/Bahria/etc' },
                  { id: 'Town' as DevelopmentType, label: 'Town', icon: Compass, desc: 'Model/Johar Town' },
                  { id: 'Private Land' as DevelopmentType, label: 'Private Land', icon: Trees, desc: 'Mouza/Khasra/Zarai' },
                  { id: 'General Area' as DevelopmentType, label: 'General Area', icon: MapPin, desc: 'Colony / Road' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = developmentType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setDevelopmentType(item.id);
                        const cData = PAKISTAN_CITIES.find((c) => c.name === city);
                        if (cData) {
                          const presets =
                            item.id === 'Sector'
                              ? cData.sectors
                              : item.id === 'Society'
                              ? cData.societies
                              : item.id === 'Town'
                              ? cData.towns
                              : item.id === 'Private Land'
                              ? cData.privateLands
                              : cData.popularAreas;
                          if (presets && presets.length > 0) {
                            setSelectedAreaPreset(presets[0]);
                          }
                        }
                      }}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sector / Town / Society / Private Land Selector & Custom Option */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Select or Enter Custom {developmentType} in {city}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomLocation(!isCustomLocation)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  {isCustomLocation
                    ? `← Pick from known ${developmentType}s`
                    : `+ Add Custom ${developmentType}`}
                </button>
              </div>

              {!isCustomLocation ? (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Known {developmentType}s in {city}
                  </label>
                  <select
                    value={selectedAreaPreset}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomLocation(true);
                      } else {
                        setSelectedAreaPreset(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {(() => {
                      const cData = PAKISTAN_CITIES.find((c) => c.name === city);
                      const presets = cData
                        ? developmentType === 'Sector'
                          ? cData.sectors
                          : developmentType === 'Society'
                          ? cData.societies
                          : developmentType === 'Town'
                          ? cData.towns
                          : developmentType === 'Private Land'
                          ? cData.privateLands
                          : cData.popularAreas
                        : [];

                      return (
                        <>
                          {presets.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                          <option value="__custom__">+ Enter Custom {developmentType}...</option>
                        </>
                      );
                    })()}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Custom {developmentType} Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customDevelopmentName}
                    onChange={(e) => setCustomDevelopmentName(e.target.value)}
                    placeholder={
                      developmentType === 'Sector'
                        ? 'e.g. Sector B-17 Block C-1 or Sector G-14/3'
                        : developmentType === 'Society'
                        ? 'e.g. Blue World City General Block or New Metro City'
                        : developmentType === 'Town'
                        ? 'e.g. Kalyal Model Town or Gulshan-e-Maymar Town'
                        : developmentType === 'Private Land'
                        ? 'e.g. Mouza Shah Allah Ditta or Mouza Chakri Road'
                        : 'e.g. Allama Iqbal Road or Canal Road Scheme'
                    }
                    className="w-full px-3 py-2 bg-white border border-emerald-500 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Custom {developmentType} will be cataloged and verified by PropertyMarkaz moderators.
                    </span>
                  </div>
                </div>
              )}

              {/* Sub-location / Street / House / Plot # */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Street / Block / House or Plot Details (Optional)
                </label>
                <input
                  type="text"
                  value={subLocation}
                  onChange={(e) => setSubLocation(e.target.value)}
                  placeholder="e.g. Street 34, Plot # 145 or Block B Main Boulevard"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Live Location Preview */}
              <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>
                  <strong>Full Address Preview:</strong>{' '}
                  {isCustomLocation
                    ? customDevelopmentName.trim() || `[Custom ${developmentType}]`
                    : selectedAreaPreset}
                  {subLocation.trim() ? `, ${subLocation.trim()}` : ''}, {city}
                </span>
              </div>
            </div>

            {/* Special Private Land & Patwar Legal Specs Panel (if Private Land or Land category) */}
            {isLandOrPrivate && (
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <Trees className="w-4 h-4 text-amber-800" />
                    <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Private Land & Patwar Revenue Specifications
                    </h3>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-300">
                    Pakistani Land Law & Registry
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Land Classification */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Land Classification *
                    </label>
                    <select
                      value={landClassification}
                      onChange={(e) => setLandClassification(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                    >
                      {LAND_CLASSIFICATION_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Legal Title / Document */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Legal Title / Document Deed *
                    </label>
                    <select
                      value={titleType}
                      onChange={(e) => setTitleType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                    >
                      {LAND_TITLE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mouza Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Mouza / Revenue Estate Name
                    </label>
                    <input
                      type="text"
                      value={mouzaName}
                      onChange={(e) => setMouzaName(e.target.value)}
                      placeholder="e.g. Mouza Shah Allah Ditta or Mouza Chakri"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Khasra / Khatooni / Khewat # */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Khasra / Khatooni Number
                    </label>
                    <input
                      type="text"
                      value={khasraNumber}
                      onChange={(e) => setKhasraNumber(e.target.value)}
                      placeholder="e.g. Khasra # 412/1 & 412/2, Khewat # 58"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Physical Possession Status */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Possession Status
                    </label>
                    <select
                      value={possessionStatus}
                      onChange={(e) => setPossessionStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                    >
                      {LAND_POSSESSION_OPTIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Road Frontage in Feet */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Road Frontage / Facing (Feet)
                    </label>
                    <input
                      type="number"
                      value={roadFrontageFt}
                      onChange={(e) => setRoadFrontageFt(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 150 ft Frontage"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Road Access Type */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Road Access Type
                    </label>
                    <select
                      value={roadAccessType}
                      onChange={(e) => setRoadAccessType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                    >
                      {ROAD_ACCESS_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Water / Tube Well */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Water / Irrigation Source
                    </label>
                    <select
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                    >
                      {LAND_WATER_OPTIONS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Electricity Status */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Electricity Supply / Transformer
                    </label>
                    <select
                      value={electricityStatus}
                      onChange={(e) => setElectricityStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                    >
                      {LAND_ELECTRICITY_OPTIONS.map((el) => (
                        <option key={el} value={el}>
                          {el}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => {
                  const devName = isCustomLocation ? customDevelopmentName.trim() : selectedAreaPreset;
                  const finalLoc = `${devName}${subLocation.trim() ? `, ${subLocation.trim()}` : ''}, ${city}`;
                  setLocation(finalLoc);

                  if (!title.trim()) {
                    addToast('Please enter an advertisement title.', 'error');
                    return;
                  }
                  if (isCustomLocation && !customDevelopmentName.trim()) {
                    addToast(`Please enter the custom name for your ${developmentType}.`, 'error');
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

            {/* Real Property Photo Uploader */}
            <PropertyImageUploader
              images={images}
              onChange={setImages}
              maxImages={15}
            />

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
