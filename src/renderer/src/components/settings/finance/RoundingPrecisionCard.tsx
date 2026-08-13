import React from 'react';
import { Info, ChevronDown } from 'lucide-react';

interface RoundingPrecisionCardProps {
  settings: Record<string, string>;
  updateSetting: (key: string, value: string) => void;
}

export default function RoundingPrecisionCard({ settings, updateSetting }: RoundingPrecisionCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 shadow-sm">
      <h2 className="text-lg font-black text-gray-900 mb-1">Rounding & Precision</h2>
      <p className="text-gray-500 text-xs font-semibold mb-6">Set the rounding method and decimal precision for amounts.</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="mb-5">
            <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Rounding Method</label>
            <div className="relative">
              <select 
                value={settings['finance_rounding_method'] || 'Standard (Round Half Up)'}
                onChange={(e) => updateSetting('finance_rounding_method', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm"
              >
                <option value="Standard (Round Half Up)">Standard (Round Half Up)</option>
                <option value="Round Up">Round Up</option>
                <option value="Round Down">Round Down</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Decimal Precision</label>
            <div className="relative">
              <select 
                value={settings['finance_decimal_precision'] || '2'}
                onChange={(e) => updateSetting('finance_decimal_precision', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm"
              >
                <option value="2">2 (0.00)</option>
                <option value="0">0 (0)</option>
                <option value="3">3 (0.000)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="border border-[#5B3DF5]/20 bg-[#5B3DF5]/5 rounded-xl p-5">
          <div className="flex gap-3 items-start">
            <Info size={16} className="text-[#5B3DF5] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">About Rounding</h4>
              <p className="text-[10px] font-semibold text-gray-600 leading-relaxed">
                All amounts will be rounded based on the selected method and precision. This will apply to reports, receipts and financial calculations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
