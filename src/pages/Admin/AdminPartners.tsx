import { useMemo } from 'react';
import PartnerStats from '../../components/admin/PartnerStats';
import TaskManagement from '../../components/admin/TaskManagement';
import { usePayments } from '../../hooks/usePayments';
import { useTasks } from '../../hooks/useTasks';
import { calculatePartnerSummaries } from '../../utils/partnerUtils';

export default function AdminPartners() {
  const { payments, stats, loading: paymentsLoading } = usePayments('date-desc');
  const { 
    tasks, 
    loading: tasksLoading, 
    handleAssignTask, 
    handleCreateTask, 
    handleDeleteTask, 
    handleUpdateTask, 
    handleResetTasks 
  } = useTasks();

  const summaries = useMemo(() => {
    return calculatePartnerSummaries(payments, tasks, stats);
  }, [payments, tasks, stats]);

  return (
    <div className="space-y-12">
      <PartnerStats 
        summaries={summaries} 
        loading={paymentsLoading || tasksLoading} 
      />
      
      <TaskManagement 
        tasks={tasks}
        onAssignTask={handleAssignTask}
        onCreateTask={handleCreateTask}
        onDeleteTask={handleDeleteTask}
        onUpdateTask={handleUpdateTask}
        onResetTasks={handleResetTasks}
        loading={tasksLoading}
      />
    </div>
  );
}
