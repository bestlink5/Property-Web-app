import React, { useState, useEffect } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { AreaUnit, DevelopmentType, LandDetails, Property } from '../../types/property';
import {
  DEVELOPMENT_TYPES,
  LAND_TITLE_OPTIONS,
  LAND_POSSESSION_OPTIONS,
  ROAD_ACCESS_OPTIONS,
  LAND_WATER_OPTIONS,
  LAND_ELECTRICITY_OPTIONS,
} from '../../data/locations';
import { formatPKR, formatFullPKR, convertToSqFt } from '../../utils/formatters';
import {
  X,
  Edit3,
  DollarSign,
  Maximize2,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Building,
  Phone,
  MessageCircle,
  Mail,
  ArrowRight,
  Sparkles,
  History,
  Landmark,
  Trees,
  Compass,
  MapPin,
} from 'lucide-react';

export const EditApprovedPropertyModal: React.FC = () => {
  const {
    properties,
    editingPropertyId,
    setEditingPropertyId,
    updateProperty,
    agents,
    addToast,
  } = usePropertyContext();

  const property = properties.find((p) => p.id === editingPropertyId);

  // Form State
  const [activeTab, setActiveTab] = useState<'price' | 'land' | 'contact'>('price');
  
  // Price Fields
  const [price, setPrice] = useState<number>(0);
  const [priceNegotiable, setPriceNegotiable] = useState<boolean>(true);
  const [purpose, setPurpose] = useState<'buy' | 'rent'>('buy');
  
  // Land & Area Fields
  const [areaValue, setAreaValue] = useState<number>(0);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('Marla');
  const [coveredAreaSqFt, setCoveredAreaSqFt] = useState<number | undefined>(undefined);

  // Development & Location Fields
  const [developmentType, setDevelopmentType] = useState<DevelopmentType>('Sector');
  const [developmentName, setDevelopmentName] = useState<string>('');
  const [locationStr, setLocationStr] = useState<string>('');

  // Private Land & Patwar Specs
  const [mouzaName, setMouzaName] = useState<string>('');
  const [khasraNumber, setKhasraNumber] = useState<string>('');
  const [titleType, setTitleType] = useState<string>('Registry & Inteqal');
  const [possessionStatus, setPossessionStatus] = useState<string>('Immediate Physical Possession');
  const [roadFrontageFt, setRoadFrontageFt] = useState<number | ''>('');
  const [roadWidthFt, setRoadWidthFt] = useState<number | ''>('');
  const [roadAccessType, setRoadAccessType] = useState<string>('Link Road (Paved)');
  const [waterSource, setWaterSource] = useState<string>('Tube Well Installed');
  const [electricityStatus, setElectricityStatus] = useState<string>('Transformer Installed / 3-Phase');
  
  // Owner / Agent Contact Fields
  const [sellerType, setSellerType] = useState<'Owner' | 'Agent' | 'Builder'>('Agent');
  const [contactName, setContactName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isAgentVerified, setIsAgentVerified] = useState(true);
  
  // Audit / Change Note
  const [updateNote, setUpdateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form state whenever property changes
  useEffect(() => {
    if (property) {
      setPrice(property.price || 0);
      setPriceNegotiable(property.priceNegotiable !== false);
      setPurpose(property.purpose || 'buy');
      
      setAreaValue(property.areaValue || 0);
      setAreaUnit(property.areaUnit || 'Marla');
      setCoveredAreaSqFt(property.coveredAreaSqFt);

      setDevelopmentType(property.developmentType || 'Sector');
      setDevelopmentName(property.developmentName || '');
      setLocationStr(property.location || '');

      setMouzaName(property.landDetails?.mouzaName || '');
      setKhasraNumber(property.landDetails?.khasraNumber || '');
      setTitleType(property.landDetails?.titleType || 'Registry & Inteqal');
      setPossessionStatus(property.landDetails?.possessionStatus || 'Immediate Physical Possession');
      setRoadFrontageFt(property.landDetails?.roadFrontageFt ?? '');
      setRoadWidthFt(property.landDetails?.roadWidthFt ?? '');
      setRoadAccessType(property.landDetails?.roadAccessType || 'Link Road (Paved)');
      setWaterSource(property.landDetails?.waterSource || 'Tube Well Installed');
      setElectricityStatus(property.landDetails?.electricityStatus || 'Transformer Installed / 3-Phase');
      
      setSellerType(property.sellerType || 'Agent');
      setContactName(property.agent?.name || '');
      setAgencyName(property.agent?.agency || '');
      setContactPhone(property.agent?.phone || '');
      setContactWhatsapp(property.agent?.whatsapp || property.agent?.phone || '');
      setContactEmail(property.agent?.email || '');
      setIsAgentVerified(property.agent?.verified ?? true);
      
      setUpdateNote('');
      setActiveTab('price');
    }
  }, [property]);

  if (!editingPropertyId || !property) {
    return null;
  }

  const handleClose = () => {
    setEditingPropertyId(null);
  };

  // Quick price adjuster
  const adjustPrice = (delta: number) => {
    setPrice((prev) => Math.max(0, prev + delta));
  };

  // Quick preset agent selection
  const handleSelectPresetAgent = (agentId: string) => {
    const selected = agents.find((a) => a.id === agentId);
    if (selected) {
      setContactName(selected.name);
      setAgencyName(selected.agency);
      setContactPhone(selected.phone);
      setContactWhatsapp(selected.whatsapp);
      setContactEmail(selected.email);
      setIsAgentVerified(selected.verified);
      setSellerType('Agent');
      addToast(`Assigned to ${selected.name} (${selected.agency})`, 'info');
    }
  };

  // Switch to direct owner
  const handleSetDirectOwner = () => {
    setSellerType('Owner');
    setAgencyName('Direct Owner / Private Sale');
    setIsAgentVerified(true);
  };

  // Calculate live area conversions
  const sqFtValue = convertToSqFt(areaValue, areaUnit);
  const marlaEquiv = (sqFtValue / 225).toFixed(1);
  const kanalEquiv = (sqFtValue / 4500).toFixed(2);
  const sqYdEquiv = (sqFtValue / 9).toFixed(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (price <= 0) {
      addToast('Please enter a valid property price in PKR.', 'error');
      setActiveTab('price');
      return;
    }

    if (areaValue <= 0) {
      addToast('Please specify a positive land / plot area value.', 'error');
      setActiveTab('land');
      return;
    }

    if (!contactName.trim() || !contactPhone.trim()) {
      addToast('Please provide owner/agent name and contact phone number.', 'error');
      setActiveTab('contact');
      return;
    }

    setIsSubmitting(true);

    const updatedAgentData = {
      ...property.agent,
      name: contactName.trim(),
      agency: agencyName.trim() || (sellerType === 'Owner' ? 'Direct Owner' : 'Private Agency'),
      phone: contactPhone.trim(),
      whatsapp: contactWhatsapp.trim() || contactPhone.trim(),
      email: contactEmail.trim() || property.agent.email,
      verified: isAgentVerified,
    };

    const isLand =
      developmentType === 'Private Land' ||
      ['Agricultural Land', 'Private Land', 'Farmhouse Land', 'Residential Plot', 'Commercial Plot'].includes(
        property.type
      ) ||
      mouzaName ||
      khasraNumber;

    const updatedLandDetails: LandDetails | undefined = isLand
      ? {
          ...property.landDetails,
          mouzaName: mouzaName.trim() || undefined,
          khasraNumber: khasraNumber.trim() || undefined,
          titleType: titleType as any,
          possessionStatus: possessionStatus as any,
          roadFrontageFt: roadFrontageFt ? Number(roadFrontageFt) : undefined,
          roadWidthFt: roadWidthFt ? Number(roadWidthFt) : undefined,
          roadAccessType: roadAccessType as any,
          waterSource: waterSource as any,
          electricityStatus: electricityStatus as any,
        }
      : property.landDetails;

    const updates: Partial<Property> = {
      price,
      purpose,
      priceNegotiable,
      areaValue,
      areaUnit,
      coveredAreaSqFt: coveredAreaSqFt ? Number(coveredAreaSqFt) : undefined,
      location: locationStr.trim() || property.location,
      developmentType,
      developmentName: developmentName.trim() || undefined,
      landDetails: updatedLandDetails,
      sellerType,
      agent: updatedAgentData,
      updateNote: updateNote.trim() || undefined,
    };

    updateProperty(
      property.id,
      updates,
      `Property ${property.id} updated: Price, Land, Sector/Town & Contact saved successfully!`
    );

    setIsSubmitting(false);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  Ref: {property.id}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {property.status === 'approved' ? 'Approved & Live' : property.status.toUpperCase()}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                Edit Price, Land, or Owner / Agent Details
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Notice */}
        <div className="bg-emerald-50/90 border-b border-emerald-200/60 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium">
              Changes update immediately across marketplace search cards, details view, and WhatsApp routing.
            </span>
          </div>
          {property.updatedAt && (
            <span className="text-[10px] text-emerald-700 hidden sm:inline font-mono">
              Last edit: {new Date(property.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('price')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'price'
                ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            <span>1. Price & Terms</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('land')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'land'
                ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>2. Land & Area</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>3. Owner / Agent Contact</span>
          </button>
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[68vh] overflow-y-auto">
          {/* TAB 1: PRICE & TERMS */}
          {activeTab === 'price' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Property Summary Pill */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{property.title}</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    {property.location}, {property.city} · {property.type}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                  Current: {formatPKR(property.price)}
                </span>
              </div>

              {/* Purpose Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Property Purpose
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPurpose('buy')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      purpose === 'buy'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    For Sale (Demanded Total Price)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('rent')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      purpose === 'rent'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    For Rent (Monthly Rental Rate)
                  </button>
                </div>
              </div>

              {/* Price Input & Conversions */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Demanded Price in PKR *
                  </label>
                  <span className="text-xs font-extrabold text-emerald-800 font-mono">
                    {formatPKR(price)} {purpose === 'rent' ? '/ mo' : ''}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    PKR
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="e.g. 18500000"
                    required
                    className="w-full pl-14 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                  />
                </div>

                {/* Words Notation */}
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                  <span>In words: <strong className="text-slate-800 font-mono">{formatFullPKR(price)}</strong></span>
                  {areaValue > 0 && (
                    <span className="text-[11px] text-slate-500">
                      ≈ {formatPKR(Math.round(price / areaValue))} per {areaUnit}
                    </span>
                  )}
                </div>

                {/* Quick adjustment step buttons */}
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    Quick Price Adjustments:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustPrice(-500000)}
                      className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      - 5 Lakh
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustPrice(+500000)}
                      className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      + 5 Lakh
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustPrice(-1000000)}
                      className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      - 10 Lakh (1 Million)
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustPrice(+1000000)}
                      className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      + 10 Lakh
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustPrice(-5000000)}
                      className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      - 50 Lakh
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustPrice(+10000000)}
                      className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      + 1 Crore
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Terms: Negotiable Checkbox */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">
                    Price Negotiability
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Indicate if seller is open to reasonable negotiations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPriceNegotiable(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      priceNegotiable
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Negotiable
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceNegotiable(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      !priceNegotiable
                        ? 'bg-slate-900 border-slate-900 text-white font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Fixed Price
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LAND & AREA */}
          {activeTab === 'land' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">Plot & Land Size Configuration</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Update plot dimensions, registry measurement, or covered area.
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                  Current: {property.areaValue} {property.areaUnit}
                </span>
              </div>

              {/* Land Area Input and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Land / Plot Size Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={areaValue || ''}
                    onChange={(e) => setAreaValue(Number(e.target.value))}
                    placeholder="e.g. 5, 10, 1"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Measurement Unit *
                  </label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Marla">Marla (Standard 225 Sq. Ft)</option>
                    <option value="Kanal">Kanal (20 Marlas = 4,500 Sq. Ft)</option>
                    <option value="Sq. Yd">Square Yards (Guz)</option>
                    <option value="Sq. Ft">Square Feet</option>
                  </select>
                </div>
              </div>

              {/* Live Pakistani Land Unit Converter Matrix */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-950">
                <div className="flex items-center gap-1.5 font-bold mb-2 text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Calculated Pakistani Area Equivalents:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-slate-500 block uppercase">Marla</span>
                    <span className="font-extrabold text-slate-900 font-mono text-sm">{marlaEquiv}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-slate-500 block uppercase">Kanal</span>
                    <span className="font-extrabold text-slate-900 font-mono text-sm">{kanalEquiv}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-slate-500 block uppercase">Sq. Yards</span>
                    <span className="font-extrabold text-slate-900 font-mono text-sm">{sqYdEquiv}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-slate-500 block uppercase">Sq. Feet</span>
                    <span className="font-extrabold text-emerald-700 font-mono text-sm">
                      {sqFtValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Covered Area (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Covered Construction Area (Sq. Ft) — Optional
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={coveredAreaSqFt || ''}
                    onChange={(e) => setCoveredAreaSqFt(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 2400 (for constructed houses/offices)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    Sq. Ft
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Relevant for houses, commercial plazas, apartments, and offices. Leave blank for vacant plots.
                </span>
              </div>

              {/* Development Classification & Custom Sector/Town/Society/Private Land */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Development Classification & Location
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    City: {property.city} ({property.province})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'Sector' as DevelopmentType, label: 'Sector', icon: Landmark },
                    { id: 'Society' as DevelopmentType, label: 'Society', icon: Building },
                    { id: 'Town' as DevelopmentType, label: 'Town', icon: Compass },
                    { id: 'Private Land' as DevelopmentType, label: 'Private Land', icon: Trees },
                    { id: 'General Area' as DevelopmentType, label: 'General Area', icon: MapPin },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = developmentType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDevelopmentType(item.id)}
                        className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {developmentType} Name (e.g. Sector, Society, Town or Mouza)
                    </label>
                    <input
                      type="text"
                      value={developmentName}
                      onChange={(e) => setDevelopmentName(e.target.value)}
                      placeholder={`e.g. Sector B-17, Model Town Block B, Bahria Town, or Mouza Chakri`}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Full Address / Street / Location String
                    </label>
                    <input
                      type="text"
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                      placeholder="e.g. Sector F-7/2, Street 34, Islamabad"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Patwar Revenue & Private Land Specifications (if Private Land or Plot/Land) */}
              {(developmentType === 'Private Land' ||
                ['Agricultural Land', 'Private Land', 'Farmhouse Land', 'Residential Plot', 'Commercial Plot'].includes(
                  property.type
                ) ||
                mouzaName ||
                khasraNumber) && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/70">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                      <Trees className="w-3.5 h-3.5 text-amber-800" />
                      <span>Private Land & Patwar Legal Records</span>
                    </div>
                    <span className="text-[10px] text-amber-900 font-semibold">Revenue Record Verification</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Legal Title / Deed
                      </label>
                      <select
                        value={titleType}
                        onChange={(e) => setTitleType(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                      >
                        {LAND_TITLE_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Physical Possession Status
                      </label>
                      <select
                        value={possessionStatus}
                        onChange={(e) => setPossessionStatus(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                      >
                        {LAND_POSSESSION_OPTIONS.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Mouza / Revenue Estate Name
                      </label>
                      <input
                        type="text"
                        value={mouzaName}
                        onChange={(e) => setMouzaName(e.target.value)}
                        placeholder="e.g. Mouza Shah Allah Ditta"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Khasra / Khatooni #
                      </label>
                      <input
                        type="text"
                        value={khasraNumber}
                        onChange={(e) => setKhasraNumber(e.target.value)}
                        placeholder="e.g. Khasra # 412/1, Khewat # 58"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Road Frontage (Feet)
                      </label>
                      <input
                        type="number"
                        value={roadFrontageFt}
                        onChange={(e) => setRoadFrontageFt(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 150 ft Frontage"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Water & Tube Well
                      </label>
                      <select
                        value={waterSource}
                        onChange={(e) => setWaterSource(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                      >
                        {LAND_WATER_OPTIONS.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OWNER OR AGENT */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Seller Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Property Listed By
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSellerType('Agent');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      sellerType === 'Agent'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Real Estate Agent</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSetDirectOwner}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      sellerType === 'Owner'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Direct Owner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSellerType('Builder')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      sellerType === 'Builder'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Builder / Developer</span>
                  </button>
                </div>
              </div>

              {/* Fast Preset Agent Selector */}
              {sellerType === 'Agent' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      Quick Assign Verified Partner Agent:
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Auto-populates credentials
                    </span>
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleSelectPresetAgent(e.target.value);
                    }}
                    defaultValue=""
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="" disabled>
                      Choose from registered PropertyMarkaz agents...
                    </option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} — {ag.agency} ({ag.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Contact Name & Agency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Malik Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Agency or Organization Name
                  </label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. Margalla Prime Estates or Direct Owner"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Calling Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      WhatsApp Number *
                    </label>
                    <button
                      type="button"
                      onClick={() => setContactWhatsapp(contactPhone)}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                    >
                      Same as phone
                    </button>
                  </div>
                  <div className="relative">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={contactWhatsapp}
                      onChange={(e) => setContactWhatsapp(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Verified Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="agent@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-4 sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isAgentVerified}
                      onChange={(e) => setIsAgentVerified(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex items-center gap-1 text-emerald-800 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Display Verified Badge on Listing</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Optional Update Note / Change Log */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Revision Reason / Internal Audit Note (Optional)
            </label>
            <input
              type="text"
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              placeholder="e.g. Price reduced by owner for quick sale / Land re-measured per fard"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <History className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Status will remain <strong>Approved</strong> with instant update.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 sm:flex-initial px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <span>Save Approved Listing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
