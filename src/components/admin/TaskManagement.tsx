import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, ClipboardList, Edit2, Plus, Trash2, User, X } from 'lucide-react';
import { PartnerTask } from '../../types';
import { cn } from '../../lib/utils';
import { PARTNER_ICONS } from '../../constants';

interface TaskManagementProps {
  tasks: PartnerTask[];
  onAssignTask: (taskId: string, partnerName: string | null) => Promise<void>;
  onCreateTask: (task: Omit<PartnerTask, 'id' | 'created_at'>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUpdateTask: (taskId: string, updates: Partial<PartnerTask>) => Promise<void>;
  onResetTasks: () => Promise<void>;
  loading?: boolean;
}

const PARTNERS = ['ALIF', 'NAIMUR', 'SADMAN'];

export default function TaskManagement({ 
  tasks, 
  onAssignTask, 
  onCreateTask, 
  onDeleteTask, 
  onUpdateTask, 
  onResetTasks,
  loading = false
}: TaskManagementProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [newSubCategory, setNewSubCategory] = React.useState('');
  const [newPercentage, setNewPercentage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  const [editCategory, setEditCategory] = React.useState('');
  const [editSubCategory, setEditSubCategory] = React.useState('');
  const [editPercentage, setEditPercentage] = React.useState('');

  const categories = Array.from(new Set(tasks.map(t => t.category)));

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          <div className="h-10 bg-slate-200 rounded-xl w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const startEditing = (task: PartnerTask) => {
    setEditingTaskId(task.id);
    setEditCategory(task.category);
    setEditSubCategory(task.sub_category);
    setEditPercentage(task.percentage.toString());
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId) return;

    setIsSubmitting(true);
    try {
      await onUpdateTask(editingTaskId, {
        category: editCategory,
        sub_category: editSubCategory,
        percentage: parseFloat(editPercentage)
      });
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newSubCategory || !newPercentage) return;

    setIsSubmitting(true);
    try {
      await onCreateTask({
        category: newCategory,
        sub_category: newSubCategory,
        percentage: parseFloat(newPercentage),
        partner_name: null
      });
      setNewCategory('');
      setNewSubCategory('');
      setNewPercentage('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAddForm = () => (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="glass-card p-6 mb-8 border-indigo-100 bg-indigo-50/30"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-600" /> নতুন টাস্ক যোগ করুন
        </h3>
        <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">ক্যাটাগরি (যেমন: Question Maker)</label>
          <input 
            type="text" 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">সাব-ক্যাটাগরি (যেমন: Physics)</label>
          <input 
            type="text" 
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            placeholder="Sub-category"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">পার্সেন্টেজ (%)</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              step="0.1"
              value={newPercentage}
              onChange={(e) => setNewPercentage(e.target.value)}
              placeholder="%"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
              required
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? '...' : 'যোগ'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );

  if (tasks.length === 0 && !showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">টাস্ক অ্যাসাইনমেন্ট</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onResetTasks}
              className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-100 transition-all border border-amber-200"
            >
              রিসেট (Default)
            </button>
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> টাস্ক যোগ করুন
            </button>
          </div>
        </div>
        <div className="glass-card p-8 text-center space-y-4">
          <ClipboardList className="w-12 h-12 text-slate-200 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-slate-800">কোনো টাস্ক পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500">নতুন টাস্ক যোগ করতে উপরের বাটনে ক্লিক করুন।</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">টাস্ক অ্যাসাইনমেন্ট</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onResetTasks}
            className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-100 transition-all border border-amber-200"
          >
            রিসেট (Default)
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> টাস্ক যোগ করুন
          </button>
        </div>
      </div>

      {showAddForm && renderAddForm()}

      <div className="grid grid-cols-1 gap-8">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.filter(t => t.category === category).map(task => {
                const isEditing = editingTaskId === task.id;
                
                if (isEditing) {
                  return (
                    <div key={task.id} className="glass-card p-4 border-indigo-200 bg-indigo-50/20">
                      <form onSubmit={handleUpdateTask} className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <input 
                            type="text" 
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                            placeholder="Category"
                            required
                          />
                          <input 
                            type="text" 
                            value={editSubCategory}
                            onChange={(e) => setEditSubCategory(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                            placeholder="Sub-category"
                            required
                          />
                          <input 
                            type="number" 
                            step="0.1"
                            value={editPercentage}
                            onChange={(e) => setEditPercentage(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                            placeholder="Percentage"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-indigo-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700"
                          >
                            Save
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingTaskId(null)}
                            className="flex-1 bg-slate-200 text-slate-600 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  );
                }

                return (
                  <div key={task.id} className="glass-card p-4 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800">{task.sub_category}</h4>
                        <p className="text-xs text-slate-500">Weight: {task.percentage}%</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {task.partner_name ? (
                          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-3 h-3" /> Assigned to {task.partner_name}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-slate-50 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                            <Circle className="w-3 h-3" /> Unassigned
                          </div>
                        )}
                        <div className="flex gap-2 ml-2">
                          <button 
                            onClick={() => startEditing(task)}
                            className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 bg-slate-50 rounded-lg"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              if (deletingId) return;
                              setDeletingId(task.id);
                              try {
                                await onDeleteTask(task.id);
                              } finally {
                                setDeletingId(null);
                              }
                            }}
                            disabled={deletingId === task.id}
                            className={cn(
                              "text-slate-400 hover:text-red-600 transition-colors p-1.5 bg-slate-50 rounded-lg",
                              deletingId === task.id && "opacity-50 cursor-not-allowed"
                            )}
                            title="মুছে ফেলুন"
                          >
                            {deletingId === task.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">অ্যাসাইন করুন:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {PARTNERS.map(partner => {
                          const isAssignedToThis = task.partner_name === partner;
                          const isAssignedToOther = task.partner_name && task.partner_name !== partner;
                          
                          return (
                            <button
                              key={partner}
                              onClick={() => onAssignTask(task.id, isAssignedToThis ? null : partner)}
                              className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all",
                                isAssignedToThis 
                                  ? "border-indigo-600 bg-indigo-50 shadow-sm" 
                                  : isAssignedToOther
                                    ? "border-slate-100 bg-white hover:border-indigo-200 opacity-70"
                                    : "border-slate-100 bg-white hover:border-slate-200"
                              )}
                            >
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 bg-white">
                                <img 
                                  src={PARTNER_ICONS[partner]} 
                                  alt={partner} 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <span className={cn(
                                "text-[8px] font-bold",
                                isAssignedToThis ? "text-indigo-600" : "text-slate-500"
                              )}>{partner}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
