import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Dashboard';
import PaymentsPage from '../pages/PaymentsPage';
import PartnersPage from '../pages/PartnersPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminPayments from '../pages/Admin/AdminPayments';
import AdminPartners from '../pages/Admin/AdminPartners';
import AdminSettingsPage from '../pages/Admin/AdminSettingsPage';
import AdminCourses from '../pages/Admin/AdminCourses';
import AddPaymentPage from '../pages/Admin/AddPaymentPage';
import LoginPage from '../pages/Admin/LoginPage';
import { useAdminStore } from '../store/useAdminStore';

export default function AppRoutes() {
  const { isAdmin } = useAdminStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/payments" element={<MainLayout><PaymentsPage /></MainLayout>} />
      <Route path="/partners" element={<MainLayout><PartnersPage /></MainLayout>} />
      <Route path="/login" element={
        isAdmin ? <Navigate to="/admin" /> : <MainLayout><LoginPage /></MainLayout>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/add-payment" element={<AdminLayout><AddPaymentPage /></AdminLayout>} />
      <Route path="/admin/payments" element={<AdminLayout><AdminPayments /></AdminLayout>} />
      <Route path="/admin/partners" element={<AdminLayout><AdminPartners /></AdminLayout>} />
      <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />
      <Route path="/admin/courses" element={<AdminLayout><AdminCourses /></AdminLayout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
