import React from 'react';

export default function NotificationPreview() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-black text-gray-900 mb-1">Notification Preview</h3>
      <p className="text-gray-500 text-xs font-semibold mb-5">
        This is how email notifications will appear.
      </p>
      
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 border-b border-gray-200 p-4 text-[11px] space-y-2.5">
          <div className="flex">
            <span className="w-14 font-bold text-gray-700">From:</span>
            <span className="text-[#5B3DF5] font-semibold">
              Kingdom Connect &lt;noreply@kingdomconnect.org&gt;
            </span>
          </div>
          <div className="flex">
            <span className="w-14 font-bold text-gray-700">To:</span>
            <span className="text-gray-900 font-semibold">user@example.com</span>
          </div>
          <div className="flex">
            <span className="w-14 font-bold text-gray-700">Subject:</span>
            <span className="font-bold text-gray-900">New Donation Received</span>
          </div>
        </div>
        
        <div className="p-5 text-[11px] leading-relaxed text-gray-700 font-medium">
          <p>Hello,</p>
          <p className="mt-4">
            You have received a new donation of <span className="font-bold text-gray-900">$250.00</span>.
          </p>
          <p className="mt-4">Thank you!</p>
          <p className="mt-6 text-gray-500 font-semibold">— Kingdom Connect Team</p>
        </div>
      </div>
    </div>
  );
}
