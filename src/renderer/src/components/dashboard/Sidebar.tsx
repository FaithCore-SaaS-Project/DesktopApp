import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Home,
  DollarSign,
  Mail,
  BadgeCheck,
  CalendarDays,
  BarChart3,
  FolderOpen,
  Building2,
  UserCog,
  Settings,
  Headphones,
  ChevronDown,
  MessageSquare
} from "lucide-react";

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  subItems?: { label: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: Home, label: "Families", path: "/families" },
  {
    icon: DollarSign,
    label: "Finance",
    path: "/finance",
    subItems: [
      { label: "Overview", path: "/finance" },
      { label: "Income", path: "/finance/income" },
      { label: "Expenses", path: "/finance/expenses" },
      { label: "E-Receipts", path: "/finance/e-receipts" },
      { label: "Categories", path: "/finance/categories" },
      { label: "Bank Accounts", path: "/finance/bank-accounts" },
      { label: "Budgets", path: "/finance/budgets" }
    ]
  },
  { icon: Mail, label: "Letters", path: "/letters" },
  { icon: MessageSquare, label: "SMS Center", path: "/sms" },
  { icon: BadgeCheck, label: "Certificates", path: "/certificates" },
  { icon: CalendarDays, label: "Events", path: "/events" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: FolderOpen, label: "Documents", path: "/documents" },
  { icon: Building2, label: "Departments", path: "/departments" },
  {
    icon: UserCog,
    label: "Users & Roles",
    path: "/users",
    subItems: [
      { label: "Users", path: "/users" },
      { label: "Roles", path: "/roles" },
      { label: "Permissions", path: "/permissions" }
    ]
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    subItems: [
      { label: "General", path: "/settings" },
      { label: "Finance", path: "/settings/finance" },
      { label: "Notifications", path: "/settings/notifications" },
      { label: "Security", path: "/settings/security" },
      { label: "Integrations", path: "/settings/integrations" },
      { label: "Backup", path: "/settings/backup" }
    ]
  },
  { icon: Headphones, label: "Support", path: "/support" },
];

export default function Sidebar() {
  const router = useRouter();
  const { hasFeature, activePlan, isSidebarOpen, toggleSidebar } = useApp();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Filter menu items and their sub-items based on plan feature gates
  const filteredMenuItems = menuItems.filter(item => {
    if (item.path === '/letters' && !hasFeature('letters.enabled')) return false;
    if (item.path === '/certificates' && !hasFeature('certificates.enabled')) return false;
    if (item.path === '/reports' && !hasFeature('reports.enabled')) return false;
    return true;
  }).map(item => {
    if (item.subItems) {
      const filteredSubs = item.subItems.filter(sub => {
        if (sub.path === '/finance/bank-accounts' && !hasFeature('finance.bank_accounts')) return false;
        if (sub.path === '/finance/budgets' && !hasFeature('finance.budgets')) return false;
        if (sub.path === '/roles' && !hasFeature('roles.custom_roles')) return false;
        if (sub.path === '/permissions' && !hasFeature('roles.custom_roles')) return false;
        if (sub.path === '/settings/integrations' && !hasFeature('settings.integrations')) return false;
        if (sub.path === '/settings/backup' && !hasFeature('settings.backup')) return false;
        if (sub.path === '/settings/security' && !hasFeature('settings.security')) return false;
        if (sub.path === '/settings/notifications' && !hasFeature('settings.notifications')) return false;
        return true;
      });
      return { ...item, subItems: filteredSubs };
    }
    return item;
  });

  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    let changed = false;
    filteredMenuItems.forEach(item => {
      if (item.subItems) {
        const isChildActive = item.subItems.some(sub =>
          router.pathname === sub.path || router.pathname.startsWith(sub.path)
        );
        if (isChildActive && !newOpenMenus[item.path]) {
          newOpenMenus[item.path] = true;
          changed = true;
        }
      }
    });
    if (changed) {
      setOpenMenus(newOpenMenus);
    }
  }, [router.pathname, activePlan]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMenuClick = (e: React.MouseEvent, path: string) => {
    setOpenMenus(prev => ({ ...prev, [path]: !prev[path] }));
    if (!router.pathname.startsWith(path)) {
      router.push(path);
      // Optional: Close sidebar on mobile after navigation
      if (window.innerWidth < 1024) toggleSidebar();
    } else {
      e.preventDefault();
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) toggleSidebar();
  };

  return (
    <>
      {/* Mobile/Tablet Backdrop Overlay (only on smaller screens) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`bg-[#0c101c] text-slate-300 flex flex-col min-h-screen select-none shrink-0 border-r border-slate-800/80 transition-all duration-300 z-40
        fixed top-0 h-screen lg:sticky
        ${isSidebarOpen 
          ? 'translate-x-0 w-[260px] opacity-100' 
          : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none lg:opacity-0 opacity-0 pointer-events-none'}`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800/80 flex items-center justify-between min-w-[260px]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              F
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wider uppercase font-mono">
                FAITHCORE
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Church Management
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item, index) => {
            const Icon = item.icon;
            const hasSubItems = !!item.subItems;
            const isOpen = !!openMenus[item.path];
            const isAnyChildActive = hasSubItems && item.subItems!.some(sub => router.pathname === sub.path || router.pathname.startsWith(sub.path));
            const isActive = router.pathname === item.path || (item.path !== '/dashboard' && router.pathname.startsWith(item.path)) || isAnyChildActive;

            const itemContent = (
              <a
                onClick={(e) => {
                  if (hasSubItems) {
                    handleMenuClick(e, item.path);
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer text-xs font-medium group
                ${isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
              >
                <Icon size={16} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {hasSubItems && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-slate-500 group-hover:text-white'
                      }`}
                  />
                )}
              </a>
            );

            return (
              <div key={index} className="space-y-1">
                {hasSubItems ? (
                  <div onClick={(e) => hasSubItems && e.stopPropagation()}>
                    {itemContent}
                  </div>
                ) : (
                  <Link href={item.path} passHref legacyBehavior>
                    {React.cloneElement(itemContent, { onClick: handleLinkClick })}
                  </Link>
                )}

                {/* Collapsible Subparts Menu */}
                {hasSubItems && isOpen && item.subItems && (
                  <div className="relative pl-6 pr-2 pb-2 mt-1 space-y-1 transition-all duration-300">
                    {/* Vertical line running down */}
                    <div className="absolute left-[20px] top-0 bottom-4 w-[1px] bg-slate-800/80" />

                    {item.subItems.map((sub, sIdx) => {
                      const isSubActive = sub.path === item.path 
                        ? router.pathname === sub.path
                        : (router.pathname === sub.path || router.pathname.startsWith(sub.path + '/'));

                      return (
                        <Link href={sub.path} key={sIdx} passHref legacyBehavior>
                          <a
                            onClick={handleLinkClick}
                            className={`flex items-center py-2 text-xs font-semibold transition-all relative group/sub cursor-pointer ${isSubActive ? "text-white font-bold" : "text-slate-400 hover:text-white"
                              }`}
                          >
                            {/* Dot Bullet */}
                            <span className={`absolute left-[17.5px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border transition-all ${isSubActive
                                ? "bg-violet-500 border-violet-500 ring-4 ring-violet-500/25 scale-110"
                                : "bg-[#0A0D18] border-slate-800 group-hover/sub:border-slate-600"
                              }`} />
                            <span className="pl-8">{sub.label}</span>
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </aside>
    </>
  );
}
