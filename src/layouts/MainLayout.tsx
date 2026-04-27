import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, List, Users, Lock, Menu, X } from 'lucide-react';
import Logo from '../components/public/Logo';
import { useAdminStore } from '../store/useAdminStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAdminStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-8">
            <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <Logo className="h-10 w-auto" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <LayoutDashboard className="w-4 h-4" /> ড্যাশবোর্ড
              </Link>
              <Link 
                to="/payments" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <List className="w-4 h-4" /> পেমেন্ট লিস্ট
              </Link>
              <Link 
                to="/partners" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Users className="w-4 h-4" /> পার্টনার স্ট্যাটাস
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-indigo-100 ml-2"
                >
                  <Lock className="w-4 h-4" /> এডমিন প্যানেল
                </Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {!isAdmin ? (
              <div className="hidden md:flex items-center">
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Lock className="w-4 h-4" /> এডমিন লগইন
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <button 
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl transition-all hover:bg-indigo-100"
                >
                  <Lock className="w-4 h-4" /> এডমিন প্যানেল
                </button>
              </div>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
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
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
              />
              
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-xl z-50 md:hidden overflow-hidden"
              >
                <div className="px-4 py-4 space-y-1">
                  <Link 
                    to="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <LayoutDashboard className="w-5 h-5" /> ড্যাশবোর্ড
                  </Link>
                  <Link 
                    to="/payments" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <List className="w-5 h-5" /> পেমেন্ট লিস্ট
                  </Link>
                  <Link 
                    to="/partners" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Users className="w-5 h-5" /> পার্টনার স্ট্যাটাস
                  </Link>
                  {isAdmin ? (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-indigo-100"
                    >
                      <Lock className="w-5 h-5" /> এডমিন প্যানেল
                    </Link>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Lock className="w-5 h-5" /> এডমিন লগইন
                    </Link>
                  )}
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
