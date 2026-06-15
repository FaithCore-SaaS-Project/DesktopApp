import React from 'react';
import {
  Pencil,
  Trash2,
  Info,
  Layers
} from 'lucide-react';
import { CategoryMock, FinanceMock } from '../../../services/mockData';
import { getCategoryIconInfo } from './CategoryRow';

interface CategoryDetailsProps {
  category: CategoryMock | null;
  financeRecords: FinanceMock[];
  onEdit: () => void;
  onDelete: () => void;
}

// Predefined mock seeds to align with screenshot aesthetics
const CATEGORY_SEEDS: Record<string, { transactions: number; amount: number }> = {
  tithes: { transactions: 155, amount: 2425000.00 },
  offerings: { transactions: 118, amount: 1235000.00 },
  donations: { transactions: 41, amount: 800000.00 },
  'event income': { transactions: 18, amount: 150000.00 },
  'hall rent': { transactions: 8, amount: 320000.05 },
  'ministry expenses': { transactions: 34, amount: 437500.00 },
  utilities: { transactions: 63, amount: 166250.00 },
  salaries: { transactions: 12, amount: 960000.00 },
  maintenance: { transactions: 21, amount: 140000.00 },
  'office expenses': { transactions: 48, amount: 75000.00 },
};

export default function CategoryDetails({
  category,
  financeRecords,
  onEdit,
  onDelete
}: CategoryDetailsProps) {
  if (!category) {
    return (
      <div className="bg-white border border-gray-150 rounded-3xl p-6 text-center shadow-sm select-none">
        <div className="h-16 w-16 mx-auto bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <Layers size={24} />
        </div>
        <h3 className="font-bold text-gray-800 text-sm">No Category Selected</h3>
        <p className="text-xs text-gray-400 mt-1">Select a category from the list to view its financial allocation details.</p>
      </div>
    );
  }

  // Get matching icon and style info
  const { icon: Icon, bg: iconBg } = getCategoryIconInfo(category.name, category.type);

  // Dynamic calculations based on matching records
  const dbRecords = financeRecords.filter(
    r => r.category.toLowerCase() === category.name.toLowerCase()
  );
  
  const dbTransactionsCount = dbRecords.length;
  const dbAmountSum = dbRecords.reduce((sum, r) => sum + r.amount, 0);

  // Add mock seed values if the category matches
  const seedKey = category.name.toLowerCase();
  const seed = CATEGORY_SEEDS[seedKey] || { transactions: 0, amount: 0.0 };

  const totalTransactions = seed.transactions + dbTransactionsCount;
  const totalAmount = seed.amount + dbAmountSum;

  // Format amount
  const formatCurrency = (val: number) => {
    return `Rs. ${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format date helper: "2025-02-10" -> "10 Feb 2025" (or "10 Feb 2025 09:30 AM")
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return `${dateObj.toLocaleDateString('en-GB', options)} 09:30 AM`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-5 select-none">
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Category Details</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className={`h-16 w-16 rounded-full ${iconBg} text-white flex items-center justify-center`}>
            <Icon size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {category.name}
            </h2>
            <span
              className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mt-1 ${
                category.type === 'Income'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {category.type}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs font-semibold text-gray-500">
          <div className="flex justify-between items-start py-0.5">
            <span>Description</span>
            <span className="text-gray-800 text-right max-w-[180px]">{category.description}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Type</span>
            <span className="text-gray-800">{category.type}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Status</span>
            <span className={category.status === 'Active' ? 'text-green-600' : 'text-gray-400'}>
              {category.status}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Created On</span>
            <span className="text-gray-800">{formatDate(category.createdOn)}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Created By</span>
            <span className="text-gray-800">{category.createdBy}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Total Transactions</span>
            <span className="text-gray-850 font-bold">{totalTransactions}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-700">Total Amount</span>
            <span className="font-black text-base text-green-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="w-full mt-6 bg-[#5B3DF5] hover:bg-[#4a30db] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-[#5B3DF5]/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Pencil size={15} />
          Edit Category
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="w-full mt-3 border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer"
        >
          <Trash2 size={15} />
          Delete Category
        </button>
      </div>

      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
        <div className="flex gap-3">
          <Info className="text-blue-500 shrink-0" size={18} />
          <div>
            <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
              Category Types
            </h4>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed font-semibold">
              Income categories are used for all incoming transactions.
            </p>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed font-semibold">
              Expense categories are used for all outgoing transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
