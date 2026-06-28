import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Building2, User, Lock, Eye, ArrowRight, Users, WifiOff, AlertCircle } from 'lucide-react';
import api from '../lib/axios';

const loginSchema = z.object({
  churchId: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});
type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, activateApp, isActivated } = useApp();
  const router = useRouter();
  
  // Toggle state
  const [role, setRole] = useState<'super' | 'co'>('super');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true },
  });

  // If not activated, app guard handles it. But double check.
  useEffect(() => {
    if (isActivated === false && typeof window !== 'undefined') {
      const tid = localStorage.getItem('tenantId');
      if (!tid) router.replace('/activation');
    }
  }, [isActivated, router]);

  // Handle Role switch to reset errors/fields
  const handleRoleSwitch = (newRole: 'super' | 'co') => {
    setRole(newRole);
    setServerError('');
    reset();
  };

  const onSubmit = async (data: LoginSchema) => {
    try {
      setLoading(true);
      setServerError('');

      if (role === 'co' && !data.churchId) {
        setServerError('Church ID is required for Co-Admin login.');
        setLoading(false);
        return;
      }

      // We use Option A: Single Endpoint intelligently handled by Laravel
      // We pass the email, password, and optionally church_id.
      const payload = {
        email: data.email,
        password: data.password,
        ...(role === 'co' && { church_id: data.churchId })
      };

      const response = await api.post('/login', payload);
      const { token, user, church } = response.data;

      if (!church) {
        throw new Error('No church associated with this account. Please contact support.');
      }

      // Activate Tenant
      activateApp(church.id.toString(), church.church_name);
      
      // Save Session
      login(user.first_name + ' ' + user.last_name, token);

      if (data.remember) {
        localStorage.setItem('remember_login', 'true');
      }
      
      router.replace('/dashboard');

    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Invalid credentials or server connection failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0B1020] text-white selection:bg-violet-500 selection:text-white">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#140B2D] to-[#0A1022]">
        {/* Deep ambient styling instead of image */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-900/40 via-[#0B1020] to-[#0A1022]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 flex flex-col justify-between p-14 w-full h-full">
          <div>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center font-extrabold text-white text-2xl shadow-lg shadow-violet-500/20">
                fc
              </div>
              <div>
                <h1 className="text-4xl tracking-[8px] font-light">
                  FAITH<span className="text-violet-400 font-medium">CORE</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Empowering Ministry Through Technology
                </p>
              </div>
            </div>
            
            <div className="mt-24 space-y-2">
              <h2 className="text-5xl font-semibold">One Platform.</h2>
              <h2 className="text-5xl font-semibold">Every Ministry.</h2>
              <h2 className="text-5xl font-bold text-violet-400">Stronger Together.</h2>
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm max-w-md">
            <div className="flex items-center gap-4">
              <Shield className="text-violet-400 h-8 w-8" />
              <div>
                <h3 className="font-semibold text-lg">Secure. Reliable. Trusted.</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Enterprise-grade protection for your ministry data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-lg rounded-[2rem] border border-white/5 bg-white/5 p-8 sm:p-10 backdrop-blur-xl relative">
          
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 mb-5">
              {role === 'super' ? <Shield className="text-violet-400" size={32} /> : <Users className="text-violet-400" size={32} />}
            </div>
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="mt-2 text-gray-400 text-sm">Sign in to continue to FaithCore</p>
          </div>

          {/* Role Toggle */}
          <div className="flex rounded-xl bg-[#121A2D] p-1.5 mb-8 border border-white/5">
            <button
              type="button"
              onClick={() => handleRoleSwitch('super')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                role === 'super' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield size={16} /> Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('co')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                role === 'co' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={16} /> Co-Admin
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-400">{serverError}</p>
              </div>
            )}

            {/* Church ID / Activation ID (Show for both or adapt label) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 ml-1">
                {role === 'super' ? 'Activation ID (Optional)' : 'Church ID'}
              </label>
              <div className="flex h-14 items-center rounded-xl border border-white/10 bg-[#121A2D] px-4 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
                <Building2 className="text-gray-500" size={18} />
                <input
                  {...register('churchId')}
                  disabled={loading}
                  className="ml-3 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-600"
                  placeholder={role === 'super' ? 'Enter Activation ID' : 'Enter Church ID'}
                />
              </div>
              {errors.churchId && <p className="text-red-400 text-xs ml-1">{errors.churchId.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 ml-1">Username / Email</label>
              <div className="flex h-14 items-center rounded-xl border border-white/10 bg-[#121A2D] px-4 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
                <User className="text-gray-500" size={18} />
                <input
                  {...register('email')}
                  disabled={loading}
                  className="ml-3 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-600"
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 ml-1">Password</label>
              <div className="flex h-14 items-center rounded-xl border border-white/10 bg-[#121A2D] px-4 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
                <Lock className="text-gray-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  disabled={loading}
                  className="ml-3 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-600"
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1 hover:bg-white/5 rounded-md">
                  <Eye size={18} className="text-gray-500 hover:text-gray-300" />
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('remember')}
                  disabled={loading}
                  className="rounded border-white/10 bg-[#121A2D] text-violet-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Offline Mode Button */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs text-gray-500 font-medium">SYSTEM OPTIONS</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-white/5 bg-[#121A2D] h-14 hover:bg-white/5 hover:border-white/10 transition-colors group">
            <WifiOff size={18} className="text-gray-500 group-hover:text-gray-400" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white">Offline Mode</span>
              <span className="text-[10px] text-gray-500">Access synced local database</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}

LoginPage.noLayout = true;

