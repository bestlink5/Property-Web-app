import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Property, PropertyFilterState, UserProfile, PropertyStatus, Agent } from '../types/property';
import { DEMO_PROPERTIES, DEMO_AGENTS } from '../data/mockProperties';
import { isPropertyInGeofence } from '../utils/geo';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

export type AppView =
  | 'home'
  | 'buy'
  | 'rent'
  | 'sell'
  | 'listings'
  | 'saved'
  | 'details'
  | 'agent'
  | 'admin'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms';

interface PropertyContextType {
  properties: Property[];
  preGeofenceProperties: Property[];
  filteredProperties: Property[];
  filters: PropertyFilterState;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilterState>>;
  updateFilter: <K extends keyof PropertyFilterState>(key: K, value: PropertyFilterState[K]) => void;
  resetFilters: () => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string) => void;
  clearSavedProperties: () => void;
  isPropertySaved: (id: string) => boolean;
  addProperty: (propertyData: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'status' | 'isDemo'>) => string;
  updateProperty: (id: string, updates: Partial<Property>, customSuccessMessage?: string) => void;
  approveProperty: (id: string) => void;
  rejectProperty: (id: string, reason: string) => void;
  deleteProperty: (id: string) => void;
  toggleFeatured: (id: string) => void;
  editingPropertyId: string | null;
  setEditingPropertyId: (id: string | null) => void;
  openEditPropertyModal: (id: string) => void;
  agents: Agent[];
  updateAgentAvatar: (agentId: string, avatarUrl: string, agentNameFallback?: string) => void;
  notifications: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  showSupabaseModal: boolean;
  setShowSupabaseModal: (show: boolean) => void;
  showApkModal: boolean;
  setShowApkModal: (show: boolean) => void;
  navigateToProperty: (id: string) => void;
  navigateToAgent: (id: string) => void;
  switchDemoRole: (role: 'guest' | 'buyer' | 'seller' | 'agent' | 'admin') => void;
}

