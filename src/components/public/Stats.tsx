import { motion } from 'motion/react';
import { Wallet, TrendingUp, Users, GraduationCap } from 'lucide-react';
import { PaymentStats, PaymentMethod, Course } from '../../types';
import { PAYMENT_LOGOS } from '../../constants';

interface StatsProps {
  stats: PaymentStats;
  courses?: Course[];
  loading?: boolean;
}

export default function Stats({ stats, courses = [], loading = false }: StatsProps) {
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 mb-8">
      {/* General/Old Payments Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 px-1">
          <Wallet className="w-4 h-4" /> সাধারণ পেমেন্ট (General/Old)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ y: -2 }}
            className="glass-card p-4 sm:p-6 flex items-center gap-4 border-l-4 border-l-indigo-500"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center overflow-hidden border border-indigo-100 shadow-sm">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxBWiRfd_7-2ZNE9DgxB6PWsWP15o2Ce5fhA&s" 
                alt="Payment" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">মোট সাধারণ পেমেন্ট</p>
              <p className="text-2xl font-bold text-slate-900">৳{stats.totalAmount.toFixed(2)}</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="glass-card p-4 sm:p-6 flex items-center gap-4 border-l-4 border-l-emerald-500"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center overflow-hidden border border-emerald-100 shadow-sm">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3135/3135810.png" 
                alt="Student" 
                className="w-full h-full object-cover p-1"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">মোট সাধারণ শিক্ষার্থী</p>
              <p className="text-2xl font-bold text-slate-900">{stats.count}</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="glass-card p-4 sm:p-6 flex items-center gap-4 border-l-4 border-l-amber-500"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center overflow-hidden border border-amber-100 shadow-sm">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMhAI-tIdvmxWrq0-SobP0M7d68zh_Rd8LHw&s" 
                alt="Due" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">বকেয়া পেমেন্ট (General)</p>
              <p className="text-2xl font-bold text-red-600">
                ৳{stats.totalDue.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Method Specific Stats (General only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['Bkash', 'Nagad', 'Rocket', 'Bank'] as PaymentMethod[]).map((method) => (
            <motion.div 
              key={method}
              whileHover={{ y: -2 }}
              className={`glass-card p-4 flex items-center gap-3 ${
                method === 'Bkash' ? 'bg-pink-50/50 border-pink-100' :
                method === 'Nagad' ? 'bg-orange-50/50 border-orange-100' :
                method === 'Rocket' ? 'bg-purple-50/50 border-purple-100' :
                'bg-blue-50/50 border-blue-100'
              }`}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md bg-white flex items-center justify-center">
                <img 
                  src={PAYMENT_LOGOS[method]} 
                  alt={method} 
                  className="w-full h-full object-contain p-1"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  method === 'Bkash' ? 'text-pink-600' :
                  method === 'Nagad' ? 'text-orange-600' :
                  method === 'Rocket' ? 'text-purple-700' :
                  'text-blue-600'
                }`}>
                  {method === 'Bkash' ? 'বিকাশ' :
                   method === 'Nagad' ? 'নগদ' :
                   method === 'Rocket' ? 'রকেট' :
                   'ব্যাংক'}
                </p>
                <p className="text-lg font-bold text-slate-900">৳{stats.byMethod[method].toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Course Specific Stats Section */}
      {courses.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> কোর্স ভিত্তিক পেমেন্ট (New Courses)
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">মোট কোর্স পেমেন্ট</p>
                <p className="text-lg font-bold text-emerald-600">৳{stats.totalCourseAmount.toFixed(2)}</p>
              </div>
              <div className="text-right border-l border-slate-200 pl-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase">মোট কোর্স শিক্ষার্থী</p>
                <p className="text-lg font-bold text-indigo-600">{stats.totalCourseCount}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => {
              const amount = stats.byCourse[course.id] || 0;
              if (amount === 0) return null;
              return (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -2 }}
                  className="glass-card p-4 flex items-center gap-4 bg-emerald-50/30 border-emerald-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                    {course.logo_url ? (
                      <img src={course.logo_url} alt={course.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                    ) : (
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-emerald-700 truncate">{course.name}</p>
                    <p className="text-lg font-bold text-slate-900">৳{amount.toFixed(2)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
