import React from 'react';
import { Building2, Mail, MessageSquare, Calendar, CreditCard, Wrench } from 'lucide-react';

const categories = [
  { icon: Building2, title: "Accounting & Finance", count: "3 Integrations" },
  { icon: Mail, title: "Email & Marketing", count: "2 Integrations" },
  { icon: MessageSquare, title: "Communication", count: "3 Integrations" },
  { icon: Calendar, title: "Calendar & Events", count: "2 Integrations" },
  { icon: CreditCard, title: "Payments", count: "2 Integrations" },
  { icon: Wrench, title: "Other Tools", count: "4 Integrations" },
];

export default function IntegrationCategories() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
      <h3 className="text-sm font-black text-gray-900 mb-1">Integration Categories</h3>
      <p className="text-gray-500 text-xs font-semibold mb-6">Browse integrations by category to find the right tools for your needs.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {categories.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center mb-3 group-hover:bg-[#5B3DF5]/10 transition-colors">
                <Icon size={18} className="text-[#5B3DF5]" />
              </div>
              <h4 className="text-[11px] font-bold text-gray-900 leading-tight mb-1">{item.title}</h4>
              <p className="text-[10px] font-semibold text-gray-400">{item.count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
