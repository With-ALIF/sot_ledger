import { Payment, PartnerTask, PartnerSummary, PaymentStats } from '../types';

export const calculatePartnerSummaries = (
  payments: Payment[],
  tasks: PartnerTask[],
  stats: PaymentStats
): PartnerSummary[] => {
  const partnerNames = Array.from(new Set([
    ...tasks.map(t => t.partner_name).filter(Boolean),
    'ALIF', 'NAIMUR', 'SADMAN'
  ])) as string[];
  
  const summaries = partnerNames.map(name => {
    const totalPaid = payments
      .filter(p => p.partner === name)
      .reduce((sum, p) => sum + p.amount, 0);
    
    const partnerTasks = tasks.filter(t => t.partner_name === name);
    const totalPercentage = partnerTasks.reduce((sum, t) => sum + t.percentage, 0);
    const targetAmount = (stats.totalAmount * totalPercentage) / 100;

    return {
      name,
      totalPaid,
      targetAmount,
      dueAmount: Math.max(0, targetAmount - totalPaid),
      totalPercentage,
      tasks: partnerTasks
    };
  });

  const assignedPercentage = tasks.reduce((sum, t) => sum + (t.partner_name ? t.percentage : 0), 0);
  if (assignedPercentage < 100) {
    const unassignedPercentage = 100 - assignedPercentage;
    const unassignedTasks = tasks.filter(t => !t.partner_name);
    
    summaries.push({
      name: 'System/Unassigned',
      totalPaid: 0,
      targetAmount: (stats.totalAmount * unassignedPercentage) / 100,
      dueAmount: (stats.totalAmount * unassignedPercentage) / 100,
      totalPercentage: unassignedPercentage,
      tasks: unassignedTasks.map(t => ({ ...t, percentage: t.percentage }))
    });
  }

  return summaries;
};
