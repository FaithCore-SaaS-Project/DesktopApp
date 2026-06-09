import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from 'next/router';
import { Shield, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ActivationPage() {
  const { activateApp } = useApp();
  const router = useRouter();
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API POST /api/activate
    try {
      // We wrap the API call in a promise to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const codeTrimmed = activationCode.trim();

      if (!codeTrimmed) {
        throw new Error('Please enter a valid activation code.');
      }

      // Mock response payload
      const mockResponse = {
        success: true,
        tenantId: "TENANT_001",
        churchName: "Beracah Christian Ministry"
      };

      setSuccess(true);
      
      // Store in local storage via AppContext
      activateApp(mockResponse.tenantId, mockResponse.churchName);

      // Brief delay to show success animation before redirecting
      setTimeout(() => {
        router.replace('/login');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Activation failed. Please check your internet connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-[#5B3DF5] selection:text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3224B8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5B3DF5]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#3224B8] to-[#5B3DF5] flex items-center justify-center font-extrabold text-white text-3xl shadow-lg shadow-[#5B3DF5]/20 mb-4 select-none">
            K
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent select-none">
            Kingdom Connect
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 uppercase tracking-widest font-semibold">
            Product Activation
          </p>
        </div>

        {success ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 animate-bounce" />
            <h2 className="text-xl font-bold text-white">Software Activated!</h2>
            <p className="text-sm text-gray-400 max-w-xs">
              Welcome to <strong>Beracah Christian Ministry</strong>. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="activationCode" className="text-xs font-bold text-gray-400 flex items-center space-x-1.5">
                <Shield className="h-3.5 w-3.5 text-[#5B3DF5]" />
                <span>License / Activation Code</span>
              </label>
              <input
                id="activationCode"
                type="text"
                required
                disabled={loading}
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="Enter your 16-character code"
                className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-[#5B3DF5] focus:ring-1 focus:ring-[#5B3DF5] rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none transition-all placeholder:text-slate-600 font-mono tracking-wider uppercase text-center"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#3224B8] to-[#5B3DF5] hover:from-[#2e21ad] hover:to-[#4e32e0] text-white font-bold text-sm shadow-lg shadow-[#5B3DF5]/15 hover:shadow-[#5B3DF5]/25 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Activate License</span>
              )}
            </button>
          </form>
        )}

        <p className="text-[10px] text-slate-600 text-center mt-8 font-mono">
          System ID: SECURE-DESKTOP-{typeof window !== 'undefined' ? window.navigator.userAgent.length : 'NODE'}
        </p>
      </div>
    </div>
  );
}
