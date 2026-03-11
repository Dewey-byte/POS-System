import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { KPIStatsCard } from '../dashboard/KPIStatsCard';
import { SalesChart } from '../dashboard/SalesChart';
import { QuickActionButtons } from '../dashboard/QuickActionButtons';
import { DollarSign, Package, AlertTriangle, TrendingUp, Wrench, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings' | 'services' | 'customers' | 'mechanics';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function DashboardPage({ onNavigate, onLogout }: DashboardPageProps) {
  return (
    <div className="dark min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentPage="dashboard" onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
            </div>

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
            <QuickActionButtons onNavigate={onNavigate} />

            {/* Service Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary" />
                    Active Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Pending</span>
                      </div>
                      <span className="text-foreground">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">In Progress</span>
                      </div>
                      <span className="text-foreground">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Total Today</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Customers</span>
                      <span className="text-foreground">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">New This Month</span>
                      <span className="text-foreground">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">VIP Members</span>
                      <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">24</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary" />
                    Mechanics Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Available</span>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Busy</span>
                      <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Total Staff</span>
                      <span className="text-foreground">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sales Chart */}
            <SalesChart />
          </div>
        </main>
      </div>
    </div>
  );
}