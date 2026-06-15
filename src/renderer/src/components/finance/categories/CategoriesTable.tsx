import React from 'react';
import CategoryRow from './CategoryRow';
import { CategoryMock } from '../../../services/mockData';
import { Layers } from 'lucide-react';

interface CategoriesTableProps {
  categories: CategoryMock[];
  selectedCategory: CategoryMock | null;
  onSelectCategory: (category: CategoryMock) => void;
  onEditCategory: (category: CategoryMock) => void;
  onDeleteCategory: (category: CategoryMock) => void;
}

export default function CategoriesTable({
  categories,
  selectedCategory,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory
}: CategoriesTableProps) {
  return (
    <div className="bg-white border border-gray-150 rounded-t-3xl overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white pl-6">
        <h2 className="text-lg font-bold text-gray-900">
          All Categories
        </h2>
        <span className="bg-[#5B3DF5]/10 text-[#5B3DF5] px-2.5 py-1 rounded-full text-xs font-bold mr-2">
          {categories.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 text-xs font-bold uppercase tracking-wider bg-gray-50/70">
              <th className="p-4 pl-6 font-bold text-left">Category Name</th>
              <th className="p-4 font-bold text-left">Type</th>
              <th className="p-4 font-bold text-left">Description</th>
              <th className="p-4 font-bold text-left">Status</th>
              <th className="p-4 font-bold text-left">Created On</th>
              <th className="p-4 pr-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
            {categories.length > 0 ? (
              categories.map((item) => (
                <CategoryRow
                  key={item.id}
                  item={item}
                  isSelected={selectedCategory?.id === item.id}
                  onSelect={() => onSelectCategory(item)}
                  onEdit={(e) => onEditCategory(item)}
                  onDelete={(e) => onDeleteCategory(item)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-450">
                    <Layers size={40} className="mb-3 opacity-60 text-slate-450" />
                    <p className="text-sm font-bold">No categories found</p>
                    <p className="text-xs text-gray-450 mt-1 font-semibold">Try resetting the filter criteria</p>
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
