import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property, PropertyFilterState, UserProfile, PropertyStatus, Agent } from '../types/property';
import { DEMO_PROPERTIES, DEMO_AGENTS } from '../data/mockProperties';

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
  | 'details'
  | 'agent'
  | 'admin'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';

interface PropertyContextType {
  properties: Property[];
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
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string) => void;
  isPropertySaved: (id: string) => boolean;
  addProperty: (propertyData: Omit<Property, 'id' | 'createdAt' | 'viewsCount' | 'status' | 'isDemo'>) => string;
  approveProperty: (id: string) => void;
  rejectProperty: (id: string, reason: string) => void;
  deleteProperty: (id: string) => void;
  toggleFeatured: (id: string) => void;
  agents: Agent[];
  notifications: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  showSupabaseModal: boolean;
  setShowSupabaseModal: (show: boolean) => void;
  navigateToProperty: (id: string) => void;
  navigateToAgent: (id: string) => void;
  switchDemoRole: (role: 'guest' | 'buyer' | 'seller' | 'agent' | 'admin') => void;
}

const DEFAULT_FILTERS: PropertyFilterState = {
  purpose: 'all',
  city: '',
  area: '',
  type: '',
  minPrice: null,
  maxPrice: null,
  minBedrooms: null,
  minBathrooms: null,
  minArea: null,
  maxArea: null,
  areaUnit: 'Marla',
  sortBy: 'featured',
  searchQuery: '',
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'propertymarkaz_listings_v1';
const SAVED_STORAGE_KEY = 'propertymarkaz_saved_v1';
const USER_STORAGE_KEY = 'propertymarkaz_user_v1';

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

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['PM-101', 'PM-103'];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
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

  const [filters, setFilters] = useState<PropertyFilterState>(DEFAULT_FILTERS);
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);

  // Sync properties to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [properties]);

  // Sync saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedPropertyIds));
    } catch {
      // ignore
    }
  }, [savedPropertyIds]);

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

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        addToast('Removed from saved properties', 'info');
        return prev.filter((pId) => pId !== id);
      } else {
        addToast('Added to saved properties', 'success');
        return [...prev, id];
      }
    });
  };

  const isPropertySaved = (id: string) => savedPropertyIds.includes(id);

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

  // Filtered properties logic
  const filteredProperties = properties.filter((item) => {
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
      if (!matchTitle && !matchLoc && !matchCity && !matchDesc && !matchType) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
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
        savedPropertyIds,
        toggleSaveProperty,
        isPropertySaved,
        addProperty,
        approveProperty,
        rejectProperty,
        deleteProperty,
        toggleFeatured,
        agents: DEMO_AGENTS,
        notifications,
        addToast,
        removeToast,
        showAuthModal,
        setShowAuthModal,
        authModalTab,
        setAuthModalTab,
        showSupabaseModal,
        setShowSupabaseModal,
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
