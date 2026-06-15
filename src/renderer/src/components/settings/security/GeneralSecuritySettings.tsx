import React, { useState } from 'react';
import { Shield, Lock, Clock3, Mail, Hourglass, Globe, Bell, ChevronDown } from 'lucide-react';

export default function GeneralSecuritySettings() {
  const [toggles, setToggles] = useState({
    enforce2FA: true,
    requireEmail: true,
    ipRestriction: false,
    securityAlerts: true
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#5B3DF5]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );

  const Select = ({ value, options }: { value: string, options: string[] }) => (
    <div className="relative w-40">
      <select 
        defaultValue={value}
        className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2 pl-3 pr-8 text-[11px] font-bold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm"
      >
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  const settings = [
    { key: 'enforce2FA', icon: Shield, title: "Enforce Two-Factor Authentication", desc: "Require all users to set up and use two-factor authentication.", type: "switch" as const },
    { key: 'restrictLogin', icon: Lock, title: "Restrict Login Attempts", desc: "Lock user accounts after a number of failed login attempts.", type: "select" as const, value: "5 attempts", options: ["3 attempts", "5 attempts", "10 attempts"] },
    { key: 'lockoutDuration', icon: Clock3, title: "Account Lockout Duration", desc: "Set how long a locked account remains locked before auto-unlock.", type: "select" as const, value: "30 minutes", options: ["15 minutes", "30 minutes", "1 hour"] },
    { key: 'requireEmail', icon: Mail, title: "Require Email Verification", desc: "Require email verification for new user registrations.", type: "switch" as const },
    { key: 'sessionTimeout', icon: Hourglass, title: "Session Timeout", desc: "Automatically log out inactive users after the selected time.", type: "select" as const, value: "30 minutes", options: ["15 minutes", "30 minutes", "1 hour", "Never"] },
    { key: 'ipRestriction', icon: Globe, title: "IP Restriction", desc: "Restrict system access to specific IP addresses or ranges.", type: "switch" as const },
    { key: 'securityAlerts', icon: Bell, title: "Enable Security Alerts", desc: "Send email alerts for suspicious login attempts and security events.", type: "switch" as const }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-black text-gray-900 mb-1">General Security Settings</h2>
      <p className="text-gray-500 text-xs font-semibold mb-6">Configure general security preferences for your system.</p>
      
      <div className="space-y-0">
        {settings.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-[#5B3DF5]/10 text-[#5B3DF5] flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-0.5">{item.title}</h4>
                  <p className="text-[10px] font-semibold text-gray-500">{item.desc}</p>
                </div>
              </div>
              
              <div className="ml-4 shrink-0">
                {item.type === 'switch' ? (
                  <Toggle 
                    checked={toggles[item.key as keyof typeof toggles]} 
                    onChange={() => handleToggle(item.key as keyof typeof toggles)} 
                  />
                ) : (
                  <Select value={item.value!} options={item.options!} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6">
        <button className="bg-[#5B3DF5] hover:bg-[#4a30db] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-[#5B3DF5]/20 transition-colors cursor-pointer">
          Save Changes
        </button>
      </div>
    </div>
  );
}
