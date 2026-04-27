import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Settings, Users, Bot, GraduationCap, List, LogOut, Menu, X, Plus } from 'lucide-react';
import Logo from '../components/public/Logo';
import { useAdminStore } from '../store/useAdminStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, logout } = useAdminStore();
  const navigate = useNavigate();

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-8">
            <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <Logo className="h-10 w-auto" />
            </Link>
            
            <nav className="hidden lg:flex items-center gap-1">
              <Link 
                to="/admin" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <LayoutDashboard className="w-4 h-4" /> ড্যাশবোর্ড
              </Link>
              <Link 
                to="/admin/add-payment" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl transition-all hover:bg-indigo-100"
              >
                <Plus className="w-4 h-4" /> নতুন পেমেন্ট
              </Link>
              <Link 
                to="/admin/partners" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Users className="w-4 h-4" /> পার্টনার হিসাব
              </Link>
              <Link 
                to="/admin/settings" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Bot className="w-4 h-4" /> বট সেটিংস
              </Link>
              <Link 
                to="/admin/courses" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <GraduationCap className="w-4 h-4" /> কোর্স
              </Link>
              <Link 
                to="/admin/payments" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <List className="w-4 h-4" /> পেমেন্ট রেকর্ড
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> লগআউট
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-indigo-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
              />
              
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-xl z-50 lg:hidden overflow-hidden"
              >
                <div className="px-4 py-4 space-y-1">
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <LayoutDashboard className="w-5 h-5" /> ড্যাশবোর্ড
                  </Link>
                  <Link 
                    to="/admin/add-payment" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-indigo-100"
                  >
                    <Plus className="w-5 h-5" /> নতুন পেমেন্ট রেকর্ড
                  </Link>
                  <Link 
                    to="/admin/partners" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Users className="w-5 h-5" /> পার্টনার হিসাব
                  </Link>
                  <Link 
                    to="/admin/settings" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Bot className="w-5 h-5" /> বট সেটিংস
                  </Link>
                  <Link 
                    to="/admin/courses" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <GraduationCap className="w-5 h-5" /> কোর্স ম্যানেজমেন্ট
                  </Link>
                  <Link 
                    to="/admin/payments" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <List className="w-5 h-5" /> পেমেন্ট রেকর্ড
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5" /> লগআউট
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
