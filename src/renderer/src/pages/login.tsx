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
      const { token, user, church, subscription_status, plan } = response.data;

      if (!church) {
        throw new Error('No church associated with this account. Please contact support.');
      }

      // Activate Tenant
      activateApp(church.id.toString(), church.church_name);
      
      // Save Session
      const subStatus = subscription_status || 'active';
      login(user.first_name + ' ' + user.last_name, token, subStatus, plan);

      if (data.remember) {
        localStorage.setItem('remember_login', 'true');
      }
      
      if (subStatus === 'expired' || subStatus === 'cancelled' || subStatus === 'none') {
        router.replace('/subscription-expired');
      } else {
        router.replace('/dashboard');
      }

    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Invalid credentials or server connection failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#070913] text-white selection:bg-violet-500 selection:text-white overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#12092A] via-[#080C1E] to-[#060814]">
        {/* Deep ambient styling with glass overlays and glows */}
        <div className="absolute top-0 left-0 w-full h-full opacity-45 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-900/30 via-[#070B18] to-[#050711]"></div>
        <div className="absolute -bottom-1/6 -right-1/6 w-[550px] h-[550px] bg-violet-600/10 rounded-full blur-[110px]"></div>
        <div className="absolute -top-1/4 -left-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[100px]"></div>

        {/* Diagonal subtle line pattern to feel high-tech and professional */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
          <div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-violet-500/20">
                fc
              </div>
              <div>
                <h1 className="text-3xl tracking-[6px] font-light">
                  FAITH<span className="text-violet-400 font-semibold">CORE</span>
                </h1>
                <p className="text-gray-400 text-xs mt-0.5 font-medium tracking-wide">
                  Empowering Ministry Through Technology
                </p>
              </div>
            </div>
            
            <div className="mt-28 space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-violet-400/80">CHURCH MANAGEMENT CONSOLE</span>
              <h2 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
                One Platform.
              </h2>
              <h2 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
                Every Ministry.
              </h2>
              <h2 className="text-5xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent leading-tight mt-1">
                Stronger Together.
              </h2>
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md max-w-md shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <Shield className="text-violet-400 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-gray-200">Secure. Reliable. Trusted.</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Enterprise-grade protection and database-level isolation for your ministry data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-1 flex-col bg-[#070912] h-full overflow-y-auto">
        {/* Centered wrapper div using my-auto to avoid cutting off the top content on smaller heights */}
        <div className="w-full max-w-lg mx-auto my-auto p-6 sm:p-10 flex flex-col justify-center">
          <div className="w-full rounded-[2.5rem] border border-white/10 bg-[#0E1528]/85 p-8 sm:p-10 shadow-[0_20px_50px_rgba(4,6,15,0.7)] backdrop-blur-2xl relative">
          
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 mb-4 shadow-inner shadow-violet-500/5">
              {role === 'super' ? <Shield className="text-violet-400" size={26} /> : <Users className="text-violet-400" size={26} />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Welcome Back!</h1>
            <p className="mt-2 text-gray-400 text-xs sm:text-sm font-medium">Sign in to continue to FaithCore</p>
          </div>

          {/* Role Toggle */}
          <div className="flex rounded-2xl bg-[#090E1B] p-1.5 mb-8 border border-white/5">
            <button
              type="button"
              onClick={() => handleRoleSwitch('super')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                role === 'super' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield size={15} /> Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('co')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                role === 'co' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={15} /> Co-Admin
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                <p className="text-xs sm:text-sm text-red-400 font-medium">{serverError}</p>
              </div>
            )}

            {/* Church ID / Activation ID */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase ml-1">
                {role === 'super' ? 'Activation ID (Optional)' : 'Church ID'}
              </label>
              <div className="flex h-14 items-center rounded-xl border border-white/5 bg-[#090E1A]/85 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all duration-300">
                <Building2 className="text-gray-500 focus-within:text-violet-400" size={18} />
                <input
                  {...register('churchId')}
                  disabled={loading}
                  className="ml-3 flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
                  placeholder={role === 'super' ? 'Enter Activation ID' : 'Enter Church ID'}
                />
              </div>
              {errors.churchId && <p className="text-red-400 text-xs ml-1 font-medium">{errors.churchId.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase ml-1">Username / Email</label>
              <div className="flex h-14 items-center rounded-xl border border-white/5 bg-[#090E1A]/85 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all duration-300">
                <User className="text-gray-500 focus-within:text-violet-400" size={18} />
                <input
                  {...register('email')}
                  disabled={loading}
                  className="ml-3 flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs ml-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 tracking-wide uppercase ml-1">Password</label>
              <div className="flex h-14 items-center rounded-xl border border-white/5 bg-[#090E1A]/85 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all duration-300">
                <Lock className="text-gray-500 focus-within:text-violet-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  disabled={loading}
                  className="ml-3 flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1 hover:bg-white/5 rounded-md transition-colors">
                  <Eye size={18} className="text-gray-500 hover:text-gray-300" />
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs ml-1 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('remember')}
                  disabled={loading}
                  className="rounded border-white/10 bg-[#090E1A] text-violet-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-violet-600"
                />
                <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-purple-400 hover:shadow-violet-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
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
            <span className="text-[10px] text-gray-500 font-bold tracking-wider">SYSTEM OPTIONS</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-white/5 bg-[#090E1A] h-14 hover:bg-white/5 hover:border-white/10 hover:shadow-md transition-all duration-300 group">
            <WifiOff size={18} className="text-gray-500 group-hover:text-gray-400 transition-colors" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Offline Mode</span>
              <span className="text-[9px] font-medium text-gray-500">Access synced local database</span>
            </div>
          </button>

        </div>
      </div>
      </div>
    </div>
  );
}

LoginPage.noLayout = true;

