import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Logo from '../public/Logo';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => void;
  error?: string;
}

export default function AdminLogin({ onLogin, error }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 sm:p-8 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo className="h-16 w-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">এডমিন লগইন</h2>
          <p className="text-slate-500 text-sm mt-1 text-center">
            পেমেন্ট তথ্য যুক্ত করতে এডমিন ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">ইমেইল</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-200"
          >
            <LogIn className="w-5 h-5" /> লগইন করুন
          </button>
        </form>
      </motion.div>
    </div>
  );
}
