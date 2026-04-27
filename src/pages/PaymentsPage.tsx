import { useState } from 'react';
import { SortOption } from '../types';
import PaymentList from '../components/public/PaymentList';
import { usePayments } from '../hooks/usePayments';
import { useCourses } from '../hooks/useCourses';
import { useAdminStore } from '../store/useAdminStore';

export default function PaymentsPage() {
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const { sortedPayments, loading } = usePayments(sortOption);
  const { courses } = useCourses();
  const { isAdmin } = useAdminStore();

  return (
    <PaymentList 
      payments={sortedPayments} 
      loading={loading} 
      sortOption={sortOption}
      onSortChange={setSortOption}
      courses={courses}
      isAdmin={isAdmin}
      hideDelete={!isAdmin}
    />
  );
}
