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
  Wrench, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Phone,
  Calendar,
  FileText,
  Activity,
  History
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings' | 'services' | 'customers' | 'mechanics';

interface ServiceManagementPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface ServiceJob {
  id: string;
  customerName: string;
  customerPhone: string;
  motorcycleBrand: string;
  motorcycleModel: string;
  plateNumber: string;
  serviceType: string[];
  assignedMechanic: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dateReceived: string;
  estimatedCompletion: string;
  description: string;
  partsUsed: { name: string; quantity: number; price: number }[];
  laborCost: number;
  totalCost: number;
}

interface Mechanic {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'off-duty';
}

const mockMechanics: Mechanic[] = [
  { id: 'MECH-001', name: 'Mario Santos', status: 'busy' },
  { id: 'MECH-002', name: 'Pedro Reyes', status: 'available' },
  { id: 'MECH-003', name: 'Jose Cruz', status: 'available' },
  { id: 'MECH-004', name: 'Miguel Rivera', status: 'busy' },
];

const serviceTypeOptions = [
  { id: 'oil-change', label: 'Oil Change & Tune-up' },
  { id: 'brake', label: 'Brake Repair' },
  { id: 'engine', label: 'Engine Overhaul' },
  { id: 'tire', label: 'Tire Replacement' },
  { id: 'electrical', label: 'Electrical Repair' },
  { id: 'suspension', label: 'Suspension Repair' },
  { id: 'bodywork', label: 'Bodywork & Paint' },
  { id: 'other', label: 'Other' },
];

const mockServiceJobs: ServiceJob[] = [
  {
    id: 'SRV-001',
    customerName: 'Juan Dela Cruz',
    customerPhone: '0917-123-4567',
    motorcycleBrand: 'Honda',
    motorcycleModel: 'Click 150i',
    plateNumber: 'ABC-1234',
    serviceType: ['Oil Change & Tune-up'],
    assignedMechanic: 'Mario Santos',
    status: 'in-progress',
    dateReceived: '2026-03-07 09:30 AM',
    estimatedCompletion: '2026-03-07',
    description: 'Regular maintenance - oil change, spark plug replacement, air filter cleaning',
    partsUsed: [
      { name: 'Engine Oil (1L)', quantity: 1, price: 450 },
      { name: 'Oil Filter', quantity: 1, price: 120 },
      { name: 'Spark Plug', quantity: 1, price: 180 }
    ],
    laborCost: 300,
    totalCost: 1050
  },
  {
    id: 'SRV-002',
    customerName: 'Maria Garcia',
    customerPhone: '0918-234-5678',
    motorcycleBrand: 'Yamaha',
    motorcycleModel: 'NMAX',
    plateNumber: 'XYZ-5678',
    serviceType: ['Brake Repair'],
    assignedMechanic: 'Pedro Reyes',
    status: 'pending',
    dateReceived: '2026-03-07 10:15 AM',
    estimatedCompletion: '2026-03-08',
    description: 'Front brake not working properly, needs inspection and repair',
    partsUsed: [],
    laborCost: 0,
    totalCost: 0
  },
  {
    id: 'SRV-003',
    customerName: 'Robert Tan',
    customerPhone: '0919-345-6789',
    motorcycleBrand: 'Suzuki',
    motorcycleModel: 'Raider R150',
    plateNumber: 'DEF-9012',
    serviceType: ['Engine Overhaul', 'Oil Change & Tune-up'],
    assignedMechanic: 'Mario Santos',
    status: 'in-progress',
    dateReceived: '2026-03-05 02:00 PM',
    estimatedCompletion: '2026-03-10',
    description: 'Complete engine overhaul - piston replacement, valve adjustment, timing chain',
    partsUsed: [
      { name: 'Piston Kit', quantity: 1, price: 2500 },
      { name: 'Gasket Set', quantity: 1, price: 800 },
      { name: 'Timing Chain', quantity: 1, price: 1200 }
    ],
    laborCost: 3500,
    totalCost: 8000
  },
  {
    id: 'SRV-004',
    customerName: 'Anna Lopez',
    customerPhone: '0920-456-7890',
    motorcycleBrand: 'Honda',
    motorcycleModel: 'BeAT',
    plateNumber: 'GHI-3456',
    serviceType: ['Tire Replacement'],
    assignedMechanic: 'Pedro Reyes',
    status: 'completed',
    dateReceived: '2026-03-06 11:00 AM',
    estimatedCompletion: '2026-03-06',
    description: 'Replace front and rear tires',
    partsUsed: [
      { name: 'Front Tire', quantity: 1, price: 1200 },
      { name: 'Rear Tire', quantity: 1, price: 1500 }
    ],
    laborCost: 400,
    totalCost: 3100
  }
];

