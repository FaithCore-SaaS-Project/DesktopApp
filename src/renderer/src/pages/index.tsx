import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';

export default function IndexPage() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-medium tracking-wide">Loading workspace...</p>
      </div>
    </div>
  );
}
