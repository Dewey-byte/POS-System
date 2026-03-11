import { useState } from 'react';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { POSScreen } from './components/pages/POSScreen';
import { InventoryPage } from './components/pages/InventoryPage';
import { SalesReportPage } from './components/pages/SalesReportPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { ServiceManagementPage } from './components/pages/ServiceManagementPage';
import { CustomersPage } from './components/pages/CustomersPage';
import { MechanicsPage } from './components/pages/MechanicsPage';
import { Toaster } from './components/ui/sonner';

type Page = 'login' | 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings' | 'services' | 'customers' | 'mechanics';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const handleNavigate = (page: Exclude<Page, 'login'>) => {
    setCurrentPage(page);
  };

  if (currentPage === 'login') {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <>
        <DashboardPage onNavigate={handleNavigate} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'pos') {
    return (
      <>
        <POSScreen onNavigate={handleNavigate} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'inventory') {
    return (
      <>
        <InventoryPage onNavigate={handleNavigate} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'sales') {
    return (
      <>
        <SalesReportPage onNavigate={handleNavigate} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'settings') {
    return (
      <>
        <SettingsPage onNavigate={handleNavigate} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'services') {
    return (
      <>
        <ServiceManagementPage onNavigate={handleNavigate} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'customers') {
    return (
      <>
        <CustomersPage onNavigate={handleNavigate} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'mechanics') {
    return (
      <>
        <MechanicsPage onNavigate={handleNavigate} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <DashboardPage onNavigate={handleNavigate} onLogout={handleLogout} />
      <Toaster />
    </>
  );
}