import React from 'react';
import { Settings, Server, Database, HardDrive, Users } from 'lucide-react';

export default function SystemOverviewCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-black text-gray-900 mb-6">System Overview</h3>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={16} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">System Version</span>
          </div>
          <span className="text-xs font-bold text-gray-900">v2.3.0</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server size={16} className="text-green-500" />
            <span className="text-xs font-semibold text-gray-600">Environment</span>
          </div>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Production</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database size={16} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">Database Status</span>
          </div>
          <span className="text-xs font-bold text-green-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Healthy
          </span>
        </div>
        
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <HardDrive size={16} className="text-[#5B3DF5]" />
              <span className="text-xs font-semibold text-gray-600">Storage Usage</span>
            </div>
            <span className="text-xs font-bold text-gray-900">42%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#5B3DF5] rounded-full w-[42%]" />
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <Users size={16} className="text-blue-500" />
            <span className="text-xs font-semibold text-gray-600">Active Sessions</span>
          </div>
          <span className="text-xs font-bold text-gray-900">18</span>
        </div>
      </div>
    </div>
  );
}
