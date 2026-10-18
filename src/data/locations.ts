import { Province } from '../types/property';

export interface CityData {
  name: string;
  province: Province;
  popularAreas: string[];
  isMajorHub: boolean;
}

export const PAKISTAN_PROVINCES: Province[] = [
  'Islamabad Capital Territory',
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];

export const PAKISTAN_CITIES: CityData[] = [
  {
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    isMajorHub: true,
    popularAreas: [
      'Sector F-6',
      'Sector F-7',
      'Sector F-8',
      'Sector F-10',
      'Sector F-11',
      'Sector E-11',
      'Sector G-11',
      'Sector G-13',
      'Sector B-17 (Multi Gardens)',
      'DHA Phase 2',
      'Gulberg Greens',
      'Bahria Enclave',
      'Park View City',
      'Blue Area',
    ],
  },
  {
    name: 'Rawalpindi',
    province: 'Punjab',
    isMajorHub: true,
    popularAreas: [
      'Bahria Town (Phases 1-8)',
      'DHA Phase 1',
      'DHA Phase 4',
      'Chaklala Scheme 3',
      'Saddar',
      'Askari 14',
      'Adyala Road',
      'Peshawar Road',
      'Satellite Town',
      'Airport Housing Society',
    ],
  },
  {
    name: 'Mirpur AJK',
    province: 'Azad Jammu & Kashmir',
    isMajorHub: true,
    popularAreas: [
      'Sector F-1',
      'Sector F-2',
      'Sector B-3',
      'Housing Scheme No. 1',
      'New Mirpur City',
      'Allama Iqbal Road',
      'Mangla View Resort',
      'Sector C-4',
      'Chowk Shaheedan',
      'Kalyal',
    ],
  },
  {
    name: 'Lahore',
    province: 'Punjab',
    isMajorHub: true,
    popularAreas: [
      'DHA Phase 5 & 6',
      'DHA Phase 7 & 8',
      'Gulberg II & III',
      'Bahria Town Lahore',
      'Johar Town Phase 1 & 2',
      'Model Town',
      'Lahore Cantt',
      'Lake City',
      'Wapda Town',
      'Valencia Town',
      'State Life Housing',
    ],
  },
  {
    name: 'Karachi',
    province: 'Sindh',
    isMajorHub: true,
    popularAreas: [
      'DHA Phase 5, 6 & 8',
      'Clifton Blocks 2, 4 & 5',
      'Gulshan-e-Iqbal',
      'PECHS Block 2 & 6',
      'Bahria Town Karachi',
      'North Nazimabad',
      'Malir Cantt',
      'KDA Scheme 1',
      'Civil Lines',
      'Bath Island',
    ],
  },
  {
    name: 'Faisalabad',
    province: 'Punjab',
    isMajorHub: true,
    popularAreas: [
      'Canal Road',
      'Madina Town',
      'Kohinoor City',
      'FDA City',
      'Susan Road',
      'Peoples Colony No. 1',
      'Wapda City',
    ],
  },
  {
    name: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    isMajorHub: true,
    popularAreas: [
      'Hayatabad Phase 1-7',
      'DHA Peshawar',
      'University Town',
      'Regi Model Town',
      'Warsak Road',
      'Ring Road Peshawar',
    ],
  },
  {
    name: 'Quetta',
    province: 'Balochistan',
    isMajorHub: true,
    popularAreas: [
      'Quetta Cantonment',
      'Samungli Road',
      'Zarghoon Housing Scheme',
      'Airport Road',
      'Jinnah Town',
      'Shahbaz Town',
    ],
  },
  {
    name: 'Gilgit',
    province: 'Gilgit-Baltistan',
    isMajorHub: true,
    popularAreas: [
      'Jutial Colony',
      'River View Colony',
      'Danyore',
      'Airport Road Gilgit',
      'Amphary',
      'Nomal Valley View',
    ],
  },
];

export const PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Residential Plot',
  'Commercial Plot',
  'Shop',
  'Office',
  'Agricultural Land',
  'Penthouse',
] as const;

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
export const BATHROOM_OPTIONS = [1, 2, 3, 4, 5, 6];

export const POPULAR_PRICE_RANGES_BUY = [
  { label: 'Under 1 Crore', min: 0, max: 10000000 },
  { label: '1 - 2.5 Crore', min: 10000000, max: 25000000 },
  { label: '2.5 - 5 Crore', min: 25000000, max: 50000000 },
  { label: '5 - 10 Crore', min: 50000000, max: 100000000 },
  { label: '10 Crore+', min: 100000000, max: null },
];

export const POPULAR_PRICE_RANGES_RENT = [
  { label: 'Under 50,000/mo', min: 0, max: 50000 },
  { label: '50k - 1 Lakh/mo', min: 50000, max: 100000 },
  { label: '1 - 2 Lakh/mo', min: 100000, max: 200000 },
  { label: '2 - 5 Lakh/mo', min: 200000, max: 500000 },
  { label: '5 Lakh+/mo', min: 500000, max: null },
];
