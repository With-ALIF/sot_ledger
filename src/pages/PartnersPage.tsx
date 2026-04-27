import { useMemo } from 'react';
import PartnerPublicStats from '../components/public/PartnerPublicStats';
import { usePayments } from '../hooks/usePayments';
import { useTasks } from '../hooks/useTasks';
import { calculatePartnerSummaries } from '../utils/partnerUtils';

export default function PartnersPage() {
  const { payments, stats, loading: paymentsLoading } = usePayments('date-desc');
  const { tasks, loading: tasksLoading } = useTasks();

  const summaries = useMemo(() => {
    return calculatePartnerSummaries(payments, tasks, stats);
  }, [payments, tasks, stats]);

  return (
    <PartnerPublicStats 
      summaries={summaries} 
      loading={paymentsLoading || tasksLoading} 
    />
  );
}
