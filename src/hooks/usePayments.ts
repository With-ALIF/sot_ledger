import { useState, useEffect, useMemo } from 'react';
import { Payment, SortOption, PaymentStats, PaymentMethod } from '../types';
import { paymentService } from '../services/paymentService';

export const usePayments = (sortOption: SortOption) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.fetchPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const sortedPayments = useMemo(() => {
    return [...payments].sort((a, b) => {
      switch (sortOption) {
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [payments, sortOption]);

  const stats = useMemo<PaymentStats>(() => {
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
  }, [payments]);

  return {
    payments,
    setPayments,
    loading,
    fetchPayments,
    sortedPayments,
    stats
  };
};
