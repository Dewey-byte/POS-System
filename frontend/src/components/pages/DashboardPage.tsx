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
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

type Page =
  | "dashboard"
  | "pos"
  | "inventory"
  | "sales"
  | "settings"
  | "services"
  | "customers"
  | "mechanics";

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function DashboardPage({
  onNavigate,
  onLogout,
}: DashboardPageProps) {
  return (
    <div className="dark h-screen bg-background flex flex-col ">
      
      {/* Sticky Navbar */}
      <Navbar onLogout={onLogout} name={""} />

      {/* Layout wrapper */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sticky Sidebar */}
        <Sidebar
          currentPage="dashboard"
          onNavigate={onNavigate}
        />

        {/* Scrollable Content Area */}
        <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">

          {/* Page Header */}
          <div className="p-6 border-b border-border bg-background sticky top-0 z-10">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-foreground">
                Dashboard
              </h1>

              <p className="text-muted-foreground mt-1">
                Welcome back! Here's your business overview.
              </p>
            </div>
          </div>

          {/* Scroll Content */}
          <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">

              {/* KPI Cards */}
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

              {/* Quick Actions */}
              <QuickActionButtons
                onNavigate={onNavigate}
              />

              {/* Service Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Services */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-primary" />
                      Active Services
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Pending
                      </span>
                      <span>2</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        In Progress
                      </span>
                      <span>3</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Total Today</span>
                      <Badge>5</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Customers */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Customers
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Total Customers
                      </span>
                      <span>156</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        New This Month
                      </span>
                      <span>12</span>
                    </div>

                    <div className="flex justify-between">
                      <span>VIP Members</span>
                      <Badge>24</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Mechanics */}
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
                      <Badge>5</Badge>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Busy
                      </span>
                      <Badge>3</Badge>
                    </div>

                    <div className="flex justify-between">
                      <span>Total Staff</span>
                      <span>8</span>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Chart */}
              <SalesChart />

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}