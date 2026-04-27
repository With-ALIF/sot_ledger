import { usePayments } from '../../hooks/usePayments';
import { useCourses } from '../../hooks/useCourses';
import { useSettings } from '../../hooks/useSettings';
import { paymentService } from '../../services/paymentService';
import { sendPaymentNotification } from '../../services/telegramService';
import { Payment } from '../../types';
import PaymentForm from '../../components/admin/PaymentForm';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PlusCircle, ArrowLeft } from 'lucide-react';

export default function AddPaymentPage() {
  const { payments, setPayments } = usePayments('date-desc');
  const { courses } = useCourses();
  const { appSettings } = useSettings();
  const navigate = useNavigate();

  const handleAddPayment = async (newPayment: Omit<Payment, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      // Check for duplicate TrxID (stored in message field)
      if (newPayment.message && newPayment.message.trim() !== '') {
        const isDuplicate = payments.some(p => 
          p.message && p.message.trim().toLowerCase() === newPayment.message?.trim().toLowerCase()
        );
        
        if (isDuplicate) {
          alert('এই ট্রানজেকশন আইডি (TrxID) পূর্বে ইনপুট দেওয়া হয়েছে। দয়া করে ভিন্ন আইডি যুক্ত পেমেন্ট তথ্য দিন।');
          return false;
        }
      }

      const data = await paymentService.addPayment(newPayment);
      
      if (data) {
        setPayments(prev => [data, ...prev]);
        // Send Telegram Notification (Background) - Only if NOT a partner payment
        if (!data.partner) {
          const courseName = courses.find(c => c.id === data.course_id)?.name;
          sendPaymentNotification(data, appSettings, courseName).then(result => {
            if (!result.success) {
              console.error('Telegram Notification Failed:', result.error);
            }
          });
        }
        alert('পেমেন্ট সফলভাবে রেকর্ড করা হয়েছে!');
        navigate('/admin/payments');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error adding payment:', error);
      alert(`পেমেন্ট সেভ করতে সমস্যা হয়েছে: ${error.message}`);
      return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </button>
        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <PlusCircle className="w-4 h-4" /> নতুন এন্ট্রি
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-800">নতুন পেমেন্ট রেকর্ড</h1>
          <p className="text-slate-500 text-sm">সঠিক তথ্য দিয়ে পেমেন্ট এন্ট্রি সম্পন্ন করুন</p>
        </div>
        
        <PaymentForm onAddPayment={handleAddPayment} courses={courses} />
      </motion.div>
    </div>
  );
}