export function ServiceManagementPage({ onNavigate, onLogout }: ServiceManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceJobs, setServiceJobs] = useState<ServiceJob[]>(mockServiceJobs);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Generate current date and time when dialog opens
  const handleDialogOpen = (open: boolean) => {
    if (open) {
      const now = new Date();
      const dateTimeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentDateTime(dateTimeString);
      setSelectedServiceTypes([]);
    }
    setIsAddDialogOpen(open);
  };

  const handleServiceTypeToggle = (typeId: string) => {
    setSelectedServiceTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const filteredJobs = serviceJobs.filter(job => {
    const matchesSearch = 
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.motorcycleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.motorcycleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Filter jobs for monitoring (active jobs: pending and in-progress)
  const monitoringJobs = filteredJobs.filter(job => 
    job.status === 'pending' || job.status === 'in-progress'
  );

  // Filter jobs for tracking (completed and cancelled jobs)
  const trackingJobs = filteredJobs.filter(job => 
    job.status === 'completed' || job.status === 'cancelled'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Wrench className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getMechanicStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'busy': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'off-duty': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const handleAddService = () => {
    toast.success('Service job created successfully');
    setIsAddDialogOpen(false);
  };

  const handleUpdateStatus = (jobId: string, newStatus: ServiceJob['status']) => {
    setServiceJobs(jobs => 
      jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job)
    );
    toast.success(`Service ${jobId} status updated to ${newStatus}`);
  };

  const stats = {
    pending: serviceJobs.filter(j => j.status === 'pending').length,
    inProgress: serviceJobs.filter(j => j.status === 'in-progress').length,
    completed: serviceJobs.filter(j => j.status === 'completed').length,
    total: serviceJobs.length
  };

  const renderServiceCard = (job: ServiceJob) => (
    <Card key={job.id} className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-foreground">{job.id}</CardTitle>
              <Badge className={getStatusColor(job.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(job.status)}
                  {job.status}
                </span>
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {job.serviceType.map((type, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {job.status === 'pending' && (
              <Button 
                size="sm" 
                onClick={() => handleUpdateStatus(job.id, 'in-progress')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Service
              </Button>
            )}
            {job.status === 'in-progress' && (
              <Button 
                size="sm" 
                onClick={() => handleUpdateStatus(job.id, 'completed')}
                className="bg-green-600 hover:bg-green-700"
              >
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="text-sm">Customer</span>
            </div>
            <p className="text-foreground">{job.customerName}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span className="text-sm">{job.customerPhone}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Motorcycle</p>
            <p className="text-foreground">{job.motorcycleBrand} {job.motorcycleModel}</p>
            <p className="text-sm text-muted-foreground">Plate: {job.plateNumber}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Assigned Mechanic</p>
            <p className="text-foreground">{job.assignedMechanic}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span className="text-sm">Due: {job.estimatedCompletion}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-3">
          <p className="text-sm text-muted-foreground mb-1">Date Received</p>
          <p className="text-foreground text-sm">{job.dateReceived}</p>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-sm text-muted-foreground mb-2">Service Description</p>
          <p className="text-foreground">{job.description}</p>
        </div>

        {job.partsUsed.length > 0 && (
          <div className="border-t border-border pt-3">
            <p className="text-sm text-muted-foreground mb-2">Parts Used</p>
            <div className="space-y-1">
              {job.partsUsed.map((part, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">
                    {part.name} x{part.quantity}
                  </span>
                  <span className="text-muted-foreground">
                    ₱{part.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {job.status === 'completed' && (
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Labor Cost</p>
                <p className="text-foreground">₱{job.laborCost.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-foreground">₱{job.totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentPage="services" onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-foreground">Service Management</h1>
                <p className="text-muted-foreground mt-1">Track repairs, maintenance, and service history</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Service Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Service Job</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-name">Customer Name</Label>
                        <Input id="customer-name" placeholder="Enter customer name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-phone">Phone Number</Label>
                        <Input id="customer-phone" placeholder="0917-XXX-XXXX" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="motorcycle-brand">Brand</Label>
                        <Select>
                          <SelectTrigger id="motorcycle-brand">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="honda">Honda</SelectItem>
                            <SelectItem value="yamaha">Yamaha</SelectItem>
                            <SelectItem value="suzuki">Suzuki</SelectItem>
                            <SelectItem value="kawasaki">Kawasaki</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motorcycle-model">Model</Label>
                        <Input id="motorcycle-model" placeholder="Model" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plate-number">Plate Number</Label>
                        <Input id="plate-number" placeholder="ABC-1234" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Service Type (Select multiple)</Label>
                      <Card className="bg-card/50 border-border">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-3">
                            {serviceTypeOptions.map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={option.id}
                                  checked={selectedServiceTypes.includes(option.id)}
                                  onCheckedChange={() => handleServiceTypeToggle(option.id)}
                                />
                                <label
                                  htmlFor={option.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mechanic">Assign Mechanic</Label>
                      <Select>
                        <SelectTrigger id="mechanic">
                          <SelectValue placeholder="Select mechanic" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockMechanics.map((mechanic) => (
                            <SelectItem key={mechanic.id} value={mechanic.id}>
                              <div className="flex items-center justify-between w-full gap-2">
                                <span>{mechanic.name}</span>
                                <Badge className={getMechanicStatusColor(mechanic.status)}>
                                  {mechanic.status}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Service Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe the service or issue..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date Received (Auto-generated)</Label>
                        <Input value={currentDateTime} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimated-completion">Estimated Completion</Label>
                        <Input id="estimated-completion" type="date" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddService} className="bg-primary hover:bg-primary/90">
                      Create Service Job
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
                      <p className="text-muted-foreground">Pending</p>
                      <p className="text-foreground mt-1">{stats.pending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">In Progress</p>
                      <p className="text-foreground mt-1">{stats.inProgress}</p>
                    </div>
                    <Wrench className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">Completed</p>
                      <p className="text-foreground mt-1">{stats.completed}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">Total Jobs</p>
                      <p className="text-foreground mt-1">{stats.total}</p>
                    </div>
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by ID, customer, motorcycle, or plate number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Monitoring and Tracking */}
            <Tabs defaultValue="monitoring" className="w-full">
              <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                <TabsTrigger value="monitoring" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Monitoring
                </TabsTrigger>
                <TabsTrigger value="tracking" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Tracking
                </TabsTrigger>
              </TabsList>

              <TabsContent value="monitoring" className="space-y-4 mt-4">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Active Service Jobs</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Monitor ongoing and pending service jobs
                    </p>
                  </CardHeader>
                </Card>
                
                {monitoringJobs.map((job) => renderServiceCard(job))}
                
                {monitoringJobs.length === 0 && (
                  <Card className="bg-card border-border">
                    <CardContent className="p-12 text-center">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No active service jobs</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4 mt-4">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Service History</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Track completed and cancelled service jobs
                    </p>
                  </CardHeader>
                </Card>
                
                {trackingJobs.map((job) => renderServiceCard(job))}
                
                {trackingJobs.length === 0 && (
                  <Card className="bg-card border-border">
                    <CardContent className="p-12 text-center">
                      <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No service history found</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}