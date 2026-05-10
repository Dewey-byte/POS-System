import { useState } from "react";
import { LoginPage } from "./components/pages/LoginPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { POSScreen } from "./components/pages/POSScreen";
import { InventoryPage } from "./components/pages/InventoryPage";
import { SalesReportPage } from "./components/pages/SalesReportPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { ServiceManagementPage } from "./components/pages/ServiceManagementPage";
import { MechanicsPage } from "./components/pages/MechanicsPage";

import { Toaster } from "./components/ui/sonner";

type Page =
  | "login"
  | "dashboard"
  | "pos"
  | "inventory"
  | "sales"
  | "settings"
  | "services"
  | "mechanics";

type UserRole = "admin" | "cashier";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Keep route guards centralized so page access stays consistent.
  const rolePermissions: Record<UserRole, Page[]> = {
    admin: [
      "dashboard",
      "pos",
      "inventory",
      "sales",
      "settings",
      "services",
      "mechanics",
    ],
    cashier: ["dashboard", "pos", "inventory", "services"],
  };

  // LOGIN
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage("dashboard");
  };

  // LOGOUT
  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage("login");
  };

  // NAVIGATION
  const handleNavigate = (page: Page) => {
    if (!userRole) return;

    if (!rolePermissions[userRole].includes(page)) {
      console.warn("Access denied:", page);
      return;
    }

    setCurrentPage(page);
  };

  // ✅ LOGIN SCREEN FIRST
  if (currentPage === "login") {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  // ✅ GLOBAL SAFETY CHECK (IMPORTANT)
  if (!userRole) {
    return <div>Loading...</div>; // or null
  }

  // DASHBOARD
  if (currentPage === "dashboard") {
    return (
      <>
        <DashboardPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  // POS
  if (currentPage === "pos") {
    return (
      <>
        <POSScreen
          onNavigate={handleNavigate}
          onLogout={handleLogout}         />
        <Toaster />
      </>
    );
  }

  // INVENTORY
  if (currentPage === "inventory") {
    return (
      <>
        <InventoryPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  // SALES
  if (currentPage === "sales") {
    return (
      <>
        <SalesReportPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  // SETTINGS
  if (currentPage === "settings") {
    return (
      <>
        <SettingsPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userRole={userRole}
        />
        <Toaster />
      </>
    );
  }

  // SERVICES
  if (currentPage === "services") {
    return (
      <>
        <ServiceManagementPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  // MECHANICS
  if (currentPage === "mechanics") {
    return (
      <>
        <MechanicsPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  // FALLBACK
  return (
    <>
      <DashboardPage
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <Toaster />
    </>
  );
}