export type PropertyPurpose = 'buy' | 'rent';

export type PropertyType =
  | 'House'
  | 'Apartment'
  | 'Residential Plot'
  | 'Commercial Plot'
  | 'Shop'
  | 'Office'
  | 'Agricultural Land'
  | 'Private Land'
  | 'Farmhouse Land'
  | 'Penthouse';

export type DevelopmentType = 'Sector' | 'Society' | 'Town' | 'Private Land' | 'General Area';

export interface LandDetails {
  landClassification?: 'Agricultural' | 'Residential Sub-division' | 'Commercial Belt' | 'Farmhouse / Orchard' | 'Industrial' | 'Raw Land';
  mouzaName?: string; // e.g. Mouza Shah Allah Ditta, Mouza Sihala, Mouza Chakri
  khasraNumber?: string; // e.g. Khasra # 412/1, Khatooni # 88
  titleType?: 'Registry & Inteqal' | 'Fard Malkiat' | 'Allotment File' | 'Power of Attorney' | 'Shamlat Deh' | 'Other Legal Deed';
  possessionStatus?: 'Immediate Physical Possession' | 'Demarcated with Boundary Pillars' | 'Boundary Wall Constructed' | 'Open / Undemarcated';
  roadFrontageFt?: number; // e.g. 150 ft
  roadAccessType?: 'Main Highway / Carpet Road' | 'Link Road (Paved)' | 'Soling Road' | 'Pagdandi / Kacha Rasta';
  roadWidthFt?: number; // e.g. 40, 60, 100 ft
  waterSource?: 'Tube Well Installed' | 'Sweet Ground Boring' | 'Canal Water (Nehari Paani)' | 'Municipal Line' | 'None';
  electricityStatus?: 'Transformer Installed / 3-Phase' | 'Single Phase Available' | 'Nearby Pole' | 'Off-Grid / Solar Needed';
}

export type AreaUnit = 'Marla' | 'Kanal' | 'Sq. Yd' | 'Sq. Ft';

export type Province =
  | 'Islamabad Capital Territory'
  | 'Punjab'
  | 'Sindh'
  | 'Khyber Pakhtunkhwa'
  | 'Balochistan'
  | 'Azad Jammu & Kashmir'
  | 'Gilgit-Baltistan';

export type PropertyStatus = 'approved' | 'pending' | 'rejected';

export interface Agent {
  id: string;
  name: string;
  agency: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  activeListingsCount: number;
  bio: string;
  languages: string[];
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number; // in PKR
  purpose: PropertyPurpose;
  type: PropertyType;
  province: Province;
  city: string;
  location: string; // Specific address / Sector / Phase
  developmentType?: DevelopmentType;
  developmentName?: string; // e.g. "Sector B-17", "Bahria Town Phase 8", "Model Town", "Mouza Shah Allah Ditta"
  isCustomLocation?: boolean;
  landDetails?: LandDetails;
  areaValue: number;
  areaUnit: AreaUnit;
  coveredAreaSqFt?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  yearBuilt?: number;
  furnishing?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  features: string[];
  images: string[];
  floorPlanUrl?: string;
  agent: Agent;
  status: PropertyStatus;
  rejectionReason?: string;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
  updateNote?: string;
  priceNegotiable?: boolean;
  viewsCount: number;
  isDemo: boolean;
  sellerType: 'Owner' | 'Agent' | 'Builder';
}

export interface PropertyFilterState {
  purpose: PropertyPurpose | 'all';
  city: string;
  area: string;
  type: string;
  developmentType: 'all' | DevelopmentType;
  developmentName: string;
  minPrice: number | null;
  maxPrice: number | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
  minArea: number | null;
  maxArea: number | null;
  areaUnit: AreaUnit;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'date-newest' | 'area-desc';
  searchQuery: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
  agencyName?: string;
  city?: string;
  savedPropertyIds: string[];
  avatar?: string;
}
