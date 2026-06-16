import React from 'react';
import { Clock3, Mail, Phone, Globe, AlertTriangle } from 'lucide-react';

export default function SupportInformation() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-black text-gray-900 mb-6">Support Information</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <Clock3 size={18} className="text-[#5B3DF5] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Support Hours</h4>
              <p className="text-[11px] font-bold text-gray-700">Monday - Friday</p>
              <p className="text-[10px] font-semibold text-gray-500">8:00 AM - 6:00 PM (EST)</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Mail size={18} className="text-[#5B3DF5] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Email Support</h4>
              <p className="text-[11px] font-bold text-gray-700">support@kingdomconnect.org</p>
              <p className="text-[10px] font-semibold text-gray-500">We typically respond within 24 hours</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Phone size={18} className="text-[#5B3DF5] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Phone Support</h4>
              <p className="text-[11px] font-bold text-gray-700">+1 (555) 123-4567</p>
              <p className="text-[10px] font-semibold text-gray-500">Available during support hours</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Globe size={18} className="text-[#5B3DF5] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Help Center</h4>
              <p className="text-[11px] font-bold text-gray-700">help.kingdomconnect.org</p>
              <p className="text-[10px] font-semibold text-gray-500">24/7 access to articles and guides</p>
            </div>
          </div>
        </div>
        
        {/* Urgent Help */}
        <div className="bg-[#5B3DF5]/5 rounded-2xl border border-[#5B3DF5]/10 p-8 flex flex-col justify-center h-full">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-5 shadow-sm">
            <AlertTriangle size={24} className="text-[#5B3DF5]" />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-2">Need urgent help?</h3>
          <p className="text-[11px] font-semibold text-gray-600 mb-6 leading-relaxed">
            If you're experiencing a critical issue that requires immediate attention, please call our support hotline.
          </p>
          <button className="bg-white border border-gray-200 text-[#5B3DF5] px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors w-fit flex items-center gap-2 cursor-pointer">
            <Phone size={14} />
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
}
