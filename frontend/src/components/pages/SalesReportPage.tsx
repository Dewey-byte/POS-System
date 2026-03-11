import { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar as CalendarIcon, FileDown, FileSpreadsheet, ShoppingCart, Wrench } from 'lucide-react';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings' | 'services' | 'customers' | 'mechanics';

interface SalesReportPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

// Mock sales data
const salesData = [
  { date: 'Nov 10', sales: 3200, transactions: 45 },
  { date: 'Nov 11', sales: 2800, transactions: 38 },
  { date: 'Nov 12', sales: 4100, transactions: 52 },
  { date: 'Nov 13', sales: 3800, transactions: 48 },
  { date: 'Nov 14', sales: 5200, transactions: 65 },
  { date: 'Nov 15', sales: 4900, transactions: 58 },
  { date: 'Nov 16', sales: 4500, transactions: 55 },
];

// Mock transaction data
const transactions = [
  { id: 'TXN-1234', date: '2025-11-16 14:32', customer: 'John Smith', items: 3, total: 245.00, payment: 'Cash' },
  { id: 'TXN-1235', date: '2025-11-16 13:15', customer: 'Sarah Johnson', items: 5, total: 432.50, payment: 'Card' },
  { id: 'TXN-1236', date: '2025-11-16 12:45', customer: 'Mike Wilson', items: 2, total: 189.99, payment: 'Card' },
  { id: 'TXN-1237', date: '2025-11-16 11:20', customer: 'Emily Davis', items: 4, total: 567.00, payment: 'Cash' },
  { id: 'TXN-1238', date: '2025-11-16 10:05', customer: 'David Brown', items: 1, total: 125.00, payment: 'Card' },
  { id: 'TXN-1239', date: '2025-11-15 16:50', customer: 'Lisa Anderson', items: 6, total: 789.50, payment: 'Card' },
  { id: 'TXN-1240', date: '2025-11-15 15:30', customer: 'James Taylor', items: 3, total: 345.00, payment: 'Cash' },
];

// Mock service data
const serviceData = [
  { date: 'Dec 1', revenue: 8500, services: 12 },
  { date: 'Dec 2', revenue: 7200, services: 10 },
  { date: 'Dec 3', revenue: 9800, services: 15 },
  { date: 'Dec 4', revenue: 6500, services: 9 },
  { date: 'Dec 5', revenue: 11200, services: 18 },
  { date: 'Dec 6', revenue: 10500, services: 16 },
  { date: 'Dec 7', revenue: 9200, services: 14 },
];

const serviceRecords = [
  { id: 'SRV-001', date: '2025-12-08', customer: 'Juan Dela Cruz', type: 'Oil Change', mechanic: 'Mario Santos', total: 1050.00, status: 'Completed' },
  { id: 'SRV-002', date: '2025-12-08', customer: 'Maria Garcia', type: 'Brake Repair', mechanic: 'Pedro Reyes', total: 0.00, status: 'Pending' },
  { id: 'SRV-003', date: '2025-12-06', customer: 'Robert Tan', type: 'Engine Overhaul', mechanic: 'Mario Santos', total: 8000.00, status: 'In Progress' },
  { id: 'SRV-004', date: '2025-12-07', customer: 'Anna Lopez', type: 'Tire Replacement', mechanic: 'Pedro Reyes', total: 3100.00, status: 'Completed' },
];

export function SalesReportPage({ onNavigate, onLogout }: SalesReportPageProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentPage="sales" onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-foreground">Business Reports</h1>
                <p className="text-muted-foreground mt-1">View and analyze sales, services, and inventory performance</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-border">
                  <FileDown className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" className="border-border">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>

            {/* Date Range Picker */}
            <Card className="p-6 bg-card border-border">
              <h3 className="text-card-foreground mb-4">Date Range</h3>
              <div className="flex gap-4 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="border-border">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateFrom ? formatDate(dateFrom) : 'From Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="border-border">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateTo ? formatDate(dateTo) : 'To Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button className="bg-primary hover:bg-primary/90">
                  Apply Filter
                </Button>
              </div>
            </Card>

            {/* Tabs for Sales and Service Reports */}
            <Tabs defaultValue="sales" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sales">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Sales Reports
                </TabsTrigger>
                <TabsTrigger value="services">
                  <Wrench className="w-4 h-4 mr-2" />
                  Service Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sales" className="space-y-6">
                {/* Sales Chart */}
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-card-foreground mb-6">Sales Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="date" stroke="#a3a3a3" />
                      <YAxis stroke="#a3a3a3" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #262626',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        name="Sales (₱)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="transactions" 
                        stroke="#fb923c" 
                        strokeWidth={2}
                        name="Transactions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Transaction Table */}
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-card-foreground mb-4">Recent Transactions</h3>
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-muted/50">
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Payment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((txn) => (
                          <TableRow key={txn.id} className="border-border hover:bg-muted/50">
                            <TableCell className="text-primary">{txn.id}</TableCell>
                            <TableCell>{txn.date}</TableCell>
                            <TableCell>{txn.customer}</TableCell>
                            <TableCell>{txn.items}</TableCell>
                            <TableCell>₱{txn.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded ${
                                txn.payment === 'Cash' 
                                  ? 'bg-green-500/10 text-green-500' 
                                  : 'bg-blue-500/10 text-blue-500'
                              }`}>
                                {txn.payment}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                {/* Service Revenue Chart */}
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-card-foreground mb-6">Service Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={serviceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="date" stroke="#a3a3a3" />
                      <YAxis stroke="#a3a3a3" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #262626',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        fill="#3b82f6" 
                        name="Revenue (₱)"
                      />
                      <Bar 
                        dataKey="services" 
                        fill="#f97316" 
                        name="Services Count"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Service Records Table */}
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-card-foreground mb-4">Recent Service Records</h3>
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-muted/50">
                          <TableHead>Service ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Mechanic</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceRecords.map((srv) => (
                          <TableRow key={srv.id} className="border-border hover:bg-muted/50">
                            <TableCell className="text-primary">{srv.id}</TableCell>
                            <TableCell>{srv.date}</TableCell>
                            <TableCell>{srv.customer}</TableCell>
                            <TableCell>{srv.type}</TableCell>
                            <TableCell>{srv.mechanic}</TableCell>
                            <TableCell>₱{srv.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${
                                srv.status === 'Completed' 
                                  ? 'bg-green-500/10 text-green-500' 
                                  : srv.status === 'In Progress'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : 'bg-yellow-500/10 text-yellow-500'
                              }`}>
                                {srv.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}