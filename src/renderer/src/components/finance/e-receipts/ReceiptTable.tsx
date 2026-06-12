import React from 'react';
import ReceiptRow from './ReceiptRow';
import ReceiptPagination from './ReceiptPagination';
import { ReceiptMock } from '../../../services/mockData';

interface ReceiptTableProps {
  receipts: ReceiptMock[];
  allReceiptsCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedReceiptId: string;
  onSelectReceipt: (item: ReceiptMock) => void;
  onViewDetails?: (item: ReceiptMock) => void;
}

export default function ReceiptTable({
  receipts,
  allReceiptsCount,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  selectedReceiptId,
  onSelectReceipt,
  onViewDetails
}: ReceiptTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-150 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4 pl-6">Receipt No.</th>
              <th className="py-4">Date</th>
              <th className="py-4">From / Member</th>
              <th className="py-4">Category</th>
              <th className="py-4">Amount (Rs.)</th>
              <th className="py-4">Method</th>
              <th className="py-4">Status</th>
              <th className="py-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {receipts.length > 0 ? (
              receipts.map((item) => (
                <ReceiptRow
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedReceiptId}
                  onSelect={() => onSelectReceipt(item)}
                  onViewDetails={onViewDetails}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-12 text-center text-gray-400 font-semibold text-xs">
                  No e-receipts found matching the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <ReceiptPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={allReceiptsCount}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
