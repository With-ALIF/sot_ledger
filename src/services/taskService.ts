import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch, query, orderBy } from 'firebase/firestore';
import { PartnerTask } from '../types';

export const taskService = {
  async fetchTasks() {
    const q = query(collection(db, 'partner_tasks'), orderBy('category', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PartnerTask));
  },

  async createTask(task: Omit<PartnerTask, 'id' | 'created_at'>) {
    const newTask = {
      ...task,
      created_at: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'partner_tasks'), newTask);
    return { id: docRef.id, ...newTask } as PartnerTask;
  },

  async updateTask(taskId: string, updates: Partial<PartnerTask>) {
    const taskRef = doc(db, 'partner_tasks', taskId);
    await updateDoc(taskRef, updates);
    return { id: taskId, ...updates } as PartnerTask;
  },

  async deleteTask(taskId: string) {
    await deleteDoc(doc(db, 'partner_tasks', taskId));
  },

  async resetTasks(defaultTasks: Omit<PartnerTask, 'id'>[]) {
    // 1. Get all tasks to delete
    const snapshot = await getDocs(collection(db, 'partner_tasks'));
    
    // 2. Prepare batch delete & insert
    const batch = writeBatch(db);
    
    // Delete all
    snapshot.docs.forEach(d => {
      batch.delete(d.ref);
    });

    const addedTasks: PartnerTask[] = [];

    // Insert defaults
    defaultTasks.forEach(t => {
      const docRef = doc(collection(db, 'partner_tasks'));
      const newTask = { ...t, created_at: new Date().toISOString() };
      batch.set(docRef, newTask);
      addedTasks.push({ id: docRef.id, ...newTask } as PartnerTask);
    });

    await batch.commit();
    return addedTasks;
  }
};
