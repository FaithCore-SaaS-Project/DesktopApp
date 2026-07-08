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
    <div className="bg-white border border-slate-100 rounded-t-[2rem] overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white pl-6">
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
          All Bank Accounts
        </h2>
        <span className="bg-violet-500/10 text-violet-600 px-3 py-1 rounded-full text-xs font-bold mr-2 select-none">
          {accounts.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-50/50">
              <th className="p-4 pl-6 font-bold text-left">Bank Name</th>
              <th className="p-4 font-bold text-left">Account Name</th>
              <th className="p-4 font-bold text-left">Account Number</th>
              <th className="p-4 font-bold text-left">Account Type</th>
              <th className="p-4 font-bold text-left">Balance (Rs.)</th>
              <th className="p-4 font-bold text-left">Status</th>
              <th className="p-4 pr-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
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
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                        <Landmark size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-650">No bank accounts found</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Try resetting the filter criteria or add an account.</p>
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
