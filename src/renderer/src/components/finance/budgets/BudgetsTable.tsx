import React from 'react';
import BudgetRow from './BudgetRow';
import { BudgetMock } from '../../../services/mockData';
import { FolderKanban } from 'lucide-react';

interface BudgetsTableProps {
  budgets: BudgetMock[];
  selectedBudget: BudgetMock | null;
  onSelectBudget: (budget: BudgetMock) => void;
  onEditBudget: (budget: BudgetMock) => void;
  onDeleteBudget: (budget: BudgetMock) => void;
}

export default function BudgetsTable({
  budgets,
  selectedBudget,
  onSelectBudget,
  onEditBudget,
  onDeleteBudget
}: BudgetsTableProps) {
  return (
    <div className="bg-white border border-gray-150 rounded-t-3xl overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white pl-6">
        <h2 className="text-lg font-bold text-gray-900">
          All Budgets
        </h2>
        <span className="bg-[#5B3DF5]/10 text-[#5B3DF5] px-2.5 py-1 rounded-full text-xs font-bold mr-2">
          {budgets.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 text-xs font-bold uppercase tracking-wider bg-gray-50/70">
              <th className="p-4 pl-6 font-bold text-left">Budget Name</th>
              <th className="p-4 font-bold text-left">Type</th>
              <th className="p-4 font-bold text-left">Period</th>
              <th className="p-4 font-bold text-left">Budget (Rs.)</th>
              <th className="p-4 font-bold text-left">Spent (Rs.)</th>
              <th className="p-4 font-bold text-left">Progress</th>
              <th className="p-4 font-bold text-left">Status</th>
              <th className="p-4 pr-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
            {budgets.length > 0 ? (
              budgets.map((item) => (
                <BudgetRow
                  key={item.id}
                  item={item}
                  isSelected={selectedBudget?.id === item.id}
                  onSelect={() => onSelectBudget(item)}
                  onEdit={() => onEditBudget(item)}
                  onDelete={() => onDeleteBudget(item)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-440">
                    <FolderKanban size={40} className="mb-3 opacity-60 text-slate-400" />
                    <p className="text-sm font-bold">No budgets found</p>
                    <p className="text-xs text-gray-440 mt-1 font-semibold">Try resetting the filter criteria</p>
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

