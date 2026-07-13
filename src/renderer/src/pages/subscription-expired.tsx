import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { isElectron } from '../services/api';

export default function SubscriptionExpiredPage() {
  const { logout, churchName } = useApp();

  const handleRenewNow = () => {
    // Open the SaaS website portal to renew
    const portalUrl = 'https://faithcore.org/login';
    if (isElectron()) {
      window.open(portalUrl, '_blank');
    } else {
      window.location.href = portalUrl;
    }
  };

  const handleContactSupport = () => {
    // Open standard email or website contact page
    const mailtoUrl = 'mailto:support@faithcore.org?subject=FaithCore Subscription Renewal';
    if (isElectron()) {
      window.open(mailtoUrl, '_blank');
    } else {
      window.location.href = mailtoUrl;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070913] text-white overflow-hidden relative font-sans">
      {/* Ambient background styling */}
      <div className="absolute top-0 left-0 w-full h-full opacity-45 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-red-900/25 via-[#070B18] to-[#050711]"></div>
      <div className="absolute -bottom-1/6 -right-1/6 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[110px]"></div>
      <div className="absolute -top-1/4 -left-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10 w-full max-w-md p-6 sm:p-10 flex flex-col justify-center">
        <div className="w-full rounded-[2.5rem] border border-white/10 bg-[#0E1528]/85 p-8 sm:p-10 shadow-[0_20px_50px_rgba(4,6,15,0.7)] backdrop-blur-2xl text-center">
          
          {/* Logo & Header */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <ShieldAlert size={32} />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Subscription Expired
          </h1>
          
          <p className="text-gray-400 text-xs sm:text-sm font-medium mb-6 leading-relaxed">
            Your FaithCore subscription for <span className="text-red-400 font-bold">{churchName || 'your church'}</span> has expired or been cancelled.
          </p>

          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={handleRenewNow}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:from-red-500 hover:to-purple-500 hover:shadow-red-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
            >
              <CreditCard size={18} />
              Renew Now
            </button>

            <button
              onClick={handleContactSupport}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#090E1A] h-14 hover:bg-white/5 hover:border-white/15 transition-all duration-300"
            >
              <HelpCircle size={18} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-300">Contact Support</span>
            </button>
            
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/5 bg-transparent h-14 hover:bg-white/5 transition-all duration-300 text-gray-500 hover:text-white"
            >
              <LogOut size={16} />
              <span className="text-xs font-semibold">Sign Out</span>
            </button>
          </div>

          {/* Bottom helper text */}
          <div className="mt-8 flex items-center gap-4 justify-center">
            <span className="text-[10px] text-gray-500 font-semibold tracking-wider">
              FAITHCORE CHURCH MANAGEMENT
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

SubscriptionExpiredPage.noLayout = true;
