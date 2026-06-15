import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FinanceGeneralSettings() {
  const [budgeting, setBudgeting] = useState(true);
  const [fundAccounting, setFundAccounting] = useState(true);
  const [multiCurrency, setMultiCurrency] = useState(false);
  const [largeTxn, setLargeTxn] = useState(true);

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
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm">
              <option>US Dollar (USD) - $</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Date Format</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm">
              <option>31 Dec 2025 (DD MMM YYYY)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Fiscal Year Start</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm">
              <option>January</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Financial Year Display</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm">
              <option>2025</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Default Income Account</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm">
              <option>Main Operating Account</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Default Expense Account</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm">
              <option>Operating Expenses</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="pt-0.5"><Toggle checked={budgeting} onChange={() => setBudgeting(!budgeting)} /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Enable Budgeting</h4>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Allow creating and tracking budgets.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="pt-0.5"><Toggle checked={fundAccounting} onChange={() => setFundAccounting(!fundAccounting)} /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Enable Fund Accounting</h4>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Track transactions by funds and accounts.</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="pt-0.5"><Toggle checked={multiCurrency} onChange={() => setMultiCurrency(!multiCurrency)} /></div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Enable Multi-Currency</h4>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Allow transactions in multiple currencies.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="pt-0.5"><Toggle checked={largeTxn} onChange={() => setLargeTxn(!largeTxn)} /></div>
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
                    defaultValue="1,000.00"
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
