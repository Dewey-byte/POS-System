import { useEffect, useState } from 'react';
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
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings' | 'services' | 'customers' | 'mechanics';

interface CustomersPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface Motorcycle {
  brand: string;
  model: string;
  plate_number: string;
  year: number;
}

interface Service {
  id: string;
  service_date: string;
  service_type: string;
  cost: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  motorcycles: Motorcycle[];
  service_history: Service[];
  total_spent: number;
  last_visit: string;
  notes: string;
  is_vip: boolean;
}

export function CustomersPage({ onNavigate, onLogout }: CustomersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // -----------------------------
  // Fetch customers from API
  // -----------------------------
  const fetchCustomers = () => {
    fetch('http://127.0.0.1:5000/api/customers/')
      .then(res => res.json())
      .then((data: any[]) =>
        setCustomers(data.map(c => ({
          ...c,
          last_visit: c.LastVisit,
          is_vip: c.isVip
        })))
      )
      .catch(() => toast.error('Failed to fetch customers'));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -----------------------------
  // Add customer
  // -----------------------------
  const handleAddCustomer = (newCustomer: Partial<Customer>) => {
    fetch('http://127.0.0.1:5000/api/customers/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newCustomer,
        LastVisit: newCustomer.last_visit
      })
    })
      .then(res => res.json())
      .then(() => {
        toast.success('Customer added successfully');
        fetchCustomers();
      })
      .catch(() => toast.error('Failed to add customer'));
    setIsAddDialogOpen(false);
  };

  // -----------------------------
  // Delete customer
  // -----------------------------
  const handleDeleteCustomer = (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    fetch(`http://127.0.0.1:5000/api/customers/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        toast.success('Customer deleted successfully');
        fetchCustomers();
      })
      .catch(() => toast.error('Failed to delete customer'));
    setIsDetailsDialogOpen(false);
  };

  // -----------------------------
  // View details
  // -----------------------------
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsDialogOpen(true);
  };

  // -----------------------------
  // Stats
  // -----------------------------
  const stats = {
    total: customers.length,
    newThisMonth: customers.filter(c => {
      if (!c.last_visit) return false;
      const last = new Date(c.last_visit);
      const now = new Date();
      return last.getMonth() === now.getMonth() && last.getFullYear() === now.getFullYear();
    }).length,
    vip: customers.filter(c => c.total_spent > 10000).length,
    averageSpent: customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.total_spent, 0) / customers.length) : 0
  };

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar onLogout={onLogout} name={''} />
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

              {/* Add Customer Dialog */}
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
                        <Label htmlFor="add-name">Full Name</Label>
                        <Input id="add-name" placeholder="Enter customer name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-phone">Phone Number</Label>
                        <Input id="add-phone" placeholder="0917-XXX-XXXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-email">Email Address</Label>
                      <Input id="add-email" type="email" placeholder="customer@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-address">Address</Label>
                      <Input id="add-address" placeholder="City, Province" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-notes">Notes</Label>
                      <Textarea id="add-notes" placeholder="Additional notes..." rows={3} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleAddCustomer({
                      id: crypto.randomUUID(),
                      name: (document.getElementById('add-name') as HTMLInputElement).value,
                      phone: (document.getElementById('add-phone') as HTMLInputElement).value,
                      email: (document.getElementById('add-email') as HTMLInputElement).value,
                      address: (document.getElementById('add-address') as HTMLInputElement).value,
                      notes: (document.getElementById('add-notes') as HTMLTextAreaElement).value,
                      total_spent: 0,
                      last_visit: new Date().toISOString().split('T')[0],
                      motorcycles: [],
                      service_history: [],
                      is_vip: false
                    })} className="bg-primary hover:bg-primary/90">
                      Add Customer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card><CardContent className="p-6"><p>Total Customers: {stats.total}</p></CardContent></Card>
              <Card><CardContent className="p-6"><p>New This Month: {stats.newThisMonth}</p></CardContent></Card>
              <Card><CardContent className="p-6"><p>VIP Customers: {stats.vip}</p></CardContent></Card>
              <Card><CardContent className="p-6"><p>Average Spent: ₱{stats.averageSpent}</p></CardContent></Card>
            </div>

            {/* Search */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCustomers.map(customer => (
                <Card key={customer.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{customer.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{customer.id}</p>
                      </div>
                    </div>
                    {customer.is_vip && <Badge className="bg-yellow-500 text-black">VIP</Badge>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {customer.phone}</div>
                      <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {customer.email}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {customer.address}</div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>Motorcycles: {customer.motorcycles.length}</div>
                        <div>Services: {customer.service_history.length}</div>
                        <div>Total Spent: ₱{customer.total_spent}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleViewDetails(customer)} className="w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Customer Details</DialogTitle></DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              <p>ID: {selectedCustomer.id}</p>
              <p>Name: {selectedCustomer.name}</p>
              <p>Phone: {selectedCustomer.phone}</p>
              <p>Email: {selectedCustomer.email}</p>
              <p>Address: {selectedCustomer.address}</p>
              <p>Total Spent: ₱{selectedCustomer.total_spent}</p>
              <p>Notes: {selectedCustomer.notes}</p>

              <Button variant="destructive" onClick={() => handleDeleteCustomer(selectedCustomer.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Customer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}