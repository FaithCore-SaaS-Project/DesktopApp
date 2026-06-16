import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const items = [
  { label: "Backup Service", status: "Healthy", color: "text-green-600" },
  { label: "Storage Connection", status: "Healthy", color: "text-green-600" },
  { label: "Recent Backups", status: "Healthy", color: "text-green-600" },
  { label: "Data Integrity", status: "No issues", color: "text-green-600" }
];

export default function BackupHealth() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-5">Backup Health</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-[11px] font-bold text-gray-600">{item.label}</span>
            </div>
            <span className={`text-[11px] font-black ${item.color}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
