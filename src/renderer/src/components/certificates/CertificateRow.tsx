import React from 'react';
import { Eye, Pencil, Trash2, Download } from 'lucide-react';
import { CertificateMock } from '../../services/mockData';

interface CertificateRowProps {
  item: CertificateMock;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

export default function CertificateRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDownload,
}: CertificateRowProps) {
  // Format Date: "2025-05-24" -> "24 May 2025"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return dateObj.toLocaleDateString('en-GB', options);
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Certificate Type Badge Styles
  const getTypeBadgeStyles = (type: CertificateMock['type']) => {
    switch (type) {
      case 'Membership':
        return 'bg-purple-50 text-purple-700 border-purple-150';
      case 'Baptism':
        return 'bg-blue-50 text-blue-700 border-blue-150';
      case 'Confirmation':
        return 'bg-cyan-50 text-cyan-700 border-cyan-150';
      case 'Appreciation':
        return 'bg-yellow-50 text-yellow-700 border-yellow-150';
      case 'Volunteer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-150';
      case 'Ministry':
        return 'bg-indigo-50 text-indigo-700 border-indigo-150';
      case 'Appointment':
        return 'bg-rose-50 text-rose-700 border-rose-150';
      case 'Training':
        return 'bg-teal-50 text-teal-700 border-teal-150';
      case 'Marriage':
        return 'bg-pink-50 text-pink-700 border-pink-150';
      case 'Sunday School':
        return 'bg-orange-50 text-orange-700 border-orange-150';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-150';
    }
  };

  // Status Badge Styles
  const getStatusBadgeStyles = (status: CertificateMock['status']) => {
    switch (status) {
      case 'Issued':
        return 'bg-green-50 text-green-700 border-green-150';
      case 'Draft':
        return 'bg-blue-50 text-blue-700 border-blue-150';
      case 'Archived':
        return 'bg-orange-50 text-orange-700 border-orange-150';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-150';
    }
  };

  return (
    <tr
      onClick={onSelect}
      className={`hover:bg-gray-55/45 border-t border-gray-100 group transition-colors cursor-pointer select-none ${
        isSelected ? 'bg-indigo-50/35' : ''
      }`}
    >
      {/* Certificate ID */}
      <td className="p-4 pl-6 font-bold text-gray-900 group-hover:text-[#5B3DF5] transition-colors text-xs">
        {item.id}
      </td>

      {/* Certificate Name */}
      <td className="p-4 font-bold text-xs text-gray-805">
        {item.name}
      </td>

      {/* Type */}
      <td className="p-4">
        <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold border ${getTypeBadgeStyles(item.type)}`}>
          {item.type}
        </span>
      </td>

      {/* Recipient */}
      <td className="p-4 text-xs font-semibold text-gray-600">
        {item.recipient}
      </td>

      {/* Issued Date */}
      <td className="p-4 text-xs font-bold text-gray-500">
        {formatDate(item.issuedDate)}
      </td>

      {/* Status */}
      <td className="p-4">
        <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold border ${getStatusBadgeStyles(item.status)}`}>
          {item.status}
        </span>
      </td>

      {/* Actions */}
      <td className="p-4 pr-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 justify-center">
          {item.status === 'Draft' ? (
            <button
              onClick={onEdit}
              className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-[#5B3DF5] transition-colors cursor-pointer"
              title="Edit Draft Certificate"
            >
              <Pencil size={14} />
            </button>
          ) : (
            <button
              onClick={onSelect}
              className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-[#5B3DF5] transition-colors cursor-pointer"
              title="View Certificate Details"
            >
              <Eye size={14} />
            </button>
          )}
          <button
            onClick={onDownload}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
            title="Download Certificate PDF"
          >
            <Download size={14} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-gray-200 p-2 hover:bg-red-50 text-gray-500 hover:text-red-655 transition-colors cursor-pointer"
            title="Delete Certificate"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
