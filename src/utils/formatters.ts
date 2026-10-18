import { AreaUnit } from '../types/property';

/**
 * Formats a PKR currency value into Pakistani terms (Crore, Lakh, Thousand) or full format.
 * Examples:
 * 25,000,000 -> "PKR 2.5 Crore"
 * 7,500,000 -> "PKR 75 Lakh"
 * 85,000 -> "PKR 85,000"
 */
export function formatPKR(amount: number, compact: boolean = true): string {
  if (isNaN(amount) || amount === 0) return 'PKR 0';

  if (!compact) {
    return `PKR ${amount.toLocaleString('en-PK')}`;
  }

  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    // 1 Crore = 10,000,000
    const crore = amount / 10000000;
    const formatted = crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2).replace(/\.?0+$/, '');
    return `PKR ${formatted} Crore`;
  }

  if (absAmount >= 100000) {
    // 1 Lakh = 100,000
    const lakh = amount / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2).replace(/\.?0+$/, '');
    return `PKR ${formatted} Lakh`;
  }

  if (absAmount >= 1000) {
    // Thousand
    return `PKR ${amount.toLocaleString('en-PK')}`;
  }

  return `PKR ${amount}`;
}

/**
 * Returns secondary detailed notation for price tooltip or subtitle
 */
export function formatFullPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

/**
 * Converts area from one unit to Square Feet
 */
export function convertToSqFt(value: number, unit: AreaUnit): number {
  switch (unit) {
    case 'Marla':
      return value * 225; // Standard 225 sq ft Marla
    case 'Kanal':
      return value * 4500; // 20 Marlas = 4500 sq ft
    case 'Sq. Yd':
      return value * 9;
    case 'Sq. Ft':
    default:
      return value;
  }
}

/**
 * Converts square feet into target unit
 */
export function convertFromSqFt(sqFt: number, targetUnit: AreaUnit): number {
  switch (targetUnit) {
    case 'Marla':
      return sqFt / 225;
    case 'Kanal':
      return sqFt / 4500;
    case 'Sq. Yd':
      return sqFt / 9;
    case 'Sq. Ft':
    default:
      return sqFt;
  }
}

/**
 * Formats property area with smart conversions
 */
export function formatArea(value: number, unit: AreaUnit): string {
  const formattedVal = value % 1 === 0 ? value.toString() : value.toFixed(1);
  return `${formattedVal} ${unit}`;
}

/**
 * Generates direct WhatsApp click-to-chat URL with pre-filled message
 */
export function getWhatsAppUrl(phone: string, propertyTitle: string, propertyId: string): string {
  // Clean phone number to digits only, remove leading zero and prepend 92 if needed
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.substring(1);
  } else if (!cleaned.startsWith('92')) {
    cleaned = '92' + cleaned;
  }

  const message = encodeURIComponent(
    `Assalam-o-Alaikum, I am inquiring about this property on PropertyMarkaz: "${propertyTitle}" (Ref ID: ${propertyId}). Is it still available? Please share details.`
  );
  return `https://wa.me/${cleaned}?text=${message}`;
}

/**
 * Generates tel: call link
 */
export function getTelUrl(phone: string): string {
  return `tel:${phone.replace(/\s+/g, '')}`;
}
