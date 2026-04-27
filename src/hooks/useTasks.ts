import { useState, useEffect } from 'react';
import { PartnerTask } from '../types';
import { taskService } from '../services/taskService';

const DEFAULT_TASKS: Omit<PartnerTask, 'id'>[] = [
  { category: 'Maker', sub_category: 'Content Creation', percentage: 66, partner_name: null },
  { category: 'Question Bank', sub_category: 'QB Management', percentage: 24, partner_name: null },
  { category: 'Management', sub_category: 'Operations', percentage: 10, partner_name: null },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<PartnerTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.fetchTasks();
      if (data && data.length > 0) {
        setTasks(data);
      } else {
        const insertedData = await taskService.resetTasks(DEFAULT_TASKS);
        setTasks(insertedData);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAssignTask = async (taskId: string, partnerName: string | null) => {
    try {
      await taskService.updateTask(taskId, { partner_name: partnerName });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, partner_name: partnerName } : t));
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('টাস্ক অ্যাসাইন করতে সমস্যা হয়েছে।');
    }
  };

  const handleCreateTask = async (task: Omit<PartnerTask, 'id' | 'created_at'>) => {
    try {
      const data = await taskService.createTask(task);
      if (data) {
        setTasks(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('টাস্ক তৈরি করতে সমস্যা হয়েছে।');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই টাস্কটি মুছে ফেলতে চান?')) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('টাস্ক মুছতে সমস্যা হয়েছে।');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<PartnerTask>) => {
    try {
      await taskService.updateTask(taskId, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('টাস্ক আপডেট করতে সমস্যা হয়েছে।');
    }
  };

  const handleResetTasks = async () => {
    if (!confirm('আপনি কি নিশ্চিত যে সব টাস্ক মুছে ফেলে ডিফল্ট টাস্কগুলো (Maker 66%, QB 24%, Management 10%) সেট করতে চান?')) return;
    try {
      setLoading(true);
      const data = await taskService.resetTasks(DEFAULT_TASKS);
      setTasks(data);
      alert('টাস্কগুলো সফলভাবে রিসেট করা হয়েছে।');
    } catch (error) {
      console.error('Error resetting tasks:', error);
      alert('রিসেট করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    setTasks,
    loading,
    fetchTasks,
    handleAssignTask,
    handleCreateTask,
    handleDeleteTask,
    handleUpdateTask,
    handleResetTasks
  };
};
