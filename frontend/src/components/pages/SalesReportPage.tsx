import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Calendar as CalendarIcon, FileDown, FileSpreadsheet, ShoppingCart, Wrench } from 'lucide-react';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const userRole = user?.role || "cashier";

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const [salesData, setSalesData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [serviceRecords, setServiceRecords] = useState<any[]>([]);

  //////////////////////////////////////////////////////
  // DATE FILTER HELPER
  //////////////////////////////////////////////////////

  const parseDateOnly = (rawValue?: string) => {
    if (!rawValue) return null;
    const datePart = String(rawValue).slice(0, 10);
    const [y, m, d] = datePart.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const fromDateObj = useMemo(() => parseDateOnly(dateFrom), [dateFrom]);
  const toDateObj = useMemo(() => parseDateOnly(dateTo), [dateTo]);

  const isWithinRange = (dateStr: string) => {
    if (!fromDateObj && !toDateObj) return true;
    const parsed = parseDateOnly(dateStr);
    if (!parsed) return false;
    if (fromDateObj && parsed < fromDateObj) return false;
    if (toDateObj && parsed > toDateObj) return false;
    return true;
  };

  const filteredTransactions = transactions.filter((t) => isWithinRange(t.date));
  const filteredServiceRecords = serviceRecords.filter((s) => isWithinRange(s.date));
  const filteredSalesData = salesData.filter((s) => isWithinRange(s.date));
  const filteredServiceData = serviceData.filter((s) => isWithinRange(s.date));

  //////////////////////////////////////////////////////
  // FETCH SALES REPORT DATA
  //////////////////////////////////////////////////////

  const fetchSalesReports = async () => {
    let url = `${API_URL}/reports`;

    if (dateFrom && dateTo) {
      url += `?date_from=${dateFrom}&date_to=${dateTo}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    setSalesData(data);
  };

  //////////////////////////////////////////////////////
  // FETCH TRANSACTIONS
  //////////////////////////////////////////////////////

  const fetchTransactions = async () => {
    const response = await fetch(`${API_URL}/transactions`);
    const data = await response.json();

    setTransactions(data);
  };

  //////////////////////////////////////////////////////
  // FETCH SERVICE REPORTS
  //////////////////////////////////////////////////////

  const fetchServiceReports = async () => {
    const response = await fetch(`${API_URL}/service-reports`);
    const data = await response.json();

    setServiceData(data);
  };

  //////////////////////////////////////////////////////
  // FETCH SERVICE RECORDS
  //////////////////////////////////////////////////////

  const fetchServiceRecords = async () => {
    const response = await fetch(`${API_URL}/service-records`);
    const data = await response.json();

    setServiceRecords(data);
  };

  //////////////////////////////////////////////////////
  // INITIAL LOAD
  //////////////////////////////////////////////////////

  useEffect(() => {
    fetchSalesReports();
    fetchTransactions();
    fetchServiceReports();
    fetchServiceRecords();
  }, []);

  //////////////////////////////////////////////////////
  // DATE FILTER APPLY
  //////////////////////////////////////////////////////

  const applyDateFilter = async () => {
    // Keep chart data in sync with server aggregates while tables use the same range locally.
    await fetchSalesReports();
  };

  const clearDateFilter = async () => {
    setDateFrom("");
    setDateTo("");
    fetchSalesReports();
  };

  //////////////////////////////////////////////////////
  // ✅ FIXED EXPORT EXCEL (TABLE ONLY)
  //////////////////////////////////////////////////////

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    const salesSheet = XLSX.utils.json_to_sheet(filteredTransactions);
    const serviceSheet = XLSX.utils.json_to_sheet(filteredServiceRecords);

    XLSX.utils.book_append_sheet(workbook, salesSheet, "Sales Table");
    XLSX.utils.book_append_sheet(workbook, serviceSheet, "Service Table");

    XLSX.writeFile(workbook, "business_reports.xlsx");
  };

  //////////////////////////////////////////////////////
  // ✅ FIXED EXPORT PDF (TABLE ONLY)
  //////////////////////////////////////////////////////

 const handleExportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Sales Report", 14, 15);

  //////////////////////////////////////////////////////
  // SALES REPORT HEADER
  //////////////////////////////////////////////////////

  doc.setFontSize(12);
  doc.text("Sales Report", 14, 25);

  autoTable(doc, {
    startY: 30,
    head: [["ID", "Date", "Customer", "Items", "Total", "Payment"]],
    body: filteredTransactions.map((t) => [
      t.id,
      t.date,
      t.customer,
      t.items,
      `${t.total}`,
      t.payment,
    ]),
  });

  //////////////////////////////////////////////////////
  // SERVICE REPORT ON A SEPARATE PAGE
  //////////////////////////////////////////////////////
  doc.addPage();
  doc.setFontSize(16);
  doc.text("Service Report", 14, 15);

  autoTable(doc, {
    startY: 22,
    head: [["ID", "Date", "Customer", "Type", "Mechanic", "Total", "Status"]],
    body: filteredServiceRecords.map((s) => [
      s.id,
      s.date,
      s.customer,
      s.type,
      s.mechanic,
      `${s.total}`,
      s.status,
    ]),
  });

  doc.save("sales_and_service_reports.pdf");
};
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

                <Button variant="outline" onClick={handleExportPDF}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>

                <Button variant="outline" onClick={handleExportExcel}>
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
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="border border-border rounded-md px-3 py-2 bg-card text-foreground"
      />

    </div>

    {/* TO DATE */}
    <div className="flex items-center gap-2">

      <CalendarIcon className="w-4 h-4" />

      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="border border-border rounded-md px-3 py-2 bg-card text-foreground"
      />

    </div>

    <Button onClick={applyDateFilter}>
      Apply Filter
    </Button>
    <Button variant="outline" onClick={clearDateFilter}>
      Clear
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

                    <LineChart data={filteredSalesData}>

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
                         filteredTransactions.map(t => (

                            <TableRow key={t.id}>

                              <TableCell className="text-primary">
                                {t.id}
                              </TableCell>

                              <TableCell>
                                {t.date}
                              </TableCell>

                              <TableCell>
                                {t.customer}
                              </TableCell>

                              <TableCell>
                                {t.items}
                              </TableCell>

                              <TableCell>
                                ₱{t.total.toFixed(2)}
                              </TableCell>

                             <TableCell className="flex items-center gap-2">
                               

                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    t.payment === "Cash"
                                      ? "bg-green-500/10 text-green-500"
                                      : "bg-blue-500/10 text-blue-500"
                                  }`}
                                >
                                  {t.payment}
                                </span>
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

                    <BarChart data={filteredServiceData}>

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
                          filteredServiceRecords.map(s => (

                            <TableRow key={s.id}>

                              <TableCell className="text-primary">
                                {s.id}
                              </TableCell>

                              <TableCell>
                                {s.date}
                              </TableCell>

                              <TableCell>
                                {s.customer}
                              </TableCell>

                              <TableCell>
                                {s.type}
                              </TableCell>

                              <TableCell>
                                {s.mechanic}
                              </TableCell>

                              <TableCell>
                                ₱{s.total.toFixed(2)}
                              </TableCell>

                              <TableCell>
                                {s.status}
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