const DEFAULT_FILTERS: PropertyFilterState = {
  purpose: 'all',
  city: '',
  area: '',
  type: '',
  developmentType: 'all',
  developmentName: '',
  minPrice: null,
  maxPrice: null,
  minBedrooms: null,
  minBathrooms: null,
  minArea: null,
  maxArea: null,
  areaUnit: 'Marla',
  sortBy: 'featured',
  searchQuery: '',
  geofence: null,
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'propertymarkaz_listings_v1';
const AGENTS_STORAGE_KEY = 'propertymarkaz_agents_v1';
const SAVED_STORAGE_KEY = 'propertymarkaz_saved_v1';
const SAVED_BY_USER_STORAGE_KEY = 'propertymarkaz_saved_by_user_v1';
const USER_STORAGE_KEY = 'propertymarkaz_user_v1';
const NAV_STATE_STORAGE_KEY = 'propertymarkaz_nav_state_v1';
const FILTERS_STORAGE_KEY = 'propertymarkaz_filters_v1';

const VALID_APP_VIEWS: readonly AppView[] = [
  'home',
  'buy',
  'rent',
  'sell',
  'listings',
  'saved',
  'details',
  'agent',
  'admin',
  'about',
  'contact',
  'faq',
  'privacy',
  'terms',
];

interface PersistedNavState {
  activeView: AppView;
  selectedPropertyId: string | null;
  selectedAgentId: string | null;
}

const isValidAppView = (value: string): value is AppView =>
  (VALID_APP_VIEWS as readonly string[]).includes(value);

const parseHashNavState = (): Partial<PersistedNavState> | null => {
  try {
    const rawHash = window.location.hash || '';
    if (!rawHash || rawHash === '#') return null;
    const cleaned = rawHash.replace(/^#\/?/, '').trim();
    if (!cleaned) {
      return { activeView: 'home', selectedPropertyId: null, selectedAgentId: null };
    }
    const [segment, param] = cleaned.split('/');
    if (segment === 'details' && param) {
      return {
        activeView: 'details',
        selectedPropertyId: decodeURIComponent(param),
      };
    }
    if (segment === 'agent' && param) {
      return {
        activeView: 'agent',
        selectedAgentId: decodeURIComponent(param),
      };
    }
    if (isValidAppView(segment)) {
      return { activeView: segment };
    }
    return null;
  } catch {
    return null;
  }
};

const buildHashFromNavState = (
  view: AppView,
  propertyId: string | null,
  agentId: string | null
): string => {
  if (view === 'details' && propertyId) {
    return `#/details/${encodeURIComponent(propertyId)}`;
  }
  if (view === 'agent' && agentId) {
    return `#/agent/${encodeURIComponent(agentId)}`;
  }
  if (view === 'home') {
    return '#/';
  }
  return `#/${view}`;
};

const readInitialNavState = (): PersistedNavState => {
  let stored: Partial<PersistedNavState> = {};
  try {
    const raw = localStorage.getItem(NAV_STATE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedNavState>;
      if (parsed && typeof parsed.activeView === 'string' && isValidAppView(parsed.activeView)) {
        stored = parsed;
      }
    }
  } catch {
    // ignore storage errors
  }

  const fromHash = parseHashNavState();
  const activeView = fromHash?.activeView ?? stored.activeView ?? 'home';
  const selectedPropertyId =
    fromHash?.selectedPropertyId !== undefined
      ? fromHash.selectedPropertyId
      : stored.selectedPropertyId ?? null;
  const selectedAgentId =
    fromHash?.selectedAgentId !== undefined
      ? fromHash.selectedAgentId
      : stored.selectedAgentId ?? null;

  return {
    activeView,
    selectedPropertyId,
    selectedAgentId,
  };
};

const getUserSavedKey = (user: UserProfile): string =>
  (user.email ? user.email.trim().toLowerCase() : user.id);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return DEMO_PROPERTIES;
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const savedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
      if (savedAgents) {
        return JSON.parse(savedAgents);
      }
    } catch {
      // ignore
    }
    return DEMO_AGENTS;
  });

  const [savedByUser, setSavedByUser] = useState<Record<string, string[]>>(() => {
    try {
      const storedMap = localStorage.getItem(SAVED_BY_USER_STORAGE_KEY);
      if (storedMap) {
        return JSON.parse(storedMap);
      }
      const legacySaved = localStorage.getItem(SAVED_STORAGE_KEY);
      if (legacySaved) {
        const parsed = JSON.parse(legacySaved);
        if (Array.isArray(parsed)) {
          return { 'ahmed.zubair@example.com': parsed };
        }
      }
    } catch {
      // ignore
    }
    return {
      'ahmed.zubair@example.com': ['PM-101', 'PM-103'],
    };
  });

  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      id: 'demo-buyer',
      name: 'Ahmed Zubair',
      email: 'ahmed.zubair@example.com',
      phone: '+92 301 2345678',
      role: 'buyer',
      city: 'Islamabad',
      savedPropertyIds: ['PM-101', 'PM-103'],
    };
  });

  const [filters, setFilters] = useState<PropertyFilterState>(() => {
    try {
      const savedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);
      if (savedFilters) {
        return { ...DEFAULT_FILTERS, ...JSON.parse(savedFilters) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_FILTERS;
  });

  const initialNav = useRef<PersistedNavState | null>(null);
  if (!initialNav.current) {
    initialNav.current = readInitialNavState();
  }

  const [activeView, setActiveView] = useState<AppView>(initialNav.current.activeView);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    initialNav.current.selectedPropertyId
  );
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(
    initialNav.current.selectedAgentId
  );
  const isFirstNavSyncRef = useRef(true);
  const skipHashUpdateRef = useRef(false);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [showApkModal, setShowApkModal] = useState<boolean>(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [pendingSavePropertyId, setPendingSavePropertyId] = useState<string | null>(null);

  const savedPropertyIds: string[] = currentUser
    ? savedByUser[getUserSavedKey(currentUser)] ?? currentUser.savedPropertyIds ?? []
    : [];

  // Sync properties to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [properties]);

  // Sync agents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
    } catch (e) {
      console.warn('Agent storage sync error', e);
    }
  }, [agents]);

  // Sync per-user saved properties map to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_BY_USER_STORAGE_KEY, JSON.stringify(savedByUser));
    } catch {
      // ignore
    }
  }, [savedByUser]);

  // Sync user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Persist filters across refresh
  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // ignore
    }
  }, [filters]);

  // Persist current view & selection across refresh + keep URL hash synchronized
  useEffect(() => {
    try {
      const payload: PersistedNavState = {
        activeView,
        selectedPropertyId,
        selectedAgentId,
      };
      localStorage.setItem(NAV_STATE_STORAGE_KEY, JSON.stringify(payload));

      const targetHash = buildHashFromNavState(activeView, selectedPropertyId, selectedAgentId);
      if (skipHashUpdateRef.current) {
        skipHashUpdateRef.current = false;
      } else if (window.location.hash !== targetHash) {
        if (isFirstNavSyncRef.current) {
          window.history.replaceState(null, '', targetHash);
        } else {
          window.history.pushState(null, '', targetHash);
        }
      }
      isFirstNavSyncRef.current = false;
    } catch {
      // ignore history/storage errors in restricted sandboxes
    }
  }, [activeView, selectedPropertyId, selectedAgentId]);

  // Handle browser Back/Forward hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHashNavState();
      if (!parsed || !parsed.activeView) return;
      skipHashUpdateRef.current = true;
      setActiveView(parsed.activeView);
      if (parsed.selectedPropertyId !== undefined) {
        setSelectedPropertyId(parsed.selectedPropertyId);
      }
      if (parsed.selectedAgentId !== undefined) {
        setSelectedAgentId(parsed.selectedAgentId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateFilter = <K extends keyof PropertyFilterState>(key: K, value: PropertyFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const setCurrentUser = (user: UserProfile | null) => {
    if (!user) {
      setCurrentUserState(null);
      return;
    }

    const userKey = getUserSavedKey(user);
    const existingSaved = savedByUser[userKey] ?? user.savedPropertyIds ?? [];
    let nextSaved = existingSaved;

    if (pendingSavePropertyId && !existingSaved.includes(pendingSavePropertyId)) {
      nextSaved = [pendingSavePropertyId, ...existingSaved];
      setPendingSavePropertyId(null);
      addToast('Property bookmarked to your Saved collection!', 'success');
    } else if (pendingSavePropertyId) {
      setPendingSavePropertyId(null);
    }

    setSavedByUser((prev) => ({ ...prev, [userKey]: nextSaved }));
    setCurrentUserState({ ...user, savedPropertyIds: nextSaved });
  };

  const logout = () => {
    setPendingSavePropertyId(null);
    setCurrentUserState(null);
    addToast('Signed out of your account.', 'info');
  };

  const toggleSaveProperty = (id: string) => {
    if (!currentUser) {
      setPendingSavePropertyId(id);
      setAuthModalTab('login');
      setShowAuthModal(true);
      addToast('Sign in to bookmark properties in your Saved collection.', 'info');
      return;
    }

    const userKey = getUserSavedKey(currentUser);
    const currentList = savedByUser[userKey] ?? currentUser.savedPropertyIds ?? [];
    const exists = currentList.includes(id);
    const updatedList = exists
      ? currentList.filter((pId) => pId !== id)
      : [id, ...currentList];

    setSavedByUser((prev) => ({ ...prev, [userKey]: updatedList }));
    setCurrentUserState((prev) =>
      prev ? { ...prev, savedPropertyIds: updatedList } : prev
    );

    if (exists) {
      addToast('Removed from Saved properties', 'info');
    } else {
      addToast('Bookmarked to Saved properties', 'success');
    }
  };

  const clearSavedProperties = () => {
    if (!currentUser) return;
    const userKey = getUserSavedKey(currentUser);
    setSavedByUser((prev) => ({ ...prev, [userKey]: [] }));
    setCurrentUserState((prev) => (prev ? { ...prev, savedPropertyIds: [] } : prev));
    addToast('Cleared all saved properties from your collection.', 'info');
  };

  const isPropertySaved = (id: string) => Boolean(currentUser && savedPropertyIds.includes(id));

  const navigateToProperty = (id: string) => {
    setSelectedPropertyId(id);
    setActiveView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAgent = (id: string) => {
    setSelectedAgentId(id);
    setActiveView('agent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addProperty = (
    propertyData: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'status' | 'isDemo'>
  ): string => {
    const newId = `PM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProp: Property = {
      ...propertyData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      status: 'pending', // Requires admin moderation
      isDemo: true, // Marked as demo for test environment
    };

    setProperties((prev) => [newProp, ...prev]);
    addToast(`Property listing submitted successfully! Ref: ${newId}. Awaiting admin review.`, 'success');
    return newId;
  };

  const approveProperty = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' as PropertyStatus, rejectionReason: undefined } : p))
    );
    addToast(`Listing ${id} has been approved and published!`, 'success');
  };

  const rejectProperty = (id: string, reason: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' as PropertyStatus, rejectionReason: reason } : p))
    );
    addToast(`Listing ${id} was rejected with reason: ${reason}`, 'error');
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSavedByUser((prev) => {
      const next: Record<string, string[]> = {};
      for (const [k, ids] of Object.entries(prev)) {
        next[k] = ids.filter((pId) => pId !== id);
      }
      return next;
    });
    addToast(`Property ${id} deleted`, 'info');
  };

  const toggleFeatured = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = !p.featured;
          addToast(newStatus ? 'Marked as Featured' : 'Removed from Featured', 'info');
          return { ...p, featured: newStatus };
        }
        return p;
      })
    );
  };

  const updateProperty = (
    id: string,
    updates: Partial<Property>,
    customSuccessMessage?: string
  ) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
    addToast(
      customSuccessMessage || `Listing ${id} updated: Details saved successfully!`,
      'success'
    );
  };

  const openEditPropertyModal = (id: string) => {
    setEditingPropertyId(id);
  };

  const updateAgentAvatar = (agentId: string, avatarUrl: string, agentNameFallback?: string) => {
    setAgents((prev) =>
      prev.map((ag) =>
        ag.id === agentId || (agentNameFallback && ag.name === agentNameFallback)
          ? { ...ag, avatar: avatarUrl }
          : ag
      )
    );
    setProperties((prev) =>
      prev.map((prop) =>
        prop.agent.id === agentId || (agentNameFallback && prop.agent.name === agentNameFallback)
          ? {
              ...prop,
              agent: {
                ...prop.agent,
                avatar: avatarUrl,
              },
            }
          : prop
      )
    );
    addToast('Agent profile picture updated!', 'success');
  };

  const switchDemoRole = (role: 'guest' | 'buyer' | 'seller' | 'agent' | 'admin') => {
    if (role === 'guest') {
      setCurrentUser(null);
      addToast('Browsing as Guest User', 'info');
      return;
    }

    const roleConfigs: Record<string, UserProfile> = {
      buyer: {
        id: 'usr-buyer-01',
        name: 'Ahmed Zubair',
        email: 'ahmed.zubair@example.com',
        phone: '+92 301 2345678',
        role: 'buyer',
        city: 'Islamabad',
        savedPropertyIds: ['PM-101', 'PM-103'],
      },
      seller: {
        id: 'usr-seller-01',
        name: 'Raja Mohammad Asif',
        email: 'raja.asif@example.com',
        phone: '+92 333 9988776',
        role: 'seller',
        city: 'Mirpur AJK',
        savedPropertyIds: [],
      },
      agent: {
        id: 'agent-1',
        name: 'Malik Tariq Mehmood',
        agencyName: 'Margalla Prime Estates',
        email: 'tariq@margallaprime.pk',
        phone: '+92 300 5544321',
        role: 'agent',
        city: 'Islamabad',
        savedPropertyIds: [],
      },
      admin: {
        id: 'usr-admin-01',
        name: 'PropertyMarkaz Admin',
        email: 'admin@propertymarkaz.pk',
        phone: '+92 51 8887766',
        role: 'admin',
        city: 'Islamabad',
        savedPropertyIds: [],
      },
    };

    const user = roleConfigs[role];
    setCurrentUser(user);
    addToast(`Logged in as Demo ${role.toUpperCase()} (${user.name})`, 'success');
  };

  // Filtered properties logic (before geofence, so map can still show nearby context pins)
  const preGeofenceProperties = properties.filter((item) => {
    // Only approved listings visible to public unless admin view
    if (activeView !== 'admin' && item.status !== 'approved') {
      return false;
    }

    // Purpose filter
    if (filters.purpose !== 'all' && item.purpose !== filters.purpose) {
      return false;
    }

    // City filter
    if (filters.city && item.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }

    // Area filter
    if (filters.area && !item.location.toLowerCase().includes(filters.area.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filters.type && item.type.toLowerCase() !== filters.type.toLowerCase()) {
      return false;
    }

    // Development Type filter (Sector, Society, Town, Private Land)
    if (filters.developmentType !== 'all') {
      if (item.developmentType) {
        if (item.developmentType !== filters.developmentType) {
          return false;
        }
      } else {
        // Inferred fallback for legacy or demo listings without explicit developmentType
        const locLower = item.location.toLowerCase();
        if (filters.developmentType === 'Sector' && !locLower.includes('sector')) return false;
        if (
          filters.developmentType === 'Society' &&
          !(
            locLower.includes('dha') ||
            locLower.includes('bahria') ||
            locLower.includes('society') ||
            locLower.includes('city') ||
            locLower.includes('enclave') ||
            locLower.includes('greens') ||
            locLower.includes('hills') ||
            locLower.includes('scheme')
          )
        )
          return false;
        if (filters.developmentType === 'Town' && !locLower.includes('town')) return false;
        if (
          filters.developmentType === 'Private Land' &&
          !(
            item.type === 'Private Land' ||
            item.type === 'Agricultural Land' ||
            item.type === 'Farmhouse Land' ||
            locLower.includes('mouza') ||
            locLower.includes('khasra') ||
            locLower.includes('chak')
          )
        )
          return false;
      }
    }

    // Development name specific filter
    if (filters.developmentName && filters.developmentName.trim() !== '') {
      const devQ = filters.developmentName.toLowerCase();
      const matchDevName = item.developmentName?.toLowerCase().includes(devQ);
      const matchLoc = item.location.toLowerCase().includes(devQ);
      const matchMouza = item.landDetails?.mouzaName?.toLowerCase().includes(devQ);
      if (!matchDevName && !matchLoc && !matchMouza) {
        return false;
      }
    }

    // Min price
    if (filters.minPrice !== null && item.price < filters.minPrice) {
      return false;
    }

    // Max price
    if (filters.maxPrice !== null && item.price > filters.maxPrice) {
      return false;
    }

    // Min bedrooms
    if (filters.minBedrooms !== null) {
      if (!item.bedrooms || item.bedrooms < filters.minBedrooms) {
        return false;
      }
    }

    // Min bathrooms
    if (filters.minBathrooms !== null) {
      if (!item.bathrooms || item.bathrooms < filters.minBathrooms) {
        return false;
      }
    }

    // Min Area (approximate in chosen unit or raw value)
    if (filters.minArea !== null && item.areaValue < filters.minArea) {
      return false;
    }

    // Max Area
    if (filters.maxArea !== null && item.areaValue > filters.maxArea) {
      return false;
    }

    // Search query
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchCity = item.city.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchType = item.type.toLowerCase().includes(q);
      const matchDev = item.developmentName?.toLowerCase().includes(q);
      const matchMouza = item.landDetails?.mouzaName?.toLowerCase().includes(q);
      const matchKhasra = item.landDetails?.khasraNumber?.toLowerCase().includes(q);
      const matchTitleType = item.landDetails?.titleType?.toLowerCase().includes(q);
      if (
        !matchTitle &&
        !matchLoc &&
        !matchCity &&
        !matchDesc &&
        !matchType &&
        !matchDev &&
        !matchMouza &&
        !matchKhasra &&
        !matchTitleType
      ) {
        return false;
      }
    }

    return true;
  });

  const filteredProperties = preGeofenceProperties
    .filter((item) => isPropertyInGeofence(item, filters.geofence))
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'date-newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'area-desc':
          return b.areaValue - a.areaValue;
        case 'featured':
        default:
          // Featured first, then newest
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <PropertyContext.Provider
      value={{
        properties,
        preGeofenceProperties,
        filteredProperties,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        activeView,
        setActiveView,
        selectedPropertyId,
        setSelectedPropertyId,
        selectedAgentId,
        setSelectedAgentId,
        currentUser,
        setCurrentUser,
        logout,
        savedPropertyIds,
        toggleSaveProperty,
        clearSavedProperties,
        isPropertySaved,
        addProperty,
        updateProperty,
        approveProperty,
        rejectProperty,
        deleteProperty,
        toggleFeatured,
        editingPropertyId,
        setEditingPropertyId,
        openEditPropertyModal,
        agents,
        updateAgentAvatar,
        notifications,
        addToast,
        removeToast,
        showAuthModal,
        setShowAuthModal,
        authModalTab,
        setAuthModalTab,
        showSupabaseModal,
        setShowSupabaseModal,
        showApkModal,
        setShowApkModal,
        navigateToProperty,
        navigateToAgent,
        switchDemoRole,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};
