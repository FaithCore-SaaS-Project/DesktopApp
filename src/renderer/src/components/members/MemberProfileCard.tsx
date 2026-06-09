import React from 'react';
import { Phone, Mail, Calendar, Shield, MapPin } from "lucide-react";
import { MemberMock } from '../../services/mockData';

interface MemberProfileCardProps {
  member: MemberMock & {
    photoUrl?: string;
    memberId?: string;
    dob?: string;
    nic?: string;
    address?: string;
  };
}

export default function MemberProfileCard({ member }: MemberProfileCardProps) {
  const memberCode = member.memberId || `MEM-2025-${member.id.replace('mem-', '').padStart(5, '0')}`;
  
  // Dynamic role styling
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Pastor':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Elder':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Deacon':
        return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case 'Volunteer':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Visitor':
        return 'bg-slate-50 text-slate-700 border-slate-100';
      default: // Member
        return 'bg-purple-50 text-purple-700 border-purple-100';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Inactive':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default: // Archived
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const roleText = member.role === 'Member' ? 'Baptized Member' : member.role;
  const avatarUrl = member.photoUrl || `https://i.pravatar.cc/300?u=${member.id}`;

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <span className={`px-3.5 py-1 rounded-xl text-xs font-bold border ${getStatusBadgeStyle(member.status)}`}>
          {member.status}
        </span>
      </div>
      
      <div className="flex flex-col items-center mt-4">
        <img
          src={avatarUrl}
          alt={member.name}
          className="h-32 w-32 rounded-full object-cover border-4 border-slate-50 shadow-sm transition-transform duration-300 hover:scale-105"
        />
        <h2 className="mt-5 text-2xl font-extrabold text-gray-900 text-center leading-tight">
          {member.name}
        </h2>
        <p className="text-[#5B3DF5] font-bold text-sm mt-1.5 font-mono">
          {memberCode}
        </p>
        <span className={`mt-4 rounded-xl px-4 py-1.5 text-xs font-bold border ${getRoleBadgeStyle(member.role)}`}>
          {roleText}
        </span>
      </div>

      <div className="mt-8 space-y-5 border-t border-gray-100 pt-6">
        <InfoItem icon={<Phone size={18} className="text-gray-400" />} value={member.phone} />
        <InfoItem icon={<Mail size={18} className="text-gray-400" />} value={member.email} />
        <InfoItem icon={<Calendar size={18} className="text-gray-400" />} value={member.dob || '15 May 1990'} />
        <InfoItem icon={<Shield size={18} className="text-gray-400" />} value={member.nic || '901234567V'} />
        <InfoItem icon={<MapPin size={18} className="text-gray-400" />} value={member.address || 'Kandy, Sri Lanka'} />
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  value: string;
}

function InfoItem({ icon, value }: InfoItemProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors">
      <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
        {icon}
      </div>
      <span className="truncate">{value}</span>
    </div>
  );
}
