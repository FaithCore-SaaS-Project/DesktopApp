import React from 'react';
import { Shield, UserCog, Users, FileDown, Crown, Calendar, Heart, Eye } from 'lucide-react';

export default function UsersSidebar() {
  return (
    <div className="space-y-6">
      {/* Roles Overview */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-gray-900">Roles Overview</h3>
          <button className="text-[10px] font-bold text-[#5B3DF5] hover:underline cursor-pointer">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Super Admin', count: 2, icon: Crown, color: 'text-purple-600' },
            { name: 'Administrator', count: 3, icon: Shield, color: 'text-blue-500' },
            { name: 'Ministry Leader', count: 6, icon: UserCog, color: 'text-teal-500' },
            { name: 'Event Manager', count: 4, icon: Calendar, color: 'text-red-500' },
            { name: 'Finance Manager', count: 2, icon: Shield, color: 'text-green-500' },
            { name: 'Member Services', count: 5, icon: Heart, color: 'text-purple-500' },
            { name: 'Department User', count: 60, icon: Users, color: 'text-gray-500' },
            { name: 'Viewer', count: 4, icon: Eye, color: 'text-orange-400' }
          ].map((role, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <role.icon size={14} className={role.color} />
                <span className="text-xs font-semibold text-gray-600">{role.name}</span>
              </div>
              <span className="text-[10px] font-bold text-[#5B3DF5]">{role.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-gray-900">Recent Activity</h3>
          <button className="text-[10px] font-bold text-[#5B3DF5] hover:underline cursor-pointer">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { initial: 'S', bg: 'bg-green-100 text-green-700', name: 'Sarah Johnson', action: 'Updated user permissions', time: 'Today, 09:10 AM' },
            { initial: 'P', bg: 'bg-purple-100 text-purple-700', name: 'Pastor John', action: 'Added new user: Olivia Martinez', time: 'Today, 08:45 AM' },
            { initial: 'M', bg: 'bg-teal-100 text-teal-700', name: 'Michael Peters', action: 'Changed role: Daniel Wilson', time: 'Yesterday, 07:15 PM' },
            { initial: 'E', bg: 'bg-orange-100 text-orange-700', name: 'Emily Davis', action: 'Deactivated user: James Carter', time: 'Yesterday, 05:20 PM' }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-bold text-[10px] ${item.bg}`}>
                {item.initial}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-gray-900 truncate">{item.name}</h4>
                  <span className="text-[9px] font-semibold text-gray-400 shrink-0 ml-2">{item.time}</span>
                </div>
                <p className="text-[10px] font-medium text-gray-500 truncate">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold text-gray-600 border border-gray-100 hover:text-[#5B3DF5] hover:bg-gray-50 rounded-xl transition-colors shadow-sm">
            <UserCog size={14} className="text-[#5B3DF5]" />
            Create New Role
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold text-gray-600 border border-gray-100 hover:text-[#5B3DF5] hover:bg-gray-50 rounded-xl transition-colors shadow-sm">
            <Shield size={14} className="text-[#5B3DF5]" />
            Manage Permissions
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold text-gray-600 border border-gray-100 hover:text-[#5B3DF5] hover:bg-gray-50 rounded-xl transition-colors shadow-sm">
            <Users size={14} className="text-[#5B3DF5]" />
            Import Users
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold text-gray-600 border border-gray-100 hover:text-[#5B3DF5] hover:bg-gray-50 rounded-xl transition-colors shadow-sm">
            <FileDown size={14} className="text-[#5B3DF5]" />
            Download Users Report
          </button>
        </div>
      </div>
    </div>
  );
}
