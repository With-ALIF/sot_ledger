import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { Course } from '../../types';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { cn } from '../../lib/utils';

export default function CourseSettings() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'courses'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('কোর্স লোড করতে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setError('');

    try {
      if (editingId) {
        await updateDoc(doc(db, 'courses', editingId), { name, logo_url: logoUrl });
      } else {
        await addDoc(collection(db, 'courses'), {
          name, 
          logo_url: logoUrl,
          created_at: new Date().toISOString()
        });
      }

      setName('');
      setLogoUrl('');
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      console.error('Error saving course:', err);
      setError('কোর্স সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setName(course.name);
    setLogoUrl(course.logo_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই কোর্সটি ডিলিট করতে চান?')) return;

    try {
      await deleteDoc(doc(db, 'courses', id));
      fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('কোর্স ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setLogoUrl('');
  };

  return (
    <div className="space-y-8">
      {/* Course Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="bg-indigo-600 px-6 py-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="w-6 h-6" /> {editingId ? 'কোর্স এডিট করুন' : 'নতুন কোর্স যোগ করুন'}
            </h2>
            <p className="text-indigo-100 mt-2 text-sm">
              এখান থেকে আপনি কোর্সের নাম এবং লোগো সেট করতে পারবেন।
            </p>
          </div>
          <GraduationCap className="absolute -right-8 -bottom-8 w-48 h-48 text-indigo-500/20 rotate-12" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" /> কোর্সের নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Web Development"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-500" /> লোগো URL (ঐচ্ছিক)
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                "flex-1 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]",
                isSaving ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
              {isSaving ? 'সেভ হচ্ছে...' : (editingId ? 'আপডেট করুন' : 'কোর্স যোগ করুন')}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Course List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" /> বিদ্যমান কোর্সসমূহ ({courses.length})
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>কোর্স লোড হচ্ছে...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">কোনো কোর্স পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
                      {course.logo_url ? (
                        <img 
                          src={course.logo_url} 
                          alt={course.name} 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Logo';
                          }}
                        />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate">{course.name}</h4>
                      <p className="text-[10px] text-slate-400">ID: {course.id.slice(0, 8)}...</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
