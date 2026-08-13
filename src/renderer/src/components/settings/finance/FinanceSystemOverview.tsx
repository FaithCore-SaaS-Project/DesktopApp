import React from 'react';
import { DollarSign, Calendar, Building2, CreditCard, ArrowRight } from 'lucide-react';

interface FinanceSystemOverviewProps {
  stats: any;
}

export default function FinanceSystemOverview({ stats }: FinanceSystemOverviewProps) {
  if (!stats) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-black text-gray-900 mb-6">System Overview</h3>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign size={16} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">Currency</span>
          </div>
          <span className="text-xs font-bold text-gray-900">{stats.currency || 'USD'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">Financial Year</span>
          </div>
          <span className="text-xs font-bold text-gray-900">{stats.financial_year_range || '01 Jan - 31 Dec'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">Fiscal Year Start</span>
          </div>
          <span className="text-xs font-bold text-gray-900">{stats.fiscal_year_start || 'January'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 size={16} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">Active Bank Accounts</span>
          </div>
          <span className="text-xs font-bold text-gray-900">{stats.active_bank_accounts ?? 0}</span>
        </div>
        
        {stats.active_payment_methods > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-600">Active Payment Methods</span>
            </div>
            <span className="text-xs font-bold text-gray-900">{stats.active_payment_methods}</span>
          </div>
        )}
      </div>
      <button className="mt-6 text-[11px] font-bold text-[#5B3DF5] hover:text-[#4a30db] transition-colors flex items-center gap-1.5 cursor-pointer">
        View Finance Dashboard <ArrowRight size={14} />
      </button>
    </div>
  );
}
