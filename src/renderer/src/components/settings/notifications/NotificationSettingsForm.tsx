import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function NotificationSettingsForm() {
  const [toggles, setToggles] = useState({
    enableAll: true,
    email: true,
    sms: true,
    inApp: true,
    digest: false,
    adminAlerts: true
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

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-black text-gray-900 mb-1">General Notification Settings</h2>
      <p className="text-gray-500 text-xs font-semibold mb-8">Configure how and when notifications are sent.</p>
      
      <div className="grid md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="space-y-6">
          {[
            { key: 'enableAll', title: "Enable Notifications", desc: "Turn on or off all system notifications." },
            { key: 'email', title: "Email Notifications", desc: "Send notifications via email." },
            { key: 'sms', title: "SMS Notifications", desc: "Send notifications via SMS." },
            { key: 'inApp', title: "In-App Notifications", desc: "Show notifications inside the application." },
            { key: 'digest', title: "Digest Summary", desc: "Send a daily summary of notifications." },
            { key: 'adminAlerts', title: "Allow Admin Alerts", desc: "Send important alerts to administrators." }
          ].map((item) => (
            <div key={item.key} className="flex gap-4 items-start">
              <div className="pt-0.5">
                <Toggle 
                  checked={toggles[item.key as keyof typeof toggles]} 
                  onChange={() => handleToggle(item.key as keyof typeof toggles)} 
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* RIGHT */}
        <div className="space-y-6">
          <div>
            <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Default Sender Email</label>
            <input
              type="email"
              defaultValue="noreply@kingdomconnect.org"
              className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-900 outline-none focus:border-[#5B3DF5] shadow-sm"
            />
            <p className="text-[9px] font-semibold text-gray-400 mt-1.5">This email will be used for all outgoing notifications.</p>
          </div>
          
          <div>
            <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Default Sender Name</label>
            <input
              type="text"
              defaultValue="Kingdom Connect"
              className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-900 outline-none focus:border-[#5B3DF5] shadow-sm"
            />
            <p className="text-[9px] font-semibold text-gray-400 mt-1.5">This name will appear as the sender.</p>
          </div>
          
          <div>
            <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Reply-To Email (Optional)</label>
            <input
              type="email"
              defaultValue="support@kingdomconnect.org"
              className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-900 outline-none focus:border-[#5B3DF5] shadow-sm"
            />
            <p className="text-[9px] font-semibold text-gray-400 mt-1.5">Replies to email notifications will go to this address.</p>
          </div>
          
          <div>
            <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Notification Language</label>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm">
                <option>English (US)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-[9px] font-semibold text-gray-400 mt-1.5">Default language for all notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
