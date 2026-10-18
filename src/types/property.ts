export type PropertyPurpose = 'buy' | 'rent';

export type PropertyType =
  | 'House'
  | 'Apartment'
  | 'Residential Plot'
  | 'Commercial Plot'
  | 'Shop'
  | 'Office'
  | 'Agricultural Land'
  | 'Penthouse';

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
  viewsCount: number;
  isDemo: boolean;
  sellerType: 'Owner' | 'Agent' | 'Builder';
}

export interface PropertyFilterState {
  purpose: PropertyPurpose | 'all';
  city: string;
  area: string;
  type: string;
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
