import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Payment, SortOption, PaymentMethod, Course } from '../../types';
import { cn } from '../../lib/utils';
import { Trash2, ArrowUpDown, Smartphone, Search, X, AlertTriangle, FileDown, User, Edit2, Check, Loader2, GraduationCap, ClipboardPaste } from 'lucide-react';
import { PAYMENT_LOGOS, PARTNER_ICONS } from '../../constants';
import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PaymentListProps {
  payments: Payment[];
  onDeletePayment?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onUpdatePayment?: (id: string, updates: Partial<Payment>) => Promise<boolean>;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  hideDelete?: boolean;
  isAdmin?: boolean;
  courses?: Course[];
  loading?: boolean;
}

export default function PaymentList({ 
  payments, 
  onDeletePayment, 
  onBulkDelete, 
  onUpdatePayment, 
  sortOption, 
  onSortChange, 
  hideDelete, 
  isAdmin = false,
  courses = [],
  loading = false
}: PaymentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'All'>('All');
  const [courseFilter, setCourseFilter] = useState<string | 'All'>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const methods: (PaymentMethod | 'All')[] = ['All', 'Bkash', 'Nagad', 'Rocket', 'Bank', 'Other'];

  const filteredPayments = useMemo(() => {
    let filtered = payments;
    
    if (methodFilter !== 'All') {
      filtered = filtered.filter(p => p.method === methodFilter);
    }

    if (courseFilter !== 'All') {
      filtered = filtered.filter(p => p.course_id === courseFilter);
    }

    if (!searchQuery.trim()) return filtered;
    
    const query = searchQuery.toLowerCase();
    return filtered.filter(p => 
      p.phone_number.includes(searchQuery) || 
      p.amount.toString().includes(searchQuery) ||
      p.method.toLowerCase().includes(query) ||
      (p.label && p.label.toLowerCase().includes(query)) ||
      (p.message && p.message.toLowerCase().includes(query)) ||
      (courses.find(c => c.id === p.course_id)?.name.toLowerCase().includes(query))
    );
  }, [payments, searchQuery, methodFilter, courseFilter, courses]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPayments.length && filteredPayments.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPayments.map(p => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedIds.length === 0) return;
    
    if (window.confirm(`আপনি কি নিশ্চিত যে আপনি ${selectedIds.length} টি পেমেন্ট ডিলিট করতে চান?`)) {
      setIsBulkDeleting(true);
      await onBulkDelete(selectedIds);
      setSelectedIds([]);
      setIsBulkDeleting(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text('SOT PAYMENT', 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text('Payment List Report', 14, 32);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, 14, 40);
    doc.text(`Total Payments: ${filteredPayments.length}`, 14, 46);
    
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    doc.text(`Total Amount: TK ${totalAmount.toFixed(2)}`, 14, 52);
    
    // Prepare data
    const data = filteredPayments.map(p => {
      const courseName = courses.find(c => c.id === p.course_id)?.name || '-';
      return [
        p.method,
        p.phone_number,
        `TK ${p.amount.toFixed(2)}`,
        p.label || '-',
        courseName,
        p.partner || '-',
        format(new Date(p.created_at), 'MMM d, yyyy h:mm a'),
        p.message || '-'
      ];
    });
    
    // Generate table
    autoTable(doc, {
      head: [['Method', 'Phone Number', 'Amount', 'Label', 'Course', 'Partner', 'Date', 'Message']],
      body: data,
      startY: 60,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 60 },
    });
    
    // Save PDF
    doc.save(`SOT-Payments-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
  };

  const handleUpdate = async () => {
    if (!onUpdatePayment || !editingPayment) return;
    
    setIsUpdating(true);
    const success = await onUpdatePayment(editingPayment.id, {
      method: editingPayment.method,
      amount: editingPayment.amount,
      phone_number: editingPayment.phone_number,
      label: editingPayment.label,
      message: editingPayment.message,
      course_id: editingPayment.course_id
    });
    
    if (success) {
      setEditingPayment(null);
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-full" />
        <div className="h-10 bg-slate-200 rounded-xl w-3/4" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!hideDelete && filteredPayments.length > 0 && (
              <input
                type="checkbox"
                checked={selectedIds.length === filteredPayments.length && filteredPayments.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                title="সব সিলেক্ট করুন"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold text-slate-800">সাম্প্রতিক পেমেন্টসমূহ</h2>
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-500">
                মোট {filteredPayments.length} টি {searchQuery && '(ফিল্টার করা)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!hideDelete && selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold transition-all border border-red-100 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>ডিলিট ({selectedIds.length})</span>
              </button>
            )}
            <button
              onClick={downloadPDF}
              disabled={filteredPayments.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold transition-all border border-indigo-100"
              title="PDF ডাউনলোড করুন"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden xs:inline">PDF</span>
            </button>

            <div className="relative group">
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="date-desc">নতুন আগে</option>
                <option value="date-asc">পুরানো আগে</option>
                <option value="amount-desc">বেশি টাকা আগে</option>
                <option value="amount-asc">কম টাকা আগে</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নম্বর, পরিমাণ বা TrxID দিয়ে খুঁজুন..."
            className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Method Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {methods.map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                methodFilter === m
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
            >
              {m === 'All' ? 'সব মাধ্যম' : 
               m === 'Bkash' ? 'বিকাশ' :
               m === 'Nagad' ? 'নগদ' :
               m === 'Rocket' ? 'রকেট' :
               m === 'Bank' ? 'ব্যাংক' : 'অন্যান্য'}
            </button>
          ))}
        </div>

        {/* Course Filter Pills */}
        {courses.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            <button
              onClick={() => setCourseFilter('All')}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                courseFilter === 'All'
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
            >
              সব কোর্স
            </button>
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setCourseFilter(c.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-2",
                  courseFilter === c.id
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                )}
              >
                {c.logo_url && (
                  <img 
                    src={c.logo_url} 
                    alt="" 
                    className="w-3 h-3 object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden">
        <AnimatePresence mode="popLayout">
          {filteredPayments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-slate-300"
            >
              <p className="text-slate-400">
                {searchQuery ? 'আপনার খোঁজা নম্বরের কোনো পেমেন্ট পাওয়া যায়নি' : 'কোন পেমেন্ট পাওয়া যায়নি'}
              </p>
            </motion.div>
          ) : (
            filteredPayments.map((payment) => (
              <motion.div
                key={payment.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "glass-card p-3 sm:p-4 mb-3 hover:shadow-md transition-all group relative",
                  selectedIds.includes(payment.id) && "ring-2 ring-indigo-500 bg-indigo-50/30"
                )}
              >
                <div className="flex items-start gap-3">
                  {!hideDelete && (
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(payment.id)}
                        onChange={() => toggleSelection(payment.id)}
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center overflow-hidden bg-white border border-slate-100 shadow-sm shrink-0",
                        )}>
                          <img 
                            src={PAYMENT_LOGOS[payment.method]} 
                            alt={payment.method} 
                            className="w-full h-full object-contain p-1"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900 truncate text-sm sm:text-base">
                            {payment.method === 'Bkash' ? 'বিকাশ' :
                             payment.method === 'Nagad' ? 'নগদ' :
                             payment.method === 'Rocket' ? 'রকেট' :
                             payment.method === 'Bank' ? 'ব্যাংক' : 'অন্যান্য'} পেমেন্ট
                          </h3>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded min-w-0">
                              <Smartphone className="w-2.5 h-2.5 sm:w-3 h-3 shrink-0" />
                              <span className="truncate">{payment.phone_number}</span>
                            </div>
                            {payment.label && (
                              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 shrink-0 border border-amber-100">
                                <ClipboardPaste className="w-2.5 h-2.5" />
                                {payment.label}
                              </span>
                            )}
                            <span className={cn(
                              "text-[9px] sm:text-[10px] uppercase font-bold px-1 sm:px-1.5 py-0.5 rounded shrink-0",
                              payment.method === 'Bkash' && "text-pink-600 bg-pink-50",
                              payment.method === 'Nagad' && "text-orange-600 bg-orange-50",
                              payment.method === 'Rocket' && "text-purple-700 bg-purple-50",
                              payment.method === 'Bank' && "text-blue-600 bg-blue-50",
                              payment.method === 'Other' && "text-slate-600 bg-slate-50",
                            )}>
                              {payment.method}
                            </span>
                            {payment.partner && (
                              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 shrink-0 border border-indigo-200">
                                <div className="w-3 h-3 rounded-full overflow-hidden bg-white border border-indigo-200">
                                  <img 
                                    src={PARTNER_ICONS[payment.partner]} 
                                    alt={payment.partner} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                {payment.partner}
                              </span>
                            )}
                            {payment.course_id && (
                              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-100">
                                <GraduationCap className="w-2.5 h-2.5" />
                                {courses.find(c => c.id === payment.course_id)?.name || 'কোর্স'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-lg font-bold text-slate-900">৳{payment.amount.toFixed(2)}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400">
                          {format(new Date(payment.created_at), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    </div>
                    
                    {payment.message && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600 italic">
                        "{payment.message}"
                      </div>
                    )}

                    {!hideDelete && (
                      <div className="mt-3 flex justify-end gap-2">
                        {deletingId === payment.id ? (
                          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              আপনি কি নিশ্চিত?
                            </span>
                            <button 
                              onClick={() => {
                                onDeletePayment?.(payment.id);
                                setDeletingId(null);
                              }}
                              className="px-3 py-1 text-[10px] font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              হ্যাঁ
                            </button>
                            <button 
                              onClick={() => setDeletingId(null)}
                              className="px-3 py-1 text-[10px] font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              না
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => setEditingPayment(payment)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              এডিট করুন
                            </button>
                            <button 
                              onClick={() => setDeletingId(payment.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              ডিলিট করুন
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">পেমেন্ট এডিট করুন</h3>
                    <p className="text-xs text-slate-500">তথ্য সংশোধন করুন</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingPayment(null)}
                  className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {['Bkash', 'Nagad', 'Rocket', 'Bank', 'Other'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setEditingPayment({ ...editingPayment, method: m as PaymentMethod })}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-2xl border-2 transition-all text-sm font-bold",
                        editingPayment.method === m
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                      )}
                    >
                      <img 
                        src={PAYMENT_LOGOS[m as PaymentMethod]} 
                        alt={m} 
                        className="w-6 h-6 object-contain"
                        referrerPolicy="no-referrer"
                      />
                      {m === 'Bkash' ? 'বিকাশ' : m === 'Nagad' ? 'নগদ' : m === 'Rocket' ? 'রকেট' : m === 'Bank' ? 'ব্যাংক' : 'অন্যান্য'}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">কোর্স নির্বাচন করুন</label>
                  <select
                    value={editingPayment.course_id || ''}
                    onChange={(e) => setEditingPayment({ ...editingPayment, course_id: e.target.value || undefined })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  >
                    <option value="">কোর্স সিলেক্ট করুন (ঐচ্ছিক)</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">লেবেল (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={editingPayment.label || ''}
                    onChange={(e) => setEditingPayment({ ...editingPayment, label: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="যেমন: ১ল কিস্তি"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">ফোন নম্বর</label>
                  <input
                    type="text"
                    value={editingPayment.phone_number}
                    onChange={(e) => setEditingPayment({ ...editingPayment, phone_number: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">পরিমাণ (৳)</label>
                  <input
                    type="number"
                    value={editingPayment.amount}
                    onChange={(e) => setEditingPayment({ ...editingPayment, amount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">মেসেজ (ঐচ্ছিক)</label>
                  <textarea
                    value={editingPayment.message || ''}
                    onChange={(e) => setEditingPayment({ ...editingPayment, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[80px] resize-none"
                    placeholder="অতিরিক্ত তথ্য..."
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setEditingPayment(null)}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  আপডেট করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
