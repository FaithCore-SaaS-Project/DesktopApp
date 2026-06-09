import React from 'react';
import { MemberMock } from '../../services/mockData';

interface ChurchInformationProps {
  member: MemberMock & {
    church?: string;
    baptismDate?: string;
    baptizedBy?: string;
    department?: string;
    cellGroup?: string;
  };
}

export default function ChurchInformation({ member }: ChurchInformationProps) {
  const fields = [
    { label: "Church", value: member.church || "Grace Fellowship Church" },
    { label: "Baptism Date", value: member.baptismDate || "12 March 2023" },
    { label: "Baptized By", value: member.baptizedBy || "Pastor John" },
    { label: "Department", value: member.department || "Worship Ministry" },
    { label: "Cell Group", value: member.cellGroup || "Kandy Cell Group 2" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col h-full">
      <h2 className="font-extrabold text-lg text-gray-900 mb-6">
        Church Information
      </h2>
      <div className="space-y-4 flex-1">
        {fields.map((field, index) => (
          <div key={index} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">{field.label}</span>
            <span className="text-gray-800 font-semibold text-right">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
