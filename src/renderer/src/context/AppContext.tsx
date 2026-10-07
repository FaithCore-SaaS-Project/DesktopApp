import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, mockTenants } from '../services/mockData';
import { isElectron } from '../services/api';

interface User {
  username: string;
  role: string;
}

interface AppContextType {
  isActivated: boolean;
  tenantId: string | null;
  churchName: string | null;
  currentTenant: Tenant | null;
  tenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  user: User | null;
  subscriptionStatus: string | null;
  activePlan: any | null;
  hasFeature: (key: string) => boolean;
  login: (username: string, token: string, subStatus: string, plan: any) => void;
  logout: () => void;
  activateApp: (tenantId: string, churchName: string) => void;
  isOnline: boolean;
  toggleNetworkStatus: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [churchName, setChurchName] = useState<string | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<any | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Read initial states from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tid = localStorage.getItem('tenantId');
      const cname = localStorage.getItem('churchName');
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('username');
      const savedSubStatus = localStorage.getItem('subscriptionStatus');
      const savedActivePlan = localStorage.getItem('activePlan');

      if (tid && cname) {
        setIsActivated(true);
        setTenantId(tid);
        setChurchName(cname);
        
        const activeTenant = { id: tid, name: cname, location: 'Colombo, LK' };
        setTenants(prev => {
          const list = prev.find(t => t.id === tid) ? prev : [activeTenant, ...prev];
          setCurrentTenant(list.find(t => t.id === tid) || list[0]);
          return list;
        });
      } else {
        setIsActivated(false);
        if (mockTenants.length > 0) {
          setCurrentTenant(mockTenants[0]);
        }
      }

      if (token && savedUser) {
        setUser({ username: savedUser, role: 'Super Admin' });
        setSubscriptionStatus(savedSubStatus || 'active');
        if (savedActivePlan) {
          try {
            setActivePlan(JSON.parse(savedActivePlan));
          } catch (e) {
            console.error('Failed to parse active plan from storage:', e?.message || 'Error occurred');
          }
        }
      }

      // Listen for unauthorized events from axios interceptor
      const handleUnauthorized = () => {
        logout();
      };
      window.addEventListener('auth:unauthorized', handleUnauthorized);
      return () => {
        window.removeEventListener('auth:unauthorized', handleUnauthorized);
      };
    }
  }, []);

  const switchTenant = (selectedTenantId: string) => {
    const selected = tenants.find((t) => t.id === selectedTenantId);
    if (selected) {
      setCurrentTenant(selected);
      if (isElectron()) {
        try {
          // Optional IPC notification to main process
        } catch (e) {
          console.error(e?.message || 'Error occurred');
        }
      }
    }
  };

  const activateApp = (activatedTenantId: string, activatedChurchName: string) => {
    localStorage.setItem('tenantId', activatedTenantId);
    localStorage.setItem('churchName', activatedChurchName);
    setTenantId(activatedTenantId);
    setChurchName(activatedChurchName);
    setIsActivated(true);

    const newTenant = { id: activatedTenantId, name: activatedChurchName, location: 'Colombo, LK' };
    setTenants(prev => {
      const list = prev.find(t => t.id === activatedTenantId) ? prev : [newTenant, ...prev];
      setCurrentTenant(newTenant);
      return list;
    });
  };

  const login = (username: string, token: string, subStatus: string, plan: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('subscriptionStatus', subStatus);
    if (plan) {
      localStorage.setItem('activePlan', JSON.stringify(plan));
      setActivePlan(plan);
    } else {
      localStorage.removeItem('activePlan');
      setActivePlan(null);
    }
    setUser({ username, role: 'Super Admin' });
    setSubscriptionStatus(subStatus);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('subscriptionStatus');
    localStorage.removeItem('activePlan');
    setUser(null);
    setSubscriptionStatus(null);
    setActivePlan(null);
  };

  const hasFeature = (featureKey: string): boolean => {
    if (!activePlan || !activePlan.features) return false;

    // Dot-notation split (e.g. "finance.budgets")
    const keys = featureKey.split('.');
    let current = activePlan.features;
    for (const key of keys) {
      if (current === null || typeof current !== 'object' || !(key in current)) {
        return false;
      }
      current = current[key];
    }
    return !!current;
  };

  const toggleNetworkStatus = () => {
    setIsOnline(!isOnline);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AppContext.Provider
      value={{
        isActivated,
        tenantId,
        churchName,
        currentTenant,
        tenants,
        switchTenant,
        user,
        subscriptionStatus,
        activePlan,
        hasFeature,
        login,
        logout,
        activateApp,
        isOnline,
        toggleNetworkStatus,
        isSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
