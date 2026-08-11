import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, Plus, Trash2 } from 'lucide-react';

export default function ChurchProfileSettings() {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="space-y-0 pb-10 p-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Church Profile</h1>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-2">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <Link href="/settings" className="hover:text-[#5B3DF5] transition-colors">Settings</Link>
            <ChevronRight size={12} />
            <span className="text-[#5B3DF5]">Church Profile</span>
          </nav>
        </div>
        <button className="bg-[#5B3DF5] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-gray-50 border-r border-gray-100 p-4">
          <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} label="1. Basic Information" />
          <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} label="2. Contact & Location" />
          <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} label="3. Service Times" />
          <TabButton active={activeTab === 'ministries'} onClick={() => setActiveTab('ministries')} label="4. Ministries" />
          <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} label="5. Social Media" />
          <TabButton active={activeTab === 'visibility'} onClick={() => setActiveTab('visibility')} label="6. Public Visibility" />
          <TabButton active={activeTab === 'faithcore'} onClick={() => setActiveTab('faithcore')} label="7. FaithCore Settings" />
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8">
          {activeTab === 'basic' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Church Information</h2>
              <Input label="Church Name" placeholder="e.g. Beracah Christian Ministry" defaultValue="Beracah Christian Ministry" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Logo URL</label>
                  <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image URL</label>
                  <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="https://" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">About Church</label>
                <textarea className="w-full p-2 border border-gray-200 rounded-lg text-sm min-h-[100px]" placeholder="Leading people to love God..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Year Established" placeholder="e.g. 2010" />
                <Input label="Senior Pastor" placeholder="e.g. Pastor John" />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact & Location</h2>
              <Input label="Address" placeholder="e.g. 123 Temple Road" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="Colombo" />
                <Input label="Country" placeholder="Sri Lanka" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone Number" placeholder="+94 77 123 4567" />
                <Input label="Email Address" placeholder="hello@church.com" />
              </div>
              <Input label="Website" placeholder="https://www.church.com" />
              <Input label="Google Maps Link" placeholder="https://maps.google.com/..." />
            </div>
          )}

          {activeTab === 'services' && (
            <div className="max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Service Times</h2>
                <button className="text-sm font-bold text-[#5B3DF5] flex items-center gap-1"><Plus size={16}/> Add Service</button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Dynamically add or edit the service times displayed in the mobile app.</p>
              
              <div className="space-y-4">
                {/* Mock dynamic rows */}
                {['Sunday Worship', 'Sunday School', 'Youth Service'].map((svc, i) => (
                  <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex-1"><Input label="Service Name" defaultValue={svc} /></div>
                    <div className="w-32"><Input label="Time" defaultValue="9:00 AM" /></div>
                    <div className="w-32"><Input label="End Time" defaultValue="10:30 AM" /></div>
                    <button className="mt-6 text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ministries' && (
            <div className="max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Ministries</h2>
                <button className="text-sm font-bold text-[#5B3DF5] flex items-center gap-1"><Plus size={16}/> Add Ministry</button>
              </div>
              <div className="space-y-4">
                {['Youth Ministry', 'Worship Ministry'].map((min, i) => (
                  <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex-1"><Input label="Ministry Name" defaultValue={min} /></div>
                    <div className="flex-1"><Input label="Leader Name" defaultValue="John Doe" /></div>
                    <button className="mt-6 text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media</h2>
              <Input label="Facebook URL" placeholder="https://facebook.com/..." />
              <Input label="Instagram URL" placeholder="https://instagram.com/..." />
              <Input label="YouTube URL" placeholder="https://youtube.com/..." />
              <Input label="WhatsApp Number" placeholder="+94 77 123 4567" />
            </div>
          )}

          {activeTab === 'visibility' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Public Church Profile Settings</h2>
              <p className="text-sm text-gray-500 mb-6">Control what information is visible to the public on the Mobile App.</p>
              
              <div className="space-y-3">
                <Toggle label="Show Church Description" defaultChecked />
                <Toggle label="Show Address" defaultChecked />
                <Toggle label="Show Phone Number" defaultChecked />
                <Toggle label="Show Email Address" defaultChecked />
                <Toggle label="Show Service Times" defaultChecked />
                <Toggle label="Show Ministries" defaultChecked />
                <Toggle label="Show Pastor Name" defaultChecked />
                <Toggle label="Show Social Media Links" defaultChecked />
              </div>
            </div>
          )}

          {activeTab === 'faithcore' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6">FaithCore Specific Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Currency</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option>LKR - Sri Lankan Rupee</option>
                    <option>USD - US Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Time Zone</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option>Asia/Colombo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date Format</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white">
                  <option>YYYY-MM-DD</option>
                  <option>DD/MM/YYYY</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition mb-1 ${
        active ? 'bg-indigo-100 text-[#5B3DF5]' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input className="w-full p-2 border border-gray-200 rounded-lg text-sm" {...props} />
    </div>
  );
}

function Toggle({ label, defaultChecked }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <div className={`w-10 h-6 rounded-full p-1 cursor-pointer ${defaultChecked ? 'bg-[#5B3DF5]' : 'bg-gray-300'}`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${defaultChecked ? 'translate-x-4' : ''}`} />
      </div>
    </div>
  );
}
