import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, mockTenants } from '../services/mockData';
import { isElectron } from '../services/api';

interface User {
  username: string;
  role: string;
}

interface AppContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  user: User | null;
  login: (username: string, tenantId: string) => boolean;
  logout: () => void;
  isOnline: boolean;
  toggleNetworkStatus: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Set default tenant
  useEffect(() => {
    if (mockTenants.length > 0) {
      setCurrentTenant(mockTenants[0]);
    }
  }, []);

  const switchTenant = (tenantId: string) => {
    const selected = mockTenants.find((t) => t.id === tenantId);
    if (selected) {
      setCurrentTenant(selected);
      // Notify main process if running in electron
      if (isElectron()) {
        try {
          // Send update (if configured in main)
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const login = (username: string, tenantId: string): boolean => {
    if (username.trim()) {
      setUser({ username, role: 'Administrator' });
      switchTenant(tenantId);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleNetworkStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <AppContext.Provider
      value={{
        currentTenant,
        tenants: mockTenants,
        switchTenant,
        user,
        login,
        logout,
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
