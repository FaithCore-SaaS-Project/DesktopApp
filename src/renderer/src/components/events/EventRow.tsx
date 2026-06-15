import React from 'react';
import { Pencil, Trash2, User } from 'lucide-react';
import { EventMock } from '../../services/mockData';

interface EventRowProps {
  item: EventMock;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EventRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}: EventRowProps) {
  // Format Date: "2025-05-04" -> "04 May 2025"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.toLowerCase().includes('every') || dateStr.toLowerCase().includes('sunday') || dateStr.toLowerCase().includes('monday')) {
      return dateStr;
    }
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return dateObj.toLocaleDateString('en-GB', options); // e.g. "04 May 2025"
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Event Type Badge Styles
  const getTypeBadgeStyles = (type: EventMock['type']) => {
    switch (type) {
      case 'Worship':
        return 'bg-purple-50 text-purple-700 border-purple-150';
      case 'Bible Study':
        return 'bg-emerald-50 text-emerald-700 border-emerald-150';
      case 'Youth':
        return 'bg-amber-50 text-amber-700 border-amber-150';
      case 'Outreach':
        return 'bg-rose-50 text-rose-700 border-rose-150';
      case 'Special Service':
        return 'bg-indigo-50 text-indigo-700 border-indigo-150';
      case 'Fellowship':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Meeting':
        return 'bg-teal-50 text-teal-700 border-teal-150';
      case 'Education':
        return 'bg-sky-50 text-sky-700 border-sky-150';
      case 'Special Event':
        return 'bg-amber-100 text-amber-800 border-amber-250';
      case 'Prayer':
        return 'bg-cyan-50 text-cyan-700 border-cyan-150';
      case 'Training':
        return 'bg-blue-50 text-blue-700 border-blue-150';
      case 'Baptism':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-150';
    }
  };

  // Status Badge Styles
  const getStatusBadgeStyles = (status: EventMock['status']) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-green-50 text-green-700 border-green-150';
      case 'Ongoing':
        return 'bg-blue-50 text-blue-700 border-blue-150';
      case 'Completed':
        return 'bg-gray-50 text-gray-500 border-gray-150';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-150';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-150';
    }
  };

  return (
    <tr
      onClick={onSelect}
      className={`hover:bg-gray-55/45 border-t border-gray-100 group transition-colors cursor-pointer select-none ${
        isSelected ? 'bg-indigo-50/35 group-hover:bg-indigo-50/50' : ''
      }`}
    >
      {/* Event Name */}
      <td className="p-4 pl-6 font-bold text-gray-900 group-hover:text-[#5B3DF5] transition-colors text-xs max-w-[220px]">
        <div>
          <p className="font-bold text-gray-805 leading-tight">{item.name}</p>
          {item.subtitle && (
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-none">{item.subtitle}</p>
          )}
        </div>
      </td>

      {/* Type */}
      <td className="p-4">
        <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold border ${getTypeBadgeStyles(item.type)}`}>
          {item.type}
        </span>
      </td>

      {/* Date & Time */}
      <td className="p-4 text-xs font-bold text-gray-800">
        <div>
          <p>{formatDate(item.date)}</p>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.time}</p>
        </div>
      </td>

      {/* Location */}
      <td className="p-4 text-xs font-semibold text-gray-650 max-w-[150px] truncate" title={item.location}>
        {item.location}
      </td>

      {/* Attendees */}
      <td className="p-4 text-xs font-bold text-gray-600">
        <div className="flex items-center gap-1">
          <span>{item.attendees}</span>
          <User size={13} className="text-gray-400" />
        </div>
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
          <button
            onClick={onEdit}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-[#5B3DF5] transition-colors cursor-pointer"
            title="Edit Event"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-gray-200 p-2 hover:bg-red-50 text-gray-500 hover:text-red-655 transition-colors cursor-pointer"
            title="Delete Event"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
