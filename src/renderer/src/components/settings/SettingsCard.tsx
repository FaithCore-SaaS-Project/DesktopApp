import React from 'react';
import { ArrowRight } from 'lucide-react';

import Link from 'next/link';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
}

export default function SettingsCard({ title, description, icon, color, href }: SettingsCardProps) {
  const CardContent = (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer group flex flex-col h-full">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${color} mb-5 shadow-sm`}>
        {icon}
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-xs font-semibold leading-relaxed flex-1">
        {description}
      </p>
      <div className="flex justify-end mt-4">
        <ArrowRight size={16} className="text-gray-300 group-hover:text-[#5B3DF5] transition-colors" />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a className="block h-full">{CardContent}</a>
      </Link>
    );
  }

  return (
    <div onClick={() => alert('This settings page is currently under development.')} className="h-full">
      {CardContent}
    </div>
  );
}
