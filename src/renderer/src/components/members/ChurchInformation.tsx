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
    { label: "Church Branch", value: member.church || "N/A" },
    { label: "Baptism Status", value: member.isBaptized ? "Baptized" : "Not Baptized" },
    { label: "Baptism Church", value: member.baptismChurch || "N/A" },
    { label: "Baptized By", value: member.baptizedBy || "N/A" },
    { label: "Baptism Date", value: member.baptismDate || "N/A" },
    { label: "Department", value: member.department || "N/A" },
    { label: "Cell Group", value: member.cellGroup || "N/A" },
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
