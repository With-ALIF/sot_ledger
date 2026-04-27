import React from 'react';
import { motion } from 'motion/react';
import { Users, CreditCard, Clock } from 'lucide-react';
import { PartnerSummary } from '../../types';
import { PARTNER_ICONS } from '../../constants';
import { cn } from '../../lib/utils';

interface PartnerPublicStatsProps {
  summaries: PartnerSummary[];
  loading?: boolean;
}

export default function PartnerPublicStats({ summaries, loading = false }: PartnerPublicStatsProps) {
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-slate-200 rounded-full" />
          <div className="h-6 bg-slate-200 rounded w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Filter out system/unassigned if needed, but usually we show all real partners
  const realPartners = summaries.filter(s => s.name !== 'System/Unassigned');
  
  const totalPartnerPaid = realPartners.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalPartnerDue = realPartners.reduce((sum, s) => sum + s.dueAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-800">পার্টনার পেমেন্ট স্ট্যাটাস</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-4 bg-white border-l-4 border-l-emerald-500 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">মোট পরিশোধিত (পার্টনার)</p>
            <p className="text-xl font-black text-slate-800">৳{totalPartnerPaid.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-card p-4 bg-white border-l-4 border-l-red-500 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">মোট বকেয়া (পার্টনার)</p>
            <p className="text-xl font-black text-slate-800">৳{totalPartnerDue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Individual Partner List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {realPartners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4 bg-white border border-slate-100 hover:border-indigo-100 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                <img 
                  src={PARTNER_ICONS[partner.name] || 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png'} 
                  alt={partner.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800 leading-tight">{partner.name}</h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md w-fit">
                  {partner.totalPercentage}% টাস্ক
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">পরিশোধিত:</span>
                <span className="text-emerald-600 font-bold">৳{partner.totalPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">বকেয়া:</span>
                <span className={cn(
                  "font-bold",
                  partner.dueAmount > 0 ? "text-red-500" : "text-emerald-500"
                )}>
                  {partner.dueAmount > 0 ? `৳${partner.dueAmount.toLocaleString()}` : 'পরিশোধিত'}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="pt-1">
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      partner.dueAmount <= 0 ? "bg-emerald-500" : "bg-indigo-500"
                    )}
                    style={{ width: `${Math.min(100, (partner.totalPaid / partner.targetAmount) * 100)}%` }}
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
