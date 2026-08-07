import React, { useState, useEffect } from 'react';
import { Mail, Plus, CreditCard, Search, ArrowRight, MessageSquare, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../lib/axios';

interface SmsDashboard {
  monthly_limit: number;
  monthly_used: number;
  topup_balance: number;
  sender_id: string;
}

export default function SmsCenter() {
  const [dashboard, setDashboard] = useState<SmsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [buying, setBuying] = useState(false);

  // Send form state
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [topupAmount, setTopupAmount] = useState(500);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/sms/dashboard');
      if (res.data) {
        setDashboard(res.data);
      }
    } catch (e: any) {
      console.error('Failed to fetch SMS dashboard', e?.message || 'Error occurred');
      // Set dummy dashboard if backend fails so it doesn't get stuck loading
      setDashboard({
        monthly_limit: 0,
        monthly_used: 0,
        topup_balance: 0,
        sender_id: 'UNKNOWN'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.post('/sms/send', {
        contacts: [phone],
        message
      });
      setSuccessMsg('Message sent successfully!');
      setPhone('');
      setMessage('');
      fetchDashboard();
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleBuy = async () => {
    setBuying(true);
    try {
      await api.post('/sms/topup', {
        amount: topupAmount
      });
      alert(`Successfully added ${topupAmount} SMS credits!`);
      fetchDashboard();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to buy topup.');
    } finally {
      setBuying(false);
    }
  };

  if (loading || !dashboard) {
    return <div className="p-8 text-slate-500">Loading SMS Center...</div>;
  }

  const freeRemaining = Math.max(0, dashboard.monthly_limit - dashboard.monthly_used);
  const freePercent = dashboard.monthly_limit > 0 
    ? (dashboard.monthly_used / dashboard.monthly_limit) * 100 
    : 100;

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-violet-600" size={24} /> SMS Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your SMS quotas and send quick messages to members.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-100">
          <ShieldCheck size={18} />
          Sender ID: {dashboard.sender_id}
        </div>
      </div>

      {/* Quota Dashboard */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Quota Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Monthly Free SMS</h3>
              <p className="text-xs text-slate-500 mt-0.5">Renews on your billing cycle date</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Mail size={24} />
            </div>
          </div>
          
          <div className="mb-2 flex justify-between items-end">
            <span className="text-3xl font-black text-slate-900">{freeRemaining}</span>
            <span className="text-sm font-semibold text-slate-500 mb-1">/ {dashboard.monthly_limit} left</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${freePercent > 90 ? 'bg-red-500' : 'bg-violet-600'}`}
              style={{ width: `${Math.min(100, freePercent)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-3 text-right">
            {dashboard.monthly_used} SMS used this month
          </p>
        </div>

        {/* Top-up Balance Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-2xl border border-indigo-800 p-6 shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="font-bold text-white text-lg">Top-up SMS Balance</h3>
              <p className="text-xs text-indigo-200 mt-0.5">Purchased credits never expire</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md">
              <CreditCard size={24} />
            </div>
          </div>

          <div className="text-4xl font-black text-white mb-6 relative z-10">
            {dashboard.topup_balance.toLocaleString()} <span className="text-lg font-medium text-indigo-200">credits</span>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <select 
              value={topupAmount}
              onChange={(e) => setTopupAmount(Number(e.target.value))}
              className="bg-black/20 border border-white/20 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-white/40 font-semibold"
            >
              <option value={500} className="text-slate-900">500 SMS (Rs. 500)</option>
              <option value={1000} className="text-slate-900">1,000 SMS (Rs. 1,000)</option>
              <option value={2000} className="text-slate-900">2,000 SMS (Rs. 2,000)</option>
              <option value={5000} className="text-slate-900">5,000 SMS (Rs. 5,000)</option>
            </select>
            <button 
              onClick={handleBuy}
              disabled={buying}
              className="flex-1 bg-white hover:bg-slate-50 text-indigo-900 font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {buying ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Send Message Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <Plus size={18} className="text-violet-600" /> Quick Send SMS
          </h2>
        </div>
        <form onSubmit={handleSend} className="p-6 space-y-6">
          
          {successMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-2">
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Recipient Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. +94771234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-medium"
                />
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-xs text-indigo-800 leading-relaxed font-medium">
                Tip: You can use the Members page to send bulk SMS messages to entire departments or groups.
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Message Content</label>
              <textarea 
                required
                rows={5}
                placeholder="Type your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-medium resize-none"
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-400 font-medium">{message.length} characters</span>
                <button 
                  type="submit"
                  disabled={sending || !message || !phone}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-violet-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {sending ? 'Sending...' : 'Send SMS'} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}

const CheckCircle = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
