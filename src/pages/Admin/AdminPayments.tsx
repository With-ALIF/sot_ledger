import { useState } from 'react';
import PaymentList from '../../components/public/PaymentList';
import { usePayments } from '../../hooks/usePayments';
import { useCourses } from '../../hooks/useCourses';
import { paymentService } from '../../services/paymentService';
import { SortOption, Payment } from '../../types';

export default function AdminPayments() {
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const { sortedPayments, setPayments, loading } = usePayments(sortOption);
  const { courses } = useCourses();

  const handleDeletePayment = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই পেমেন্টটি মুছে ফেলতে চান?')) return;
    try {
      await paymentService.deletePayment(id);
      setPayments(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('পেমেন্ট ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  const handleBulkDeletePayment = async (ids: string[]) => {
    if (!confirm(`${ids.length}টি পেমেন্ট মুছে ফেলতে চান?`)) return;
    try {
      await paymentService.bulkDeletePayments(ids);
      setPayments(prev => prev.filter(p => !ids.includes(p.id)));
    } catch (error) {
      console.error('Error bulk deleting payments:', error);
      alert('পেমেন্টগুলো ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  const handleUpdatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const data = await paymentService.updatePayment(id, updates);
      if (data) {
        setPayments(prev => prev.map(p => p.id === id ? data : p));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('পেমেন্ট আপডেট করতে সমস্যা হয়েছে।');
      return false;
    }
  };

  return (
    <PaymentList 
      payments={sortedPayments} 
      loading={loading} 
      sortOption={sortOption}
      onSortChange={setSortOption}
      isAdmin={true}
      onDeletePayment={handleDeletePayment}
      onBulkDelete={handleBulkDeletePayment}
      onUpdatePayment={handleUpdatePayment}
      courses={courses}
    />
  );
}
