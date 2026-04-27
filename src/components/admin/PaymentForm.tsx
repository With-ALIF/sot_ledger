import React, { useState } from 'react';
import { PlusCircle, Send, CreditCard, MessageSquare, Smartphone, ClipboardPaste, Sparkles, Loader2, RotateCcw, GraduationCap, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { Payment, PaymentMethod, Course } from '../../types';
import { cn } from '../../lib/utils';
import { PAYMENT_LOGOS, PARTNER_ICONS } from '../../constants';

interface PaymentFormProps {
  onAddPayment: (payment: Omit<Payment, 'id' | 'created_at'>) => Promise<boolean>;
  courses: Course[];
  onLogout?: () => void;
}

const METHODS: PaymentMethod[] = ['Bkash', 'Nagad', 'Rocket', 'Bank', 'Other'];
const PARTNERS = ['ALIF', 'NAIMUR', 'SADMAN'];

export default function PaymentForm({ onAddPayment, courses, onLogout }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    method: 'Bkash' as PaymentMethod,
    phone_number: '',
    label: '',
    message: '',
    partner: '',
    course_id: ''
  });
  const [smsText, setSmsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseSms = (text: string) => {
    const amountMatch = text.match(/Tk\s*([\d,]+\.\d{2}|[\d,]+)/i);
    const phoneMatch = text.match(/(01\d{9})/);
    const trxMatch = text.match(/TrxID\s*([A-Z0-9]+)/i);
    
    // Method detection
    let detectedMethod: PaymentMethod | null = null;
    if (text.toLowerCase().includes('bkash')) detectedMethod = 'Bkash';
    else if (text.toLowerCase().includes('nagad')) detectedMethod = 'Nagad';
    else if (text.toLowerCase().includes('rocket')) detectedMethod = 'Rocket';

    if (amountMatch || phoneMatch || trxMatch || detectedMethod) {
      setFormData(prev => ({
        ...prev,
        amount: amountMatch ? amountMatch[1].replace(/,/g, '') : prev.amount,
        phone_number: phoneMatch ? phoneMatch[0] : prev.phone_number,
        label: text.match(/Label:\s*([^\n]+)/i)?.[1] || prev.label,
        message: trxMatch ? trxMatch[1] : prev.message,
        method: detectedMethod || prev.method
      }));
      return true;
    }
    return false;
  };

  const handleSmsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSmsText(text);
    parseSms(text);
  };

  const handleClear = () => {
    setFormData({
      amount: '',
      method: 'Bkash',
      phone_number: '',
      label: '',
      message: '',
      partner: '',
      course_id: ''
    });
    setSmsText('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.phone_number || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onAddPayment({
      amount: parseFloat(formData.amount),
      method: formData.method,
      phone_number: formData.phone_number,
      label: formData.label || undefined,
      message: formData.message,
      partner: formData.partner || undefined,
      course_id: formData.course_id || undefined
    });

    if (success) {
      setFormData({
        amount: '',
        method: 'Bkash',
        phone_number: '',
        label: '',
        message: '',
        partner: '',
        course_id: ''
      });
      setSmsText('');
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">নতুন পেমেন্ট যোগ করুন</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200 disabled:opacity-50"
            title="ফর্ম ক্লিয়ার করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ক্লিয়ার
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
              title="লগআউট"
            >
              <LogOut className="w-3.5 h-3.5" /> লগআউট
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2">
          <ClipboardPaste className="w-3 h-3" /> SMS পেস্ট করুন (অটো ডিটেক্ট)
        </label>
        <textarea
          value={smsText}
          onChange={handleSmsChange}
          disabled={isSubmitting}
          placeholder="বিকাশ বা নগদের মেসেজটি এখানে পেস্ট করুন..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-20 bg-white disabled:opacity-50"
        />
        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> মেসেজ পেস্ট করলে নম্বর, পরিমাণ এবং TrxID অটোমেটিক বসে যাবে।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> মোবাইল নম্বর
          </label>
          <input
            type="tel"
            required
            disabled={isSubmitting}
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            placeholder="যেমন: 017XXXXXXXX"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <ClipboardPaste className="w-4 h-4" /> লেবেল (ঐচ্ছিক)
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="যেমন: ১ল কিস্তি, পুরাতন স্টুডেন্ট"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <ClipboardPaste className="w-4 h-4" /> লেবেল (ঐচ্ছিক)
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="যেমন: ১ল কিস্তি, পুরাতন স্টুডেন্ট"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <ClipboardPaste className="w-4 h-4" /> লেবেল (ঐচ্ছিক)
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="যেমন: ১ল কিস্তি, পুরাতন স্টুডেন্ট"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> পেমেন্ট মাধ্যম
          </label>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
            {METHODS.map(m => (
              <button
                key={m}
                type="button"
                disabled={isSubmitting}
                onClick={() => setFormData({ ...formData, method: m })}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all",
                  formData.method === m 
                    ? "border-indigo-600 bg-indigo-50 shadow-sm" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                  <img 
                    src={PAYMENT_LOGOS[m]} 
                    alt={m} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-600">{m}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            ৳ পরিমাণ
          </label>
          <input
            type="number"
            required
            disabled={isSubmitting}
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="যেমন: ৫০০"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> কোর্স নির্বাচন করুন
          </label>
          <select
            value={formData.course_id}
            disabled={isSubmitting}
            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white disabled:opacity-50"
          >
            <option value="">কোর্স সিলেক্ট করুন (ঐচ্ছিক)</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> মেসেজ (ঐচ্ছিক)
          </label>
          <textarea
            value={formData.message}
            disabled={isSubmitting}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="অতিরিক্ত তথ্য..."
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24 disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> পার্টনার (ঐচ্ছিক)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PARTNERS.map(p => (
              <button
                key={p}
                type="button"
                disabled={isSubmitting}
                onClick={() => setFormData({ ...formData, partner: formData.partner === p ? '' : p })}
                className={cn(
                  "flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all",
                  formData.partner === p 
                    ? "border-indigo-600 bg-indigo-50 shadow-sm" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-white">
                  <img 
                    src={PARTNER_ICONS[p]} 
                    alt={p} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-bold",
                  formData.partner === p ? "text-indigo-600" : "text-slate-500"
                )}>{p}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> সংরক্ষণ করা হচ্ছে...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> পেমেন্ট সংরক্ষণ করুন
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
