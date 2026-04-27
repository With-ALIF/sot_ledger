import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from '../../components/public/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAdmin } = useAdminStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('ইমেইল এবং পাসওয়ার্ড দিন।');
      return;
    }

    setIsLoading(true);
    setLoginError('');
    try {
      // Try signing in first
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user.email) {
          setIsAdmin(true);
          navigate('/admin');
        }
      } catch (signInErr: any) {
        // If it fails with 'invalid-credential' or 'user-not-found', and the email is the specific admin email, try to create the account
        const errCode = signInErr.code;
        if (
          (errCode === 'auth/invalid-credential' || errCode === 'auth/user-not-found') 
          && email === 'alif@mnr.bd'
        ) {
          try {
            const createResult = await createUserWithEmailAndPassword(auth, email, password);
            if (createResult.user.email) {
              setIsAdmin(true);
              navigate('/admin');
            }
          } catch (createErr: any) {
            if (createErr.code === 'auth/operation-not-allowed') {
              setLoginError('Firebase কনসোল থেকে Email/Password Authentication চালু করতে হবে।');
            } else {
              setLoginError('অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে: ' + createErr.message);
            }
          }
        } else {
          setLoginError('ভুল ইমেইল বা পাসওয়ার্ড, আবার চেষ্টা করুন।');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError('লগইন করতে সমস্যা হয়েছে। ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-8">
      <div className="text-center space-y-4">
        <Logo className="h-16 w-auto mx-auto" />
        <h1 className="text-2xl font-black text-slate-800">অ্যাডমিন প্যানেল</h1>
        <p className="text-slate-500">আপনার ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
      >
        {loginError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 hover:scale-110 transition-transform" />
            <p>{loginError}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">ইমেইল</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              placeholder="admin@example.com"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
