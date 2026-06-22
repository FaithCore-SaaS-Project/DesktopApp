import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
  ChevronDown
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
      { label: "General", path: "/settings/general" },
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
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    let changed = false;
    menuItems.forEach(item => {
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
  }, [router.pathname]);

  const handleMenuClick = (e: React.MouseEvent, path: string) => {
    setOpenMenus(prev => ({ ...prev, [path]: !prev[path] }));
    if (!router.pathname.startsWith(path)) {
      router.push(path);
    } else {
      e.preventDefault();
    }
  };

  return (
    <aside className="w-[280px] bg-[#08152F] text-white flex flex-col min-h-screen sticky top-0 h-screen select-none shrink-0">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Kingdom Connect
        </h1>
        <p className="text-sm text-gray-400 mt-1 font-medium">
          Church Management System
        </p>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium group
              ${
                isActive
                  ? "bg-[#5B3DF5] text-white shadow-lg shadow-[#5B3DF5]/25 font-semibold"
                  : "text-slate-350 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} className={`transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="flex-1">{item.label}</span>
              {hasSubItems && (
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-white' : 'text-slate-400 group-hover:text-white'
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
                  {itemContent}
                </Link>
              )}

              {/* Collapsible Subparts Menu */}
              {hasSubItems && isOpen && item.subItems && (
                <div className="relative pl-6 pr-2 pb-2 mt-1 space-y-1 transition-all duration-300">
                  {/* Vertical dotted line running down */}
                  <div className="absolute left-[20px] top-0 bottom-4 w-[1px] bg-slate-700/60" />
                  
                  {item.subItems.map((sub, sIdx) => {
                    const isSubActive = router.pathname === sub.path || router.pathname.startsWith(sub.path);
                    
                    return (
                      <Link href={sub.path} key={sIdx} passHref legacyBehavior>
                        <a
                          className={`flex items-center py-2 text-xs font-semibold transition-all relative group/sub cursor-pointer ${
                            isSubActive ? "text-white font-bold" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {/* Dot Bullet */}
                          <span className={`absolute left-[17.5px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border transition-all ${
                            isSubActive 
                              ? "bg-[#5B3DF5] border-[#5B3DF5] ring-4 ring-[#5B3DF5]/20 scale-110" 
                              : "bg-[#08152F] border-slate-700 group-hover/sub:border-slate-500"
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
  );
}
