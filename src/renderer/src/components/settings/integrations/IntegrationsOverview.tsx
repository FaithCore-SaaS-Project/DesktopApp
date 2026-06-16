import React from 'react';

const integrations = [
  { name: "QuickBooks Online", description: "Sync your financial data, invoices, payments and more.", color: "bg-green-500", text: "qb" },
  { name: "Mailchimp", description: "Sync members and send email campaigns.", color: "bg-yellow-400", text: "M" },
  { name: "SendGrid", description: "Send transactional emails and manage email delivery.", color: "bg-blue-400", text: "S" },
  { name: "Stripe", description: "Accept online payments and manage subscriptions.", color: "bg-indigo-600", text: "S" },
  { name: "Google Calendar", description: "Sync church events with Google Calendar.", color: "bg-white border border-gray-200", text: "31" },
  { name: "Zoom", description: "Integrate Zoom for online meetings and events.", color: "bg-blue-500", text: "Z" },
  { name: "Slack", description: "Get notifications and updates in your Slack channels.", color: "bg-white border border-gray-200", text: "#" },
  { name: "Twilio SMS", description: "Send and receive SMS messages via Twilio.", color: "bg-red-500", text: "T" }
];

export default function IntegrationsOverview() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-black text-gray-900 mb-1">Connect and manage third-party integrations</h2>
      <p className="text-gray-500 text-xs font-semibold mb-8">Extend the functionality of Kingdom Connect by connecting your favorite tools and services.</p>
      
      <h3 className="text-sm font-black text-gray-900 mb-5">Available Integrations</h3>
      
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {integrations.map((item, index) => (
          <div key={index} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full group">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm ${item.color}`}>
                {item.name === "Google Calendar" || item.name === "Slack" ? (
                  <span className="text-gray-800">{item.text}</span>
                ) : (
                  item.text
                )}
              </div>
              <h4 className="text-[13px] font-bold text-gray-900 leading-tight">{item.name}</h4>
            </div>
            
            <p className="text-[10px] font-semibold text-gray-500 mb-6 flex-1">{item.description}</p>
            
            <div className="flex justify-between items-center mt-auto">
              <button className="border border-gray-200 text-[#5B3DF5] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#5B3DF5]/5 transition-colors cursor-pointer">
                Connect
              </button>
              <button className="text-[#5B3DF5] text-[11px] font-bold flex items-center gap-1 group-hover:text-[#4a30db] transition-colors cursor-pointer">
                Learn more <span className="font-sans">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-6 text-[#5B3DF5] text-xs font-bold flex items-center gap-1 hover:text-[#4a30db] transition-colors cursor-pointer">
        View all integrations <span className="font-sans">→</span>
      </button>
    </div>
  );
}
