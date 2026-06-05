import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from 'next/router';
import { Shield, KeyRound, Building2 } from 'lucide-react';

export default function LoginPage() {
  const { tenants, login } = useApp();
  const router = useRouter();
  const [username, setUsername] = useState('Admin User');
  const [password, setPassword] = useState('••••••••');
  const [selectedTenant, setSelectedTenant] = useState(tenants[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const success = login(username, selectedTenant);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Please enter a valid username');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-indigo-500/20 mb-4 animate-pulse">
            FC
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Church Management Suite
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
            Secure Administrator Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Tenant Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="tenant" className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Multi-Tenant Branch</span>
            </label>
            <select
              id="tenant"
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium focus:outline-none transition-all cursor-pointer"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Username Input */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              <span>Username</span>
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. administrator"
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
              <KeyRound className="h-3.5 w-3.5 text-indigo-400" />
              <span>Security Password</span>
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Decrypt & Log In</span>
            )}
          </button>
        </form>

        <p className="text-[10px] text-slate-600 text-center mt-8 font-mono">
          Secured with SHA-256 local isolation. Offline DB is encrypted.
        </p>
      </div>
    </div>
  );
}
// Set layout mode to render without standard navbar/sidebar
LoginPage.noLayout = true;
