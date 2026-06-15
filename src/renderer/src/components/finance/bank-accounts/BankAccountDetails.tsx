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
      <div className="bg-white border border-gray-150 rounded-3xl p-6 text-center shadow-sm select-none">
        <div className="h-16 w-16 mx-auto bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <Layers size={24} />
        </div>
        <h3 className="font-bold text-gray-800 text-sm">No Account Selected</h3>
        <p className="text-xs text-gray-400 mt-1">Select a bank account from the table to view details.</p>
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
    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm select-none">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Account Details</h3>
      
      {/* Bank details header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`h-14 w-14 rounded-full ${logoBg} ${logoText} flex items-center justify-center font-bold shrink-0 shadow-sm`}>
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-900 leading-tight">
            {account.bankName}
          </h2>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">
            {account.accountName}
          </p>
        </div>
      </div>

      {/* Details list */}
      <div className="space-y-4 text-xs font-semibold text-gray-500">
        <div className="flex justify-between items-center py-0.5">
          <span>Account Number</span>
          <span className="text-gray-800 font-mono text-[11px]">{account.accountNumber}</span>
        </div>
        
        <div className="flex justify-between items-center py-0.5">
          <span>Account Type</span>
          <span className="text-gray-800">{account.accountType}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span>Branch</span>
          <span className="text-gray-800">{account.branch}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span>Currency</span>
          <span className="text-gray-800 font-bold">{account.currency}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span>Available Balance</span>
          <span className="text-emerald-600 font-black text-sm">
            {formatCurrency(account.balance)}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span>Ledger Balance</span>
          <span className="text-gray-800">
            {formatCurrency(account.ledgerBalance)}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span>Last Statement Date</span>
          <span className="text-gray-800">{formatDate(account.lastStatementDate)}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span>Added On</span>
          <span className="text-gray-800">{formatDate(account.createdOn)}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span>Added By</span>
          <span className="text-gray-800">{account.createdBy}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span>Status</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
              account.status === 'Active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
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
          className="w-full bg-[#5B3DF5] hover:bg-[#4a30db] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-[#5B3DF5]/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          View Transactions
        </button>
        
        <button
          type="button"
          onClick={onEdit}
          className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer"
        >
          Edit Account
        </button>

        <button
          type="button"
          onClick={onToggleStatus}
          className={`w-full border py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer ${
            account.status === 'Active'
              ? 'border-red-200 text-red-500 hover:bg-red-50'
              : 'border-green-200 text-green-600 hover:bg-green-50'
          }`}
        >
          {account.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
        </button>
      </div>
    </div>
  );
}
