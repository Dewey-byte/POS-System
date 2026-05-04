import { useEffect, useState } from "react";
import axios from "axios";

import { Navbar } from "../layout/Navbar";
import { Sidebar } from "../layout/Sidebar";
import { KPIStatsCard } from "../dashboard/KPIStatsCard";
import { SalesChart } from "../dashboard/SalesChart";
import { QuickActionButtons } from "../dashboard/QuickActionButtons";

import {
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Wrench,
  Clock,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

/* TYPES */

type Page =
  | "dashboard"
  | "pos"
  | "inventory"
  | "sales"
  | "settings"
  | "services"
  | "mechanics";

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface Mechanic {
  id: string;
  status: "available" | "busy" | "off-duty";
}

interface ServiceJob {
  id: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
}

export function DashboardPage({
  onNavigate,
  onLogout,
}: DashboardPageProps) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userRole = user?.role || "cashier";

  /* STATE */
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [serviceJobs, setServiceJobs] = useState<ServiceJob[]>([]);

  /* FETCH DATA */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [mechanicsRes, servicesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/mechanics/"),
        axios.get("http://localhost:5000/api/sales/service-records"),
      ]);

      setMechanics(mechanicsRes.data || []);
      setServiceJobs(servicesRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  /* STATS */

const serviceStats = {
  pending: serviceJobs.filter((j) => j.status === "pending").length,
  inProgress: serviceJobs.filter((j) => j.status === "in-progress").length,
  total:
    serviceJobs.filter(
      (j) => j.status === "pending" || j.status === "in-progress"
    ).length,
};

  const mechanicStats = {
    available: mechanics.filter((m) => m.status === "available").length,
    busy: mechanics.filter((m) => m.status === "busy").length,
    total: mechanics.length,
  };

  return (
    <div className="dark h-screen bg-background flex flex-col">
      {/* NAVBAR */}
      <Navbar
        onLogout={onLogout}
        role={user?.role || ""}
        name={user?.name || ""}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          currentPage="dashboard"
          onNavigate={onNavigate}
          userRole={userRole}
        />

        {/* MAIN */}
        <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">
          {/* HEADER */}
          <div className="p-6 border-b border-border bg-background sticky top-0 z-10">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's your business overview.
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPIStatsCard
                  title="Sales Today"
                  value="₱4,523.00"
                  change="+12.5%"
                  trend="up"
                  icon={DollarSign}
                />

                <KPIStatsCard
                  title="Items Sold"
                  value="142"
                  change="+8.2%"
                  trend="up"
                  icon={Package}
                />

                <KPIStatsCard
                  title="Low Stock Items"
                  value="8"
                  change="+2"
                  trend="down"
                  icon={AlertTriangle}
                />

                <KPIStatsCard
                  title="Revenue This Month"
                  value="₱89,342.00"
                  change="+18.7%"
                  trend="up"
                  icon={TrendingUp}
                />
              </div>

              {/* QUICK ACTIONS */}
              <QuickActionButtons onNavigate={onNavigate} />

              {/* SERVICE + MECHANIC OVERVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SERVICES */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-primary" />
                      Active Services
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Pending</span>
                      </div>

                      <span>{serviceStats.pending}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">In Progress</span>
                      </div>

                      <span>{serviceStats.inProgress}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span >Total Today</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">{serviceStats.total}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* MECHANICS */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-primary" />
                      Mechanics Status
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Available
                      </span>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">{mechanicStats.available}</Badge>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Busy
                      </span>
                      <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">{mechanicStats.busy}</Badge>
                    </div>

                    <div className="flex justify-between">
                      <span>Total Staff</span>
                      <span className="text-foreground">{mechanicStats.total}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SALES CHART */}
              <SalesChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}