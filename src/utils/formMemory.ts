export interface RememberedContactDetails {
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  sellerType?: 'Owner' | 'Agent' | 'Builder';
  agencyName?: string;
}

const CONTACT_MEMORY_KEY = 'propertymarkaz_remembered_contact_v1';

export const FORM_STORAGE_KEYS = {
  ADD_PROPERTY_DRAFT: 'propertymarkaz_add_property_draft_v1',
  CONTACT_PAGE_DRAFT: 'propertymarkaz_contact_draft_v1',
  INQUIRY_DRAFTS: 'propertymarkaz_inquiry_drafts_v1',
  AUTH_FORM_MEMORY: 'propertymarkaz_auth_form_v1',
  HERO_SEARCH_MEMORY: 'propertymarkaz_hero_search_v1',
  EDIT_PROPERTY_DRAFTS: 'propertymarkaz_edit_property_drafts_v1',
} as const;

export function readStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStoredJson<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStoredKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

export function getRememberedContact(): RememberedContactDetails {
  return readStoredJson<RememberedContactDetails>(CONTACT_MEMORY_KEY, {});
}

export function saveRememberedContact(partial: Partial<RememberedContactDetails>): void {
  const existing = getRememberedContact();
  const next: RememberedContactDetails = { ...existing };

  (Object.keys(partial) as Array<keyof RememberedContactDetails>).forEach((k) => {
    const val = partial[k];
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed) {
        (next as Record<string, unknown>)[k] = trimmed;
      }
    } else if (val !== undefined) {
      (next as Record<string, unknown>)[k] = val;
    }
  });

  writeStoredJson(CONTACT_MEMORY_KEY, next);
}
