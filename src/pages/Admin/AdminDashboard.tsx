import { Link } from 'react-router-dom';
import Stats from '../../components/public/Stats';
import { usePayments } from '../../hooks/usePayments';
import { useCourses } from '../../hooks/useCourses';
import { motion } from 'motion/react';
import { Plus, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { stats, loading } = usePayments('date-desc');
  const { courses } = useCourses();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" /> এডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-slate-500 text-sm">আপনার ব্যবসার বর্তমান অবস্থা এবং পেমেন্ট ম্যানেজমেন্ট</p>
        </div>
        
        <Link
          to="/admin/add-payment"
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus className="w-5 h-5" /> নতুন পেমেন্ট রেকর্ড
        </Link>
      </div>

      <Stats stats={stats} courses={courses} loading={loading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <Link to="/admin/add-payment" className="text-indigo-600 hover:underline text-sm font-bold flex items-center gap-1">
              শুরু করুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">নতুন পেমেন্ট যুক্ত করুন</h3>
          <p className="text-slate-500 text-sm">সহজেই নতুন পেমেন্ট রেকর্ড করুন এবং টেলিগ্রামে নোটিফিকেশন পাঠান।</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <Link to="/admin/payments" className="text-emerald-600 hover:underline text-sm font-bold flex items-center gap-1">
              দেখুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">পেমেন্ট রেকর্ড দেখুন</h3>
          <p className="text-slate-500 text-sm">সকল পেমেন্ট রেকর্ড ফিল্টার করুন, এডিট করুন এবং পিডিএফ ডাউনলোড করুন।</p>
        </motion.div>
      </div>
    </div>
  );
}
