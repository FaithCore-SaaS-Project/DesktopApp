import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FinanceGeneralSettingsProps {
  settings: Record<string, string>;
  updateSetting: (key: string, value: string) => void;
}

export default function FinanceGeneralSettings({ settings, updateSetting }: FinanceGeneralSettingsProps) {
  const budgeting = settings['finance_budgeting'] === 'true';
  const fundAccounting = settings['finance_fund_accounting'] === 'true';
  const multiCurrency = settings['finance_multi_currency'] === 'true';
  const largeTxn = settings['finance_large_txn'] === 'true';

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#5B3DF5]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-black text-gray-900 mb-1">General Settings</h2>
      <p className="text-gray-500 text-xs font-semibold mb-6">Configure general finance preferences and defaults.</p>
      
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Currency</label>
          <div className="relative">
            <select
              value={settings['finance_currency'] || 'USD'}
              onChange={(e) => updateSetting('finance_currency', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm"
            >
              <option value="USD">US Dollar (USD) - $</option>
              <option value="EUR">Euro (EUR) - €</option>
              <option value="GBP">British Pound (GBP) - £</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Date Format</label>
          <div className="relative">
            <select
              value={settings['finance_date_format'] || 'DD MMM YYYY'}
              onChange={(e) => updateSetting('finance_date_format', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm"
            >
              <option value="DD MMM YYYY">31 Dec 2025 (DD MMM YYYY)</option>
              <option value="MM/DD/YYYY">12/31/2025 (MM/DD/YYYY)</option>
              <option value="YYYY-MM-DD">2025-12-31 (YYYY-MM-DD)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Fiscal Year Start</label>
          <div className="relative">
            <select
              value={settings['finance_fiscal_year_start'] || 'January'}
              onChange={(e) => updateSetting('finance_fiscal_year_start', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm"
            >
              <option value="January">January</option>
              <option value="April">April</option>
              <option value="July">July</option>
              <option value="October">October</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Financial Year Display</label>
          <div className="relative">
            <select
              value={settings['finance_year_display'] || '2025'}
              onChange={(e) => updateSetting('finance_year_display', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm"
            >
              <option value="2025">2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Default Income Account</label>
          <div className="relative">
            <select
              value={settings['finance_default_income'] || 'Main Operating Account'}
              onChange={(e) => updateSetting('finance_default_income', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm"
            >
              <option value="Main Operating Account">Main Operating Account</option>
              <option value="Building Fund">Building Fund</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Default Expense Account</label>
          <div className="relative">
            <select
              value={settings['finance_default_expense'] || 'Operating Expenses'}
              onChange={(e) => updateSetting('finance_default_expense', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm"
            >
              <option value="Operating Expenses">Operating Expenses</option>
              <option value="Payroll">Payroll</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="pt-0.5"><Toggle checked={budgeting} onChange={() => updateSetting('finance_budgeting', (!budgeting).toString())} /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Enable Budgeting</h4>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Allow creating and tracking budgets.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="pt-0.5"><Toggle checked={fundAccounting} onChange={() => updateSetting('finance_fund_accounting', (!fundAccounting).toString())} /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Enable Fund Accounting</h4>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Track transactions by funds and accounts.</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="pt-0.5"><Toggle checked={multiCurrency} onChange={() => updateSetting('finance_multi_currency', (!multiCurrency).toString())} /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Enable Multi-Currency</h4>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Allow transactions in multiple currencies.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="pt-0.5"><Toggle checked={largeTxn} onChange={() => updateSetting('finance_large_txn', (!largeTxn).toString())} /></div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-gray-900">Require Approval for Large Transactions</h4>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Require approval for transactions above a set amount.</p>
              
              <div className="mt-4">
                <label className="text-[10px] font-bold text-gray-900 mb-1.5 block">Large Transaction Approval Limit</label>
                <div className="flex shadow-sm rounded-xl overflow-hidden">
                  <span className="bg-gray-50 border border-gray-200 border-r-0 px-3 flex items-center text-xs font-bold text-gray-500">
                    USD
                  </span>
                  <input
                    type="text"
                    value={settings['finance_large_txn_limit'] || '1,000.00'}
                    onChange={(e) => updateSetting('finance_large_txn_limit', e.target.value)}
                    className="flex-1 border border-gray-200 py-2 px-3 text-xs font-semibold text-gray-900 outline-none focus:border-[#5B3DF5]"
                  />
                </div>
                <p className="text-[9px] font-semibold text-gray-400 mt-1.5">Transactions above this amount will require approval.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
