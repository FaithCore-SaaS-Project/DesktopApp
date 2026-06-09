import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { useRouter } from 'next/router';
import Sidebar from './components/dashboard/Sidebar';
import Header from './components/dashboard/Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isActivated, user } = useApp();
  const router = useRouter();

  // Central routing guard
  useEffect(() => {
    if (!router.isReady) return;

    if (!isActivated) {
      if (router.pathname !== '/activation') {
        router.replace('/activation');
      }
    } else if (!user) {
      if (router.pathname !== '/login') {
        router.replace('/login');
      }
    } else {
      if (router.pathname === '/login' || router.pathname === '/activation') {
        router.replace('/dashboard');
      }
    }
  }, [isActivated, user, router.pathname, router.isReady]);

  // Render children directly for full-screen pages if not activated or authenticated
  if (!isActivated || !user) {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  return (
    <div className="flex bg-[#f5f6fa] min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#f5f6fa]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
