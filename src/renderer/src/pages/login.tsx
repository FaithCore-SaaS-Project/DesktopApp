import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from 'next/router';
import { Shield, KeyRound, Building2, AlertCircle } from 'lucide-react';
import api from '../lib/axios';

export default function LoginPage() {
  const { login, activateApp, churchName, isActivated } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If not activated, our AppLayout route guard will redirect to /activation,
  // but we also double-check here just in case.
  useEffect(() => {
    if (isActivated === false && typeof window !== 'undefined') {
      const tid = localStorage.getItem('tenantId');
      if (!tid) {
        router.replace('/activation');
      }
    }
  }, [isActivated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Please enter both email and password.');
      }

      // Real API POST /api/login
      const response = await api.post('/login', {
        email,
        password
      });

      const { token, user, church } = response.data;

      if (!church) {
        throw new Error('No church associated with this account. Please contact support.');
      }

      // Activate the specific tenant scope for this user
      activateApp(church.id.toString(), church.church_name);
      
      // Save the session token and username
      login(user.first_name + ' ' + user.last_name, token);
      
      // Redirect to dashboard
      router.replace('/dashboard');

    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Login failed. Please verify your credentials or server connection.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-[#5B3DF5] selection:text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3224B8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5B3DF5]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#3224B8] to-[#5B3DF5] flex items-center justify-center font-extrabold text-white text-3xl shadow-lg shadow-[#5B3DF5]/20 mb-4 select-none">
            KC
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent select-none">
            Kingdom Connect
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-bold tracking-wide flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <Building2 size={12} className="text-[#5B3DF5]" />
            <span>{churchName || 'Beracah Christian Ministry'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <AlertCircle size={16} className="min-w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold text-gray-400 flex items-center space-x-1.5">
              <Shield className="h-3.5 w-3.5 text-[#5B3DF5]" />
              <span>Email Address</span>
            </label>
            <input
              id="email"
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kingdomconnect.org"
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-[#5B3DF5] focus:ring-1 focus:ring-[#5B3DF5] rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-bold text-gray-400 flex items-center space-x-1.5">
              <KeyRound className="h-3.5 w-3.5 text-[#5B3DF5]" />
              <span>Password</span>
            </label>
            <input
              id="password"
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-[#5B3DF5] focus:ring-1 focus:ring-[#5B3DF5] rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-405 select-none">
              <input
                type="checkbox"
                disabled={loading}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-850 bg-slate-950 text-[#5B3DF5] focus:ring-0 cursor-pointer h-4 w-4"
              />
              <span>Remember Me</span>
            </label>
            <a href="#" className="text-xs font-semibold text-[#5B3DF5] hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#3224B8] to-[#5B3DF5] hover:from-[#2e21ad] hover:to-[#4e32e0] text-white font-bold text-sm shadow-lg shadow-[#5B3DF5]/15 hover:shadow-[#5B3DF5]/25 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <p className="text-[10px] text-slate-600 text-center mt-8 font-mono">
          Secured with SHA-256 local isolation. Offline DB is active.
        </p>
      </div>
    </div>
  );
}
// Do not render default sidebar layout for login page
LoginPage.noLayout = true;
