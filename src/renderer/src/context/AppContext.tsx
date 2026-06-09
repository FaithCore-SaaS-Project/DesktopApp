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
  login: (username: string, token: string) => void;
  logout: () => void;
  activateApp: (tenantId: string, churchName: string) => void;
  isOnline: boolean;
  toggleNetworkStatus: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [churchName, setChurchName] = useState<string | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Read initial states from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tid = localStorage.getItem('tenantId');
      const cname = localStorage.getItem('churchName');
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('username');

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
      }
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
          console.error(e);
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

  const login = (username: string, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({ username, role: 'Super Admin' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  const toggleNetworkStatus = () => {
    setIsOnline(!isOnline);
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
        login,
        logout,
        activateApp,
        isOnline,
        toggleNetworkStatus,
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
