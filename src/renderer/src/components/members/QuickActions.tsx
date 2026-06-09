import React from 'react';
import { useRouter } from 'next/router';
import { FileText, Award, Receipt, Notebook, UserCheck } from 'lucide-react';
import { MemberMock } from '../../services/mockData';

interface QuickActionsProps {
  member: MemberMock;
}

export default function QuickActions({ member }: QuickActionsProps) {
  const router = useRouter();

  const actions = [
    {
      label: "Send Letter",
      icon: FileText,
      color: "text-blue-500 bg-blue-50 border-blue-100",
      onClick: () => router.push(`/letters?memberId=${member.id}&name=${encodeURIComponent(member.name)}`)
    },
    {
      label: "Generate Certificate",
      icon: Award,
      color: "text-amber-500 bg-amber-50 border-amber-100",
      onClick: () => router.push(`/certificates?name=${encodeURIComponent(member.name)}`)
    },
    {
      label: "View E-Receipts",
      icon: Receipt,
      color: "text-emerald-500 bg-emerald-50 border-emerald-100",
      onClick: () => router.push(`/finance/e-receipts?search=${encodeURIComponent(member.name)}`)
    },
    {
      label: "Add Note",
      icon: Notebook,
      color: "text-purple-500 bg-purple-50 border-purple-100",
      onClick: () => alert(`Feature "Add Note" for ${member.name} simulated!`)
    },
    {
      label: "Record Attendance",
      icon: UserCheck,
      color: "text-indigo-500 bg-indigo-50 border-indigo-100",
      onClick: () => alert(`Attendance for ${member.name} successfully recorded!`)
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col h-full">
      <h2 className="font-extrabold text-lg text-gray-900 mb-6">
        Quick Actions
      </h2>
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={action.onClick}
              className="w-full flex items-center gap-3.5 border border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 text-left text-sm font-bold text-gray-700 hover:text-gray-900 transition-all active:scale-[0.99]"
            >
              <div className={`p-2 rounded-lg border ${action.color}`}>
                <Icon size={16} />
              </div>
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
