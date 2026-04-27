import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import Stats from '../components/public/Stats';
import { usePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';
import { useCourses } from '../hooks/useCourses';
import { sendSummaryNotification } from '../services/telegramService';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { useAdminStore } from '../store/useAdminStore';

export default function Dashboard() {
  const { stats, payments, loading: paymentsLoading } = usePayments('date-desc');
  const { appSettings } = useSettings();
  const { courses, loading: coursesLoading } = useCourses();
  const { isAdmin } = useAdminStore();
  const [sendingSummary, setSendingSummary] = useState(false);
  const [summarySent, setSummarySent] = useState(false);

  const loading = paymentsLoading || coursesLoading;

  const handleSendSummary = async () => {
    try {
      setSendingSummary(true);
      const result = await sendSummaryNotification(stats, appSettings);
      if (result.success) {
        setSummarySent(true);
        setTimeout(() => setSummarySent(false), 3000);
      } else {
        alert(`সামারি পাঠাতে সমস্যা হয়েছে: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending summary:', error);
      alert('একটি অজানা সমস্যা হয়েছে।');
    } finally {
      setSendingSummary(false);
    }
  };

  return (
    <div className="space-y-8">
      {isAdmin && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSendSummary}
            disabled={sendingSummary || payments.length === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border",
              summarySent 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {sendingSummary ? (
              <>সামারি পাঠানো হচ্ছে...</>
            ) : summarySent ? (
              <>সামারি পাঠানো হয়েছে!</>
            ) : (
              <>
                <Send className="w-4 h-4" /> টেলিগ্রামে সামারি পাঠান
              </>
            )}
          </button>
        </motion.div>
      )}

      <Stats stats={stats} courses={courses} loading={loading} />
    </div>
  );
}
