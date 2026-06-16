import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import SupportHero from '../components/support/SupportHero';
import SupportTopics from '../components/support/SupportTopics';
import SupportInformation from '../components/support/SupportInformation';
import PopularArticles from '../components/support/PopularArticles';
import SystemStatus from '../components/support/SystemStatus';
import SupportQuickActions from '../components/support/SupportQuickActions';
import SupportSubscribe from '../components/support/SupportSubscribe';

export default function SupportPage() {
  return (
    <div className="space-y-0 pb-10">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Support</h1>
        <nav className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mt-2">
          <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
          <ChevronRight size={10} />
          <Link href="/settings" className="hover:text-[#5B3DF5] transition-colors">Settings</Link>
          <ChevronRight size={10} />
          <span className="text-[#5B3DF5]">Support</span>
        </nav>
      </div>

      <SupportHero />

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9">
          <SupportTopics />
          <SupportInformation />
        </div>
        
        <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3">
          <PopularArticles />
          <SystemStatus />
          <SupportQuickActions />
          <SupportSubscribe />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-[10px] font-bold text-gray-400">&copy; 2025 Kingdom Connect. All rights reserved.</p>
      </div>
    </div>
  );
}
