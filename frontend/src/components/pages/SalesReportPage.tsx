import { useState, useEffect } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar as CalendarIcon, FileDown, FileSpreadsheet, ShoppingCart, Wrench } from 'lucide-react';

type Page =
  | 'dashboard'
  | 'pos'
  | 'inventory'
  | 'sales'
  | 'settings'
  | 'services'
  | 'mechanics';

interface SalesReportPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function SalesReportPage({
  onNavigate,
  onLogout,
}: SalesReportPageProps) {

  const API_URL = "http://127.0.0.1:5000/api/sales";

const user = JSON.parse(localStorage.getItem("user") || "null");
const userRole = user?.role || "cashier"; // default to cashier if not found

  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const [salesData, setSalesData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [serviceRecords, setServiceRecords] = useState<any[]>([]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  ////////////////////////////////////////////////////////
  // FETCH SALES REPORT DATA
  ////////////////////////////////////////////////////////

  const fetchSalesReports = async () => {

    let url = `${API_URL}/reports`;

    if (dateFrom && dateTo) {
      url += `?date_from=${dateFrom.toISOString()}&date_to=${dateTo.toISOString()}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    setSalesData(data);

  };

  ////////////////////////////////////////////////////////
  // FETCH TRANSACTIONS
  ////////////////////////////////////////////////////////

  const fetchTransactions = async () => {

    const response = await fetch(`${API_URL}/transactions`);
    const data = await response.json();

    setTransactions(data);

  };

  ////////////////////////////////////////////////////////
  // FETCH SERVICE REPORTS
  ////////////////////////////////////////////////////////

  const fetchServiceReports = async () => {

    const response = await fetch(`${API_URL}/service-reports`);
    const data = await response.json();

    setServiceData(data);

  };

  ////////////////////////////////////////////////////////
  // FETCH SERVICE RECORDS
  ////////////////////////////////////////////////////////

  const fetchServiceRecords = async () => {

    const response = await fetch(`${API_URL}/service-records`);
    const data = await response.json();

    setServiceRecords(data);

  };

  ////////////////////////////////////////////////////////
  // INITIAL LOAD
  ////////////////////////////////////////////////////////

  useEffect(() => {

    fetchSalesReports();
    fetchTransactions();
    fetchServiceReports();
    fetchServiceRecords();

  }, []);

  ////////////////////////////////////////////////////////
  // DATE FILTER APPLY
  ////////////////////////////////////////////////////////

  const applyDateFilter = () => {

    fetchSalesReports();

  };
  
  /* =======================
     ROLE ACCESS CONTROL
  ======================= */
  const canManageUsers = userRole === "admin";

  if (userRole === "cashier") {
    return (
      <div className="p-10 text-red-500">
        Access Denied. Please login.
      </div>
    );
  }


  ////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////

  return (
     <div className="dark h-screen bg-background flex flex-col ">

      <Navbar onLogout={onLogout} role={user?.role || ""} name={user?.name || ""} />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar currentPage="sales" onNavigate={onNavigate} userRole={userRole} />

       <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">

          <div className="max-w-7xl mx-auto space-y-6">

            
             {/* Page Header */}
          <div className="p-6 border-b border-border bg-background sticky top-0 z-10">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-foreground">
                Business Reports
              </h1>

              <p className="text-muted-foreground mt-1">
                View and analyze sales, services, and inventory performance
              </p>
            </div>
          </div>


              <div className="flex gap-3">

                <Button variant="outline">
                  <FileDown className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>

                <Button variant="outline">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>

              </div>

          
{/* DATE RANGE */}

<Card className="p-6">

  <h3 className="mb-4">
    Date Range
  </h3>

  <div className="flex gap-4 flex-wrap">

    {/* FROM DATE */}
    <div className="flex items-center gap-2">

      <CalendarIcon className="w-4 h-4" />

      <input
        type="date"
        value={dateFrom ? dateFrom.toISOString().split("T")[0] : ""}
        onChange={(e) =>
          setDateFrom(e.target.value ? new Date(e.target.value) : undefined)
        }
        className="border border-border rounded-md px-3 py-2 bg-card text-foreground"
      />

    </div>

    {/* TO DATE */}
    <div className="flex items-center gap-2">

      <CalendarIcon className="w-4 h-4" />

      <input
        type="date"
        value={dateTo ? dateTo.toISOString().split("T")[0] : ""}
        onChange={(e) =>
          setDateTo(e.target.value ? new Date(e.target.value) : undefined)
        }
        className="border border-border rounded-md px-3 py-2 bg-card text-foreground"
      />

    </div>

    <Button onClick={applyDateFilter}>
      Apply Filter
    </Button>

  </div>

</Card>

            {/* TABS */}

            <Tabs defaultValue="sales">

              <TabsList className="grid grid-cols-2">

                <TabsTrigger value="sales">

                  <ShoppingCart className="w-4 h-4 mr-2" />

                  Sales Reports

                </TabsTrigger>


                <TabsTrigger value="services">

                  <Wrench className="w-4 h-4 mr-2" />

                  Service Reports

                </TabsTrigger>

              </TabsList>


              {/* SALES TAB */}

              <TabsContent value="sales" className="space-y-6">

                <Card className="p-6">

                  <h3 className="mb-6">

                    Sales Trend

                  </h3>

                  <ResponsiveContainer width="100%" height={300}>

                    <LineChart data={salesData}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="date" />

                      <YAxis />

                      <Tooltip />

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


                <Card className="p-6">

                  <h3 className="mb-4">

                    Recent Transactions

                  </h3>

                  <div className="overflow-auto">

                    <Table>

                      <TableHeader>

                        <TableRow>

                          <TableHead>Transaction ID</TableHead>

                          <TableHead>Date & Time</TableHead>

                          <TableHead>Customer</TableHead>

                          <TableHead>Items</TableHead>

                          <TableHead>Total</TableHead>

                          <TableHead>Payment</TableHead>

                        </TableRow>

                      </TableHeader>


                      <TableBody>

                        {
                          transactions.map((txn) => (

                            <TableRow key={txn.id}>

                              <TableCell className="text-primary">
                                {txn.id}
                              </TableCell>

                              <TableCell>
                                {txn.date}
                              </TableCell>

                              <TableCell>
                                {txn.customer}
                              </TableCell>

                              <TableCell>
                                {txn.items}
                              </TableCell>

                              <TableCell>
                                ₱{txn.total.toFixed(2)}
                              </TableCell>

                              <TableCell>
                                {txn.payment}
                              </TableCell>

                            </TableRow>

                          ))
                        }

                      </TableBody>

                    </Table>

                  </div>

                </Card>

              </TabsContent>


              {/* SERVICES TAB */}

              <TabsContent value="services" className="space-y-6">

                <Card className="p-6">

                  <h3 className="mb-6">

                    Service Revenue Trend

                  </h3>

                  <ResponsiveContainer width="100%" height={300}>

                    <BarChart data={serviceData}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="date" />

                      <YAxis />

                      <Tooltip />

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


                <Card className="p-6">

                  <h3 className="mb-4">

                    Recent Service Records

                  </h3>

                  <div className="overflow-auto">

                    <Table>

                      <TableHeader>

                        <TableRow>

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

                        {
                          serviceRecords.map((srv) => (

                            <TableRow key={srv.id}>

                              <TableCell className="text-primary">
                                {srv.id}
                              </TableCell>

                              <TableCell>
                                {srv.date}
                              </TableCell>

                              <TableCell>
                                {srv.customer}
                              </TableCell>

                              <TableCell>
                                {srv.type}
                              </TableCell>

                              <TableCell>
                                {srv.mechanic}
                              </TableCell>

                              <TableCell>
                                ₱{srv.total.toFixed(2)}
                              </TableCell>

                              <TableCell>
                                {srv.status}
                              </TableCell>

                            </TableRow>

                          ))
                        }

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