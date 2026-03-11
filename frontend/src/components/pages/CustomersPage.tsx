import { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Plus, 
  User, 
  Phone, 
  MapPin,
  Mail,
  Calendar,
  FileText,
  Wrench
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings' | 'services' | 'customers' | 'mechanics';

interface CustomersPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  motorcycles: {
    brand: string;
    model: string;
    plateNumber: string;
    year: number;
  }[];
  serviceHistory: {
    id: string;
    date: string;
    serviceType: string;
    cost: number;
  }[];
  totalSpent: number;
  lastVisit: string;
  notes: string;
}

const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Juan Dela Cruz',
    phone: '0917-123-4567',
    email: 'juan.delacruz@email.com',
    address: 'Quezon City, Metro Manila',
    motorcycles: [
      {
        brand: 'Honda',
        model: 'Click 150i',
        plateNumber: 'ABC-1234',
        year: 2022
      }
    ],
    serviceHistory: [
      { id: 'SRV-001', date: '2025-12-08', serviceType: 'Oil Change & Tune-up', cost: 1050 },
      { id: 'SRV-015', date: '2025-11-05', serviceType: 'Tire Replacement', cost: 2800 },
      { id: 'SRV-028', date: '2025-10-12', serviceType: 'Brake Repair', cost: 1500 }
    ],
    totalSpent: 5350,
    lastVisit: '2025-12-08',
    notes: 'Prefers genuine Honda parts. Regular customer.'
  },
  {
    id: 'CUST-002',
    name: 'Maria Garcia',
    phone: '0918-234-5678',
    email: 'maria.garcia@email.com',
    address: 'Makati City, Metro Manila',
    motorcycles: [
      {
        brand: 'Yamaha',
        model: 'NMAX',
        plateNumber: 'XYZ-5678',
        year: 2023
      }
    ],
    serviceHistory: [
      { id: 'SRV-002', date: '2025-12-08', serviceType: 'Brake Repair', cost: 0 }
    ],
    totalSpent: 3200,
    lastVisit: '2025-12-08',
    notes: 'New customer. Referred by Juan Dela Cruz.'
  },
  {
    id: 'CUST-003',
    name: 'Robert Tan',
    phone: '0919-345-6789',
    email: 'robert.tan@email.com',
    address: 'Pasig City, Metro Manila',
    motorcycles: [
      {
        brand: 'Suzuki',
        model: 'Raider R150',
        plateNumber: 'DEF-9012',
        year: 2020
      },
      {
        brand: 'Honda',
        model: 'XRM 125',
        plateNumber: 'GHI-3456',
        year: 2019
      }
    ],
    serviceHistory: [
      { id: 'SRV-003', date: '2025-12-06', serviceType: 'Engine Overhaul', cost: 8000 },
      { id: 'SRV-012', date: '2025-11-15', serviceType: 'Oil Change', cost: 850 },
      { id: 'SRV-023', date: '2025-10-20', serviceType: 'Electrical Repair', cost: 2300 }
    ],
    totalSpent: 11150,
    lastVisit: '2025-12-06',
    notes: 'Fleet owner. Owns 2 motorcycles. VIP customer.'
  },
  {
    id: 'CUST-004',
    name: 'Anna Lopez',
    phone: '0920-456-7890',
    email: 'anna.lopez@email.com',
    address: 'Mandaluyong City, Metro Manila',
    motorcycles: [
      {
        brand: 'Honda',
        model: 'BeAT',
        plateNumber: 'GHI-3456',
        year: 2021
      }
    ],
    serviceHistory: [
      { id: 'SRV-004', date: '2025-12-07', serviceType: 'Tire Replacement', cost: 3100 },
      { id: 'SRV-018', date: '2025-11-10', serviceType: 'Oil Change', cost: 800 }
    ],
    totalSpent: 3900,
    lastVisit: '2025-12-07',
    notes: 'Student. Regular maintenance customer.'
  }
];

export function CustomersPage({ onNavigate, onLogout }: CustomersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    toast.success('Customer added successfully');
    setIsAddDialogOpen(false);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsDialogOpen(true);
  };

  const stats = {
    total: customers.length,
    newThisMonth: 2,
    vip: customers.filter(c => c.totalSpent > 10000).length,
    averageSpent: Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length)
  };

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentPage="customers" onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-foreground">Customer Management</h1>
                <p className="text-muted-foreground mt-1">Manage customer profiles and service history</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter customer name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="0917-XXX-XXXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="customer@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="City, Province" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Additional notes about the customer..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCustomer} className="bg-primary hover:bg-primary/90">
                      Add Customer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">Total Customers</p>
                      <p className="text-foreground mt-1">{stats.total}</p>
                    </div>
                    <User className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">New This Month</p>
                      <p className="text-foreground mt-1">{stats.newThisMonth}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">VIP Customers</p>
                      <p className="text-foreground mt-1">{stats.vip}</p>
                    </div>
                    <Badge className="bg-yellow-500 text-black px-3 py-1">VIP</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">Avg. Spent</p>
                      <p className="text-foreground mt-1">₱{stats.averageSpent.toFixed(2)}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, phone, email, or customer ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground">{customer.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{customer.id}</p>
                        </div>
                      </div>
                      {customer.totalSpent > 10000 && (
                        <Badge className="bg-yellow-500 text-black">VIP</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{customer.address}</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-muted-foreground text-xs">Motorcycles</p>
                          <p className="text-foreground">{customer.motorcycles.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Services</p>
                          <p className="text-foreground">{customer.serviceHistory.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Total Spent</p>
                          <p className="text-foreground">₱{customer.totalSpent.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleViewDetails(customer)}
                      className="w-full bg-primary/10 hover:bg-primary/20 text-primary"
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCustomers.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No customers found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="motorcycles">Motorcycles</TabsTrigger>
                <TabsTrigger value="history">Service History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer ID</Label>
                    <p className="text-foreground">{selectedCustomer.id}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <p className="text-foreground">{selectedCustomer.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <p className="text-foreground">{selectedCustomer.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <p className="text-foreground">{selectedCustomer.email}</p>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Address</Label>
                    <p className="text-foreground">{selectedCustomer.address}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Visit</Label>
                    <p className="text-foreground">{selectedCustomer.lastVisit}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Spent</Label>
                    <p className="text-foreground">₱{selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Notes</Label>
                    <p className="text-foreground">{selectedCustomer.notes}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="motorcycles" className="space-y-4">
                {selectedCustomer.motorcycles.map((motorcycle, index) => (
                  <Card key={index} className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Brand & Model</p>
                          <p className="text-foreground">{motorcycle.brand} {motorcycle.model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Plate Number</p>
                          <p className="text-foreground">{motorcycle.plateNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Year</p>
                          <p className="text-foreground">{motorcycle.year}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                {selectedCustomer.serviceHistory.map((service) => (
                  <Card key={service.id} className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Wrench className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-foreground">{service.serviceType}</p>
                            <p className="text-sm text-muted-foreground">{service.id} • {service.date}</p>
                          </div>
                        </div>
                        <p className="text-foreground">₱{service.cost.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
