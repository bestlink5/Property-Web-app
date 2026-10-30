import { Province, DevelopmentType } from '../types/property';

export interface CityData {
  name: string;
  province: Province;
  popularAreas: string[];
  isMajorHub: boolean;
  sectors: string[];
  societies: string[];
  towns: string[];
  privateLands: string[];
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

export const DEVELOPMENT_TYPES: DevelopmentType[] = [
  'Sector',
  'Society',
  'Town',
  'Private Land',
  'General Area',
];

export const PAKISTAN_CITIES: CityData[] = [
  {
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    isMajorHub: true,
    sectors: [
      'Sector F-6',
      'Sector F-7',
      'Sector F-8',
      'Sector F-10',
      'Sector F-11',
      'Sector E-7',
      'Sector E-11',
      'Sector G-10',
      'Sector G-11',
      'Sector G-13',
      'Sector G-14',
      'Sector B-17 (Multi Gardens)',
      'Sector D-12',
      'Sector I-8',
      'Sector I-9',
      'Sector H-13',
    ],
    societies: [
      'DHA Phase 2',
      'DHA Phase 3',
      'DHA Phase 5',
      'Gulberg Greens',
      'Bahria Enclave',
      'Park View City',
      'Capital Smart City',
      'Top City-1',
      'Faisal Hills',
      'Eighteen Islamabad',
    ],
    towns: [
      'Rawal Town',
      'Soan Town',
      'Shehzad Town',
      'Korang Town',
      'Margalla Town',
      'National Police Foundation',
    ],
    privateLands: [
      'Mouza Shah Allah Ditta',
      'Mouza Koral',
      'Mouza Tarlai Kalan',
      'Mouza Sihala (Kahuta Road)',
      'Mouza Bhara Kahu',
      'Mouza Phulgran (Simly Dam Road)',
      'Mouza Malot (Near Park Road)',
      'Mouza Jagiot',
    ],
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
      'Mouza Shah Allah Ditta',
      'Blue Area',
    ],
  },
  {
    name: 'Rawalpindi',
    province: 'Punjab',
    isMajorHub: true,
    sectors: [
      'Chaklala Scheme 3',
      'Askari 14',
      'Askari 11',
      'Rawalpindi Cantt Sector',
      'Peshawar Road Sector',
      'Westridge 1 & 2',
    ],
    societies: [
      'Bahria Town (Phases 1-8)',
      'Bahria Town Phase 8 Extension',
      'DHA Phase 1',
      'DHA Phase 4',
      'Airport Housing Society',
      'Fauji Foundation Scheme',
      'Gulshan-e-Abad',
    ],
    towns: [
      'Satellite Town',
      'Rawal Town',
      'Gulraiz Housing Town',
      'Wapda Town Rawalpindi',
      'Judicial Town',
      'Adyala Road Towns',
    ],
    privateLands: [
      'Mouza Chakri Road',
      'Mouza Adyala (Private Farmhouse Belt)',
      'Mouza Gorakhpur',
      'Mouza Dhamial',
      'Mouza Kahuta Road Belt',
      'Mouza Ranial',
      'Mouza Misriot Dam Belt',
    ],
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
      'Mouza Chakri Road',
    ],
  },
  {
    name: 'Mirpur AJK',
    province: 'Azad Jammu & Kashmir',
    isMajorHub: true,
    sectors: [
      'Sector F-1',
      'Sector F-2',
      'Sector F-3',
      'Sector B-3',
      'Sector C-4',
      'Sector D-4',
    ],
    societies: [
      'Housing Scheme No. 1',
      'Mangla View Resort',
      'Overseas Green City Mirpur',
      'Kashmir Model Town Society',
    ],
    towns: [
      'New Mirpur City',
      'Kalyal Town',
      'Allama Iqbal Road Colony',
      'Chowk Shaheedan',
      'Nangi Town',
    ],
    privateLands: [
      'Mouza Afzalpur',
      'Mouza Chechian',
      'Mouza Jatlan Road',
      'Mouza Khari Sharif Belt',
      'Mouza Panyam Lake Belt',
      'Mouza Sangot',
    ],
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
      'Mouza Afzalpur',
    ],
  },
  {
    name: 'Lahore',
    province: 'Punjab',
    isMajorHub: true,
    sectors: [
      'DHA Phase 5 & 6',
      'DHA Phase 7 & 8',
      'DHA Phase 9 Prism',
      'Lahore Cantt Sector',
      'Gulberg Industrial & Commercial Sector',
    ],
    societies: [
      'Bahria Town Lahore',
      'Lake City Lahore',
      'State Life Housing Society',
      'Fazaia Housing Scheme',
      'Pak Arab Housing Society',
      'Central Park Housing Scheme',
      'Sui Gas Housing Society',
    ],
    towns: [
      'Model Town',
      'Johar Town Phase 1 & 2',
      'Gulberg II & III',
      'Wapda Town',
      'Valencia Town',
      'Allama Iqbal Town',
      'Faisal Town',
      'Garden Town',
    ],
    privateLands: [
      'Mouza Bedian Road (Farmhouse Belt)',
      'Mouza Barki Road',
      'Mouza Raiwind Road Belt',
      'Mouza Multan Road Bypass',
      'Mouza Ferozepur Road Belt',
      'Mouza Manga Mandi',
    ],
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
      'Mouza Bedian Road',
    ],
  },
  {
    name: 'Karachi',
    province: 'Sindh',
    isMajorHub: true,
    sectors: [
      'KDA Scheme 1',
      'KDA Scheme 33',
      'North Karachi Sector 11-A',
      'Orangi Town Sectors',
      'Surjani Town Sectors',
    ],
    societies: [
      'DHA Phase 5, 6 & 8',
      'Bahria Town Karachi',
      'PECHS Block 2 & 6',
      'Malir Cantt',
      'Falaknaz Dreams',
      'Gulshan-e-Maymar',
      'Naval Housing Scheme',
    ],
    towns: [
      'North Nazimabad Town',
      'Gulshan-e-Iqbal Town',
      'Clifton Town',
      'Jamshed Town',
      'Gulberg Town Karachi',
      'Saddar Town',
      'Malir Town',
    ],
    privateLands: [
      'Mouza Gadap (Farmhouse Belt)',
      'Super Highway Mouza Deh Malh',
      'Hub River Road Private Land',
      'Malir River Green Belt Land',
      'Northern Bypass Private Land',
    ],
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
      'Mouza Gadap',
    ],
  },
  {
    name: 'Faisalabad',
    province: 'Punjab',
    isMajorHub: true,
    sectors: [
      'FDA City Sector A & B',
      'Peoples Colony No. 1',
      'Civil Lines Sector',
    ],
    societies: [
      'Kohinoor City',
      'Wapda City Faisalabad',
      'Eden Gardens Faisalabad',
      'Sitara Diamond City',
    ],
    towns: [
      'Madina Town',
      'Susan Road Area',
      'Gulberg Town Faisalabad',
      'Jinnah Town',
    ],
    privateLands: [
      'Mouza Canal Road Agricultural Land',
      'Mouza Jaranwala Road Belt',
      'Mouza Sargodha Road Belt',
      'Mouza Samundri Road Private Land',
    ],
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
    sectors: [
      'Hayatabad Phase 1-7',
      'DHA Peshawar Sectors A-G',
      'Cantt Sector Peshawar',
    ],
    societies: [
      'DHA Peshawar',
      'Regi Model Town (Phases 1-4)',
      'Peshawar Enclave',
      'PAF Housing Scheme',
    ],
    towns: [
      'University Town',
      'Gulbahar Town',
      'Hayatabad Town',
      'Kohat Road Towns',
    ],
    privateLands: [
      'Mouza Warsak Road Belt',
      'Mouza Charsadda Road Agriculture Belt',
      'Mouza Ring Road Private Land',
      'Mouza Nasir Bagh',
    ],
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
    sectors: [
      'Quetta Cantt Sector',
      'Chiltan Housing Sector',
    ],
    societies: [
      'DHA Quetta',
      'Zarghoon Housing Scheme',
      'Al-Hamd Housing Scheme',
    ],
    towns: [
      'Jinnah Town',
      'Shahbaz Town',
      'Satellite Town Quetta',
      'Model Town Quetta',
    ],
    privateLands: [
      'Mouza Samungli Orchard Land',
      'Mouza Airport Road Belt',
      'Mouza Kuchlak Agricultural Land',
      'Mouza Hanna Urak Valley Private Land',
    ],
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
    sectors: [
      'Jutial Cantt Sector',
      'River View Sector',
    ],
    societies: [
      'Green City Gilgit',
      'Karakoram Housing Scheme',
    ],
    towns: [
      'Danyore Town',
      'Jutial Colony',
      'Amphary Town',
      'Zulfiqarabad',
    ],
    privateLands: [
      'Mouza Nomal Valley Orchard Land',
      'Mouza Bagrot Valley Agriculture Land',
      'Mouza Airport Road Gilgit Belt',
      'Mouza Basin Private Land',
    ],
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
  'Private Land',
  'Farmhouse Land',
  'Penthouse',
] as const;

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
export const BATHROOM_OPTIONS = [1, 2, 3, 4, 5, 6];

