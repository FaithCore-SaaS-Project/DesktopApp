import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Building2, User, Lock, Eye, ArrowRight, Users, WifiOff, AlertCircle, X, KeyRound, CheckCircle2, Mail } from 'lucide-react';
import api from '../lib/axios';

const loginSchema = z.object({
  churchId: z.string().min(1, 'Church ID / Activation ID is required'),
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

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotChurchId, setForgotChurchId] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

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

      const payload = {
        email: data.email,
        password: data.password,
        church_id: data.churchId
      };

      const response = await api.post('/login', payload);
      const { token, user, church, subscription_status, plan } = response.data;

      if (!church) {
        throw new Error('No church associated with this account. Please contact support.');
      }

      // Activate Tenant
      activateApp(church.id.toString(), church.church_name);
      localStorage.setItem('activationCode', church.registration_no || data.churchId || '');
      
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
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 overflow-hidden bg-white">
                <img src="/logo.jpg" alt="FaithCore Logo" className="w-full h-full object-contain" />
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
                Church ID / Activation ID
              </label>
              <div className="flex h-14 items-center rounded-xl border border-white/5 bg-[#090E1A]/85 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all duration-300">
                <Building2 className="text-gray-500 focus-within:text-violet-400" size={18} />
                <input
                  {...register('churchId')}
                  disabled={loading}
                  className="ml-3 flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
                  placeholder="Enter Church ID or Activation ID"
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
              <button 
                type="button" 
                onClick={() => {
                  setForgotModalOpen(true);
                  setForgotStep('email');
                  setForgotError('');
                }}
                className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
              >
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

      {/* ── FORGOT PASSWORD MODAL ────────────────────────────────────── */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0E1528] p-7 shadow-2xl text-white">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {forgotStep === 'email' && (
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400 mb-4">
                  <KeyRound size={22} />
                </div>
                <h3 className="text-xl font-bold text-white">Reset Your Password</h3>
                <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
                  Enter your Church ID and account email address to receive a secure 6-digit verification code.
                </p>

                {forgotError && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                    {forgotError}
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Church ID / Activation ID
                    </label>
                    <div className="flex h-12 items-center rounded-xl border border-white/10 bg-[#090E1A] px-3.5 focus-within:border-violet-500">
                      <Building2 size={16} className="text-gray-500" />
                      <input
                        type="text"
                        value={forgotChurchId}
                        onChange={(e) => setForgotChurchId(e.target.value)}
                        placeholder="e.g. FC-489195"
                        className="ml-2.5 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Account Email
                    </label>
                    <div className="flex h-12 items-center rounded-xl border border-white/10 bg-[#090E1A] px-3.5 focus-within:border-violet-500">
                      <Mail size={16} className="text-gray-500" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="ml-2.5 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={forgotLoading || !forgotEmail}
                    onClick={async () => {
                      setForgotLoading(true);
                      setForgotError('');
                      try {
                        const res = await api.post('/forgot-password', {
                          email: forgotEmail.trim(),
                          church_id: forgotChurchId.trim() || undefined
                        });
                        setForgotStep('otp');
                      } catch (err: any) {
                        setForgotError(err.response?.data?.message || 'Failed to send OTP. Please check details.');
                      } finally {
                        setForgotLoading(false);
                      }
                    }}
                    className="w-full mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition-all"
                  >
                    {forgotLoading ? (
                      <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Send Verification OTP'
                    )}
                  </button>
                </div>
              </div>
            )}

            {forgotStep === 'otp' && (
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4">
                  <Mail size={22} />
                </div>
                <h3 className="text-xl font-bold text-white">Enter OTP & New Password</h3>
                <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
                  We sent a 6-digit code to <strong className="text-violet-400">{forgotEmail}</strong>. Enter it below with your new password.
                </p>

                {forgotError && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                    {forgotError}
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="123456"
                      className="h-12 w-full text-center tracking-[8px] font-mono text-lg rounded-xl border border-white/10 bg-[#090E1A] text-violet-300 outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      New Password (Min 6 Characters)
                    </label>
                    <div className="flex h-12 items-center rounded-xl border border-white/10 bg-[#090E1A] px-3.5 focus-within:border-violet-500">
                      <Lock size={16} className="text-gray-500" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="ml-2.5 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep('email')}
                      className="h-12 px-4 rounded-xl border border-white/10 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={forgotLoading || forgotOtp.length !== 6 || newPassword.length < 6}
                      onClick={async () => {
                        setForgotLoading(true);
                        setForgotError('');
                        try {
                          const res = await api.post('/reset-password', {
                            email: forgotEmail.trim(),
                            otp: forgotOtp.trim(),
                            password: newPassword
                          });
                          setForgotSuccessMsg(res.data.message || 'Password reset successfully!');
                          setForgotStep('success');
                        } catch (err: any) {
                          setForgotError(err.response?.data?.message || 'Verification failed. Please check your OTP.');
                        } finally {
                          setForgotLoading(false);
                        }
                      }}
                      className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition-all"
                    >
                      {forgotLoading ? (
                        <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {forgotStep === 'success' && (
              <div className="text-center py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Password Updated!</h3>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  {forgotSuccessMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="mt-6 w-full h-12 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

LoginPage.noLayout = true;

