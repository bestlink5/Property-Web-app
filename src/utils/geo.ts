import { GeofenceFilter, LatLng, Property } from '../types/property';

export const PAKISTAN_CITY_COORDS: Record<string, { lat: number; lng: number; zoom: number }> = {
  Islamabad: { lat: 33.6844, lng: 73.0479, zoom: 12 },
  Rawalpindi: { lat: 33.5651, lng: 73.0169, zoom: 12 },
  'Mirpur AJK': { lat: 33.148, lng: 73.7518, zoom: 13 },
  Lahore: { lat: 31.5204, lng: 74.3587, zoom: 12 },
  Karachi: { lat: 24.8607, lng: 67.0011, zoom: 12 },
  Faisalabad: { lat: 31.4504, lng: 73.135, zoom: 12 },
  Peshawar: { lat: 34.0151, lng: 71.5249, zoom: 12 },
  Quetta: { lat: 30.1798, lng: 66.975, zoom: 12 },
  Gilgit: { lat: 35.9208, lng: 74.3144, zoom: 13 },
};

const LOCALITY_COORDS: Array<{ city?: string; keywords: string[]; coords: LatLng }> = [
  // Islamabad
  { city: 'Islamabad', keywords: ['f-7', 'sector f-7'], coords: { lat: 33.7215, lng: 73.0561 } },
  { city: 'Islamabad', keywords: ['f-6', 'sector f-6'], coords: { lat: 33.7297, lng: 73.0746 } },
  { city: 'Islamabad', keywords: ['f-8', 'sector f-8'], coords: { lat: 33.7089, lng: 73.0389 } },
  { city: 'Islamabad', keywords: ['f-10', 'sector f-10'], coords: { lat: 33.6946, lng: 73.0119 } },
  { city: 'Islamabad', keywords: ['f-11', 'sector f-11'], coords: { lat: 33.6841, lng: 72.9896 } },
  { city: 'Islamabad', keywords: ['e-7', 'sector e-7'], coords: { lat: 33.7332, lng: 73.0478 } },
  { city: 'Islamabad', keywords: ['e-11', 'sector e-11'], coords: { lat: 33.6994, lng: 72.9739 } },
  { city: 'Islamabad', keywords: ['b-17', 'multi gardens'], coords: { lat: 33.6865, lng: 72.8152 } },
  { city: 'Islamabad', keywords: ['blue area', 'jinnah avenue'], coords: { lat: 33.7077, lng: 73.0501 } },
  { city: 'Islamabad', keywords: ['gulberg greens'], coords: { lat: 33.6114, lng: 73.1494 } },
  { city: 'Islamabad', keywords: ['bahria enclave'], coords: { lat: 33.6928, lng: 73.2044 } },
  { city: 'Islamabad', keywords: ['park view city'], coords: { lat: 33.7088, lng: 73.1883 } },
  { city: 'Islamabad', keywords: ['shah allah ditta'], coords: { lat: 33.7267, lng: 72.9272 } },
  // Rawalpindi
  { city: 'Rawalpindi', keywords: ['bahria town phase 7'], coords: { lat: 33.5025, lng: 73.0951 } },
  { city: 'Rawalpindi', keywords: ['bahria town phase 8'], coords: { lat: 33.4832, lng: 73.0906 } },
  { city: 'Rawalpindi', keywords: ['bahria town'], coords: { lat: 33.5194, lng: 73.1128 } },
  { city: 'Rawalpindi', keywords: ['chakri', 'mouza chakri'], coords: { lat: 33.541, lng: 72.989 } },
  { city: 'Rawalpindi', keywords: ['chaklala'], coords: { lat: 33.5881, lng: 73.0928 } },
  // Mirpur AJK
  { city: 'Mirpur AJK', keywords: ['sector f-1'], coords: { lat: 33.1484, lng: 73.7518 } },
  { city: 'Mirpur AJK', keywords: ['sector f-2'], coords: { lat: 33.1419, lng: 73.7452 } },
  { city: 'Mirpur AJK', keywords: ['sector f-3'], coords: { lat: 33.1535, lng: 73.739 } },
  { city: 'Mirpur AJK', keywords: ['sector b-3'], coords: { lat: 33.1365, lng: 73.7705 } },
  { city: 'Mirpur AJK', keywords: ['new mirpur'], coords: { lat: 33.1502, lng: 73.7621 } },
  { city: 'Mirpur AJK', keywords: ['afzalpur'], coords: { lat: 33.1684, lng: 73.7198 } },
  // Lahore
  { city: 'Lahore', keywords: ['dha phase 6'], coords: { lat: 31.4697, lng: 74.4555 } },
  { city: 'Lahore', keywords: ['dha phase 5'], coords: { lat: 31.4614, lng: 74.4095 } },
  { city: 'Lahore', keywords: ['model town'], coords: { lat: 31.4839, lng: 74.3247 } },
  { city: 'Lahore', keywords: ['gulberg'], coords: { lat: 31.5117, lng: 74.3497 } },
  { city: 'Lahore', keywords: ['johar town'], coords: { lat: 31.4697, lng: 74.2728 } },
  { city: 'Lahore', keywords: ['bahria town'], coords: { lat: 31.3679, lng: 74.181 } },
  // Karachi
  { city: 'Karachi', keywords: ['clifton'], coords: { lat: 24.8138, lng: 67.0299 } },
  { city: 'Karachi', keywords: ['dha phase 5', 'dha karachi'], coords: { lat: 24.8007, lng: 67.0575 } },
  { city: 'Karachi', keywords: ['pechs'], coords: { lat: 24.8719, lng: 67.0596 } },
  { city: 'Karachi', keywords: ['gulshan-e-iqbal'], coords: { lat: 24.9204, lng: 67.0942 } },
  // Other hubs
  { city: 'Faisalabad', keywords: ['kohinoor city'], coords: { lat: 31.4114, lng: 73.1128 } },
  { city: 'Peshawar', keywords: ['hayatabad'], coords: { lat: 33.9781, lng: 71.4347 } },
  { city: 'Quetta', keywords: ['samungli'], coords: { lat: 30.2095, lng: 66.9812 } },
  { city: 'Gilgit', keywords: ['jutial'], coords: { lat: 35.9082, lng: 74.3426 } },
];

