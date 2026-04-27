import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PartnerSummary } from '../../types';
import { cn } from '../../lib/utils';
import { PARTNER_ICONS } from '../../constants';

interface PartnerStatsProps {
  summaries: PartnerSummary[];
  totalRevenue?: number;
  loading?: boolean;
}

export default function PartnerStats({ summaries, totalRevenue, loading = false }: PartnerStatsProps) {
  const calculatedTotalRevenue = totalRevenue ?? summaries.reduce((sum, s) => sum + s.targetAmount, 0);
  const totalPaid = summaries.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalDue = summaries.reduce((sum, s) => sum + s.dueAmount, 0);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-800">পার্টনার পেমেন্ট সামারি</h2>
        </div>
      </div>

      {/* Revenue Distribution Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 bg-white border-l-4 border-l-indigo-600 border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">মোট অর্জিত পেমেন্ট (Income)</p>
          <p className="text-xl font-black text-indigo-600">৳{calculatedTotalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 bg-white border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">মোট ডিস্ট্রিবিউশন টার্গেট</p>
          <p className="text-xl font-black text-slate-800">৳{calculatedTotalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 bg-white border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">মোট পরিশোধিত (Payout)</p>
          <p className="text-xl font-black text-emerald-600">৳{totalPaid.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 bg-white border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">মোট বকেয়া (Total Due)</p>
          <p className="text-xl font-black text-red-600">৳{(calculatedTotalRevenue - totalPaid).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaries.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-5 relative overflow-hidden group"
          >
            {/* Background Accent */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img 
                      src={PARTNER_ICONS[partner.name] || 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png'} 
                      alt={partner.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{partner.name}</h3>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md w-fit">
                      {partner.totalPercentage}% টাস্ক
                    </span>
                  </div>
                </div>
                {partner.dueAmount <= 0 ? (
                  <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Assigned Tasks List */}
              <div className="mb-4 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">অ্যাসাইন করা টাস্কসমূহ</p>
                {partner.tasks && partner.tasks.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {partner.tasks.map(task => (
                      <span 
                        key={task.id} 
                        className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                        title={`${task.category}: ${task.sub_category}`}
                      >
                        {task.sub_category} ({task.percentage}%)
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] italic text-slate-400">কোনো টাস্ক অ্যাসাইন করা নেই</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase">মোট পরিশোধ</span>
                  <span className="text-lg font-bold text-indigo-600">৳{partner.totalPaid.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase">টার্গেট পেমেন্ট</span>
                  <span className="text-sm font-medium text-slate-600">৳{partner.targetAmount.toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">বাকি (Due)</span>
                  <span className={cn(
                    "text-base font-black px-3 py-1 rounded-lg",
                    partner.dueAmount <= 0 
                      ? "bg-emerald-50 text-emerald-600" 
                      : "bg-red-50 text-red-600"
                  )}>
                    {partner.dueAmount <= 0 ? 'পরিশোধিত' : `৳${partner.dueAmount.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">
                  <span>অগ্রগতি</span>
                  <span>{Math.min(100, Math.round((partner.totalPaid / partner.targetAmount) * 100))}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (partner.totalPaid / partner.targetAmount) * 100)}%` }}
                    className={cn(
                      "h-full transition-all duration-1000",
                      partner.dueAmount <= 0 ? "bg-emerald-500" : "bg-indigo-500"
                    )}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
