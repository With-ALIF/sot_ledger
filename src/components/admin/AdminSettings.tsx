import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, Bot, MessageSquare, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';
import { AppSettings } from '../../types';
import { cn } from '../../lib/utils';

interface AdminSettingsProps {
  settings: AppSettings | null;
  onSave: (settings: Partial<AppSettings>) => Promise<boolean>;
  onLogout?: () => void;
  loading?: boolean;
}

export default function AdminSettings({ settings, onSave, onLogout, loading = false }: AdminSettingsProps) {
  const [botToken, setBotToken] = useState('');
  const [channelId, setChannelId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setBotToken(settings.telegram_bot_token || '');
      setChannelId(settings.telegram_channel_id || '');
    }
  }, [settings]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const success = await onSave({
        telegram_bot_token: botToken,
        telegram_channel_id: channelId,
      });

      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError('সেটিংস সেভ করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      setError('একটি অজানা সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-pulse">
        <div className="bg-slate-200 h-32" />
        <div className="p-8 space-y-6">
          <div className="h-12 bg-slate-100 rounded-2xl" />
          <div className="h-12 bg-slate-100 rounded-2xl" />
          <div className="h-16 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
    >
      <div className="bg-indigo-600 px-6 py-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6" /> টেলিগ্রাম বট সেটিংস
          </h2>
          <p className="text-indigo-100 mt-2 text-sm">
            এখান থেকে আপনি আপনার টেলিগ্রাম বট এবং চ্যানেলের তথ্য পরিবর্তন করতে পারবেন।
          </p>
        </div>
        <Bot className="absolute -right-8 -bottom-8 w-48 h-48 text-indigo-500/20 rotate-12" />
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>সেটিংস সফলভাবে আপডেট করা হয়েছে!</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-500" /> Telegram Bot Token
            </label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="e.g. 123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800 font-mono text-sm"
              required
            />
            <p className="text-[10px] text-slate-400">
              বটফাদার (@BotFather) থেকে প্রাপ্ত আপনার বটের এপিআই টোকেনটি এখানে দিন।
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" /> Telegram Channel ID
            </label>
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="e.g. -100123456789"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800 font-mono text-sm"
              required
            />
            <p className="text-[10px] text-slate-400">
              আপনার চ্যানেলের আইডিটি এখানে দিন। আইডি সাধারণত '-' দিয়ে শুরু হয়।
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={cn(
            "w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]",
            isSaving ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'সেভ হচ্ছে...' : 'সেটিংস সেভ করুন'}
        </button>

        {onLogout && (
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-4 rounded-2xl text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all border border-red-100"
            >
              <LogOut className="w-5 h-5" />
              লগআউট করুন
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
}