function deterministicOffset(seed: string): { dLat: number; dLng: number } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const latFactor = ((hash & 0xff) / 255 - 0.5) * 0.018;
  const lngFactor = (((hash >> 8) & 0xff) / 255 - 0.5) * 0.022;
  return { dLat: latFactor, dLng: lngFactor };
}

export function getPropertyCoordinates(property: Property): LatLng {
  if (
    property.coordinates &&
    typeof property.coordinates.lat === 'number' &&
    typeof property.coordinates.lng === 'number'
  ) {
    return property.coordinates;
  }

  const haystack = `${property.location} ${property.developmentName || ''} ${property.city}`.toLowerCase();
  const cityLower = property.city.toLowerCase();
  const { dLat, dLng } = deterministicOffset(property.id);

  for (const entry of LOCALITY_COORDS) {
    if (entry.city && entry.city.toLowerCase() !== cityLower) {
      continue;
    }
    if (entry.keywords.some((kw) => haystack.includes(kw))) {
      return {
        lat: Number((entry.coords.lat + dLat * 0.25).toFixed(5)),
        lng: Number((entry.coords.lng + dLng * 0.25).toFixed(5)),
      };
    }
  }

  const cityCenter = PAKISTAN_CITY_COORDS[property.city] || PAKISTAN_CITY_COORDS.Islamabad;
  return {
    lat: Number((cityCenter.lat + dLat).toFixed(5)),
    lng: Number((cityCenter.lng + dLng).toFixed(5)),
  };
}

export function haversineDistanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  if (polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function isPropertyInGeofence(property: Property, geofence: GeofenceFilter | null): boolean {
  if (!geofence) return true;
  const coords = getPropertyCoordinates(property);

  if (geofence.type === 'circle') {
    return haversineDistanceKm(coords, geofence.center) <= geofence.radiusKm;
  }

  if (geofence.type === 'polygon') {
    return isPointInPolygon(coords, geofence.points);
  }

  return true;
}

export function formatCompactPricePin(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `${Math.round(amount / 1000)}K`;
  }
  return `${amount}`;
}