// Private Land and Patwar Revenue Options
export const LAND_TITLE_OPTIONS = [
  'Registry & Inteqal',
  'Fard Malkiat',
  'Allotment File',
  'Power of Attorney',
  'Shamlat Deh',
  'Other Legal Deed',
] as const;

export const LAND_POSSESSION_OPTIONS = [
  'Immediate Physical Possession',
  'Demarcated with Boundary Pillars',
  'Boundary Wall Constructed',
  'Open / Undemarcated',
] as const;

export const ROAD_ACCESS_OPTIONS = [
  'Main Highway / Carpet Road',
  'Link Road (Paved)',
  'Soling Road',
  'Pagdandi / Kacha Rasta',
] as const;

export const LAND_WATER_OPTIONS = [
  'Tube Well Installed',
  'Sweet Ground Boring',
  'Canal Water (Nehari Paani)',
  'Municipal Line',
  'None',
] as const;

export const LAND_ELECTRICITY_OPTIONS = [
  'Transformer Installed / 3-Phase',
  'Single Phase Available',
  'Nearby Pole',
  'Off-Grid / Solar Needed',
] as const;

export const LAND_CLASSIFICATION_OPTIONS = [
  'Agricultural',
  'Farmhouse / Orchard',
  'Commercial Belt',
  'Residential Sub-division',
  'Industrial',
  'Raw Land',
] as const;

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
