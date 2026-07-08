import React from 'react';
import { Landmark, Layers } from 'lucide-react';
import { BankAccountMock } from '../../../services/mockData';
import { getBankLogoInfo } from './BankAccountRow';

interface BankAccountDetailsProps {
  account: BankAccountMock | null;
  onEdit: () => void;
  onToggleStatus: () => void;
  onViewTransactions?: () => void;
}

export default function BankAccountDetails({
  account,
  onEdit,
  onToggleStatus,
  onViewTransactions
}: BankAccountDetailsProps) {
  if (!account) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 text-center shadow-sm shadow-slate-100/50 select-none">
        <div className="h-14 w-14 mx-auto bg-slate-50 border border-slate-100/80 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-inner">
          <Layers size={20} />
        </div>
        <h3 className="font-extrabold text-slate-700 text-xs">No Account Selected</h3>
        <p className="text-[10px] text-slate-400 mt-1 max-w-[190px] mx-auto font-medium leading-relaxed">
          Select a bank account from the table to view details and action shortcuts.
        </p>
      </div>
    );
  }

  const { icon: Icon, bg: logoBg, text: logoText } = getBankLogoInfo(account.bankName);

  const formatCurrency = (val: number) => {
    return `Rs. ${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return dateObj.toLocaleDateString('en-GB', options); // e.g. "20 May 2025"
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm shadow-slate-100/50 select-none">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-5 pl-1">Account Details</h3>
      
      {/* Bank details header */}
      <div className="flex items-center gap-4 mb-6 pl-1">
        <div className={`h-12 w-12 rounded-full ${logoBg} ${logoText} flex items-center justify-center font-bold shrink-0 shadow-sm`}>
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-800 leading-tight">
            {account.bankName}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 mt-1">
            {account.accountName}
          </p>
        </div>
      </div>

      {/* Details list */}
      <div className="space-y-4 text-xs font-bold text-slate-400 px-1">
        <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50 pb-2">
          <span>Account Number</span>
          <span className="text-slate-700 font-mono text-[11px]">{account.accountNumber}</span>
        </div>
        
        <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50 pb-2">
          <span>Account Type</span>
          <span className="text-slate-700">{account.accountType}</span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50 pb-2">
          <span>Branch</span>
          <span className="text-slate-700">{account.branch}</span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50 pb-2">
          <span>Currency</span>
          <span className="text-slate-700 font-bold">{account.currency}</span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50 pb-2">
          <span>Available Balance</span>
          <span className="text-emerald-600 font-black text-xs sm:text-sm">
            {formatCurrency(account.balance)}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50 pb-2">
          <span>Ledger Balance</span>
          <span className="text-slate-700">
            {formatCurrency(account.ledgerBalance)}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50 pb-2">
          <span>Last Statement Date</span>
          <span className="text-slate-700">{formatDate(account.lastStatementDate)}</span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50 pb-2">
          <span>Added On</span>
          <span className="text-slate-700">{formatDate(account.createdOn)}</span>
        </div>

        <div className="flex justify-between items-center py-0.5 border-b border-slate-50/50 pb-2">
          <span>Added By</span>
          <span className="text-slate-700">{account.createdBy}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span>Status</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
              account.status === 'Active'
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                : 'bg-slate-100 text-slate-500 border border-slate-200/50'
            }`}
          >
            {account.status}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-y-2.5">
        <button
          type="button"
          onClick={onViewTransactions}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-violet-500/15 active:scale-[0.98] transition-all cursor-pointer"
        >
          View Transactions
        </button>
        
        <button
          type="button"
          onClick={onEdit}
          className="w-full border border-slate-150 text-slate-600 hover:bg-slate-50 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer bg-white"
        >
          Edit Account
        </button>

        <button
          type="button"
          onClick={onToggleStatus}
          className={`w-full border py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer ${
            account.status === 'Active'
              ? 'border-rose-100 text-rose-500 hover:bg-rose-50/50 bg-white'
              : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50/50 bg-white'
          }`}
        >
          {account.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
        </button>
      </div>
    </div>
  );
}
