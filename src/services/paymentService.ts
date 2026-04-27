import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { Payment } from '../types';

export const paymentService = {
  async fetchPayments() {
    const q = query(collection(db, 'payments'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
  },

  async addPayment(newPayment: Omit<Payment, 'id' | 'created_at'>) {
    const payment = {
      ...newPayment,
      created_at: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'payments'), payment);
    return { id: docRef.id, ...payment } as Payment;
  },

  async deletePayment(id: string) {
    await deleteDoc(doc(db, 'payments', id));
  },

  async bulkDeletePayments(ids: string[]) {
    const batch = writeBatch(db);
    ids.forEach(id => {
      batch.delete(doc(db, 'payments', id));
    });
    await batch.commit();
  },

  async updatePayment(id: string, updates: Partial<Payment>) {
    const paymentRef = doc(db, 'payments', id);
    await updateDoc(paymentRef, updates);
    return { id, ...updates } as Payment; // Note: partial data return
  }
};
