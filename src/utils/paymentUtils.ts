import { Payment, PaymentStats, PaymentMethod } from '../types';

export const calculateStats = (payments: Payment[]): PaymentStats => {
  const initialByMethod: Record<PaymentMethod, number> = {
    Bkash: 0, Nagad: 0, Rocket: 0, Bank: 0, Other: 0
  };

  const partnerPaymentsTotal = payments
    .filter(p => p.partner)
    .reduce((sum, p) => sum + p.amount, 0);

  const baseStats = payments.reduce((acc, curr) => {
    if (!curr.partner) {
      if (!curr.course_id) {
        acc.totalAmount += curr.amount;
        acc.count += 1;
        acc.byMethod[curr.method] = (acc.byMethod[curr.method] || 0) + curr.amount;
      } else {
        acc.totalCourseAmount += curr.amount;
        acc.totalCourseCount += 1;
        acc.byCourse[curr.course_id] = (acc.byCourse[curr.course_id] || 0) + curr.amount;
      }
    }
    return acc;
  }, { 
    totalAmount: 0, 
    count: 0, 
    totalDue: 0, 
    byMethod: initialByMethod, 
    byCourse: {} as Record<string, number>,
    totalCourseAmount: 0,
    totalCourseCount: 0
  });

  baseStats.totalDue = Math.max(0, baseStats.totalAmount - partnerPaymentsTotal);
  return baseStats;
};
