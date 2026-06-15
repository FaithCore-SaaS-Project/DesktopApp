import React from 'react';
import BankAccountRow from './BankAccountRow';
import { BankAccountMock } from '../../../services/mockData';
import { Landmark } from 'lucide-react';

interface BankAccountsTableProps {
  accounts: BankAccountMock[];
  selectedAccount: BankAccountMock | null;
  onSelectAccount: (account: BankAccountMock) => void;
  onEditAccount: (account: BankAccountMock) => void;
  onToggleAccountStatus: (account: BankAccountMock) => void;
}

export default function BankAccountsTable({
  accounts,
  selectedAccount,
  onSelectAccount,
  onEditAccount,
  onToggleAccountStatus
}: BankAccountsTableProps) {
  return (
    <div className="bg-white border border-gray-150 rounded-t-3xl overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white pl-6">
        <h2 className="text-lg font-bold text-gray-900">
          All Bank Accounts
        </h2>
        <span className="bg-[#5B3DF5]/10 text-[#5B3DF5] px-2.5 py-1 rounded-full text-xs font-bold mr-2">
          {accounts.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 text-xs font-bold uppercase tracking-wider bg-gray-50/70">
              <th className="p-4 pl-6 font-bold text-left">Bank Name</th>
              <th className="p-4 font-bold text-left">Account Name</th>
              <th className="p-4 font-bold text-left">Account Number</th>
              <th className="p-4 font-bold text-left">Account Type</th>
              <th className="p-4 font-bold text-left">Balance (Rs.)</th>
              <th className="p-4 font-bold text-left">Status</th>
              <th className="p-4 pr-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
            {accounts.length > 0 ? (
              accounts.map((item) => (
                <BankAccountRow
                  key={item.id}
                  item={item}
                  isSelected={selectedAccount?.id === item.id}
                  onSelect={() => onSelectAccount(item)}
                  onEdit={() => onEditAccount(item)}
                  onToggleStatus={() => onToggleAccountStatus(item)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Landmark size={40} className="mb-3 opacity-60 text-slate-400" />
                    <p className="text-sm font-bold">No bank accounts found</p>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">Try resetting the filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
