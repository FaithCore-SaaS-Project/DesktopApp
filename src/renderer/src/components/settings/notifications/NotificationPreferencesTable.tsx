import React, { useState } from 'react';

export default function NotificationPreferencesTable() {
  const [data, setData] = useState([
    { type: "New Member Registration", desc: "Receive notifications when a new member registers.", email: true, sms: false, inApp: true },
    { type: "Donation Received", desc: "Receive notifications for new donations.", email: true, sms: true, inApp: true },
    { type: "Event Registration", desc: "Receive notifications for event registrations.", email: true, sms: false, inApp: true },
    { type: "Payment Reminders", desc: "Receive payment due and reminder notifications.", email: true, sms: true, inApp: false },
    { type: "System Alerts", desc: "Receive important system alerts and updates.", email: true, sms: true, inApp: true }
  ]);

  const toggleCheck = (index: number, field: 'email' | 'sms' | 'inApp') => {
    const newData = [...data];
    newData[index][field] = !newData[index][field];
    setData(newData);
  };

  const Checkbox = ({ checked, onClick }: { checked: boolean, onClick: () => void }) => (
    <div className="flex justify-center">
      <div 
        onClick={onClick}
        className={`w-4 h-4 rounded shadow-sm border flex items-center justify-center cursor-pointer transition-colors ${
          checked ? 'bg-[#5B3DF5] border-[#5B3DF5]' : 'bg-white border-gray-300'
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 shadow-sm">
      <h2 className="text-lg font-black text-gray-900 mb-1">Notification Preferences</h2>
      <p className="text-gray-500 text-xs font-semibold mb-6">Choose what types of notifications you want to receive.</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 text-[11px] font-bold text-gray-900 uppercase tracking-wider w-1/2">Notification Type</th>
              <th className="py-3 text-[11px] font-bold text-gray-900 uppercase tracking-wider text-center">Email</th>
              <th className="py-3 text-[11px] font-bold text-gray-900 uppercase tracking-wider text-center">SMS</th>
              <th className="py-3 text-[11px] font-bold text-gray-900 uppercase tracking-wider text-center">In-App</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 pr-4">
                  <h4 className="text-xs font-bold text-gray-900">{item.type}</h4>
                  <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{item.desc}</p>
                </td>
                <td className="py-4 align-middle">
                  <Checkbox checked={item.email} onClick={() => toggleCheck(index, 'email')} />
                </td>
                <td className="py-4 align-middle">
                  <Checkbox checked={item.sms} onClick={() => toggleCheck(index, 'sms')} />
                </td>
                <td className="py-4 align-middle">
                  <Checkbox checked={item.inApp} onClick={() => toggleCheck(index, 'inApp')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <button className="bg-[#5B3DF5] hover:bg-[#4a30db] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-[#5B3DF5]/20 transition-colors cursor-pointer">
          Save Changes
        </button>
      </div>
    </div>
  );
}
