import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { AppSettings, Course } from '../types';

export const settingsService = {
  async fetchSettings() {
    const docRef = doc(db, 'settings', 'main');
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      const defaultSettings = {
        id: 'main',
        telegram_bot_token: '',
        telegram_channel_id: '',
        updated_at: new Date().toISOString()
      };
      // For admins, the saveSettings will actually write it.
      // We don't write here because public users fetching this would get a permission error.
      return defaultSettings as AppSettings;
    }
    return { id: snapshot.id, ...snapshot.data() } as AppSettings;
  },

  async saveSettings(id: string | undefined, newSettings: Partial<AppSettings>) {
    const targetId = id || 'main';
    const docRef = doc(db, 'settings', targetId);
    const updates = {
      ...newSettings,
      updated_at: new Date().toISOString()
    };
    await setDoc(docRef, updates, { merge: true });
    return { id: targetId, ...updates } as AppSettings;
  },

  async fetchCourses() {
    const q = query(collection(db, 'courses'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  }
};
