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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';

import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

import { toast } from 'sonner';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../ui/tabs';

import { Checkbox } from '../ui/checkbox';

type Page =
  | 'dashboard'
  | 'pos'
  | 'inventory'
  | 'sales'
  | 'settings'
  | 'services'
  | 'customers'
  | 'mechanics';

interface ServiceManagementPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

/* --- Interfaces --- */

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

/* --- MOCK DATA (unchanged) --- */

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
    description:
      'Regular maintenance - oil change, spark plug replacement, air filter cleaning',
    partsUsed: [
      { name: 'Engine Oil (1L)', quantity: 1, price: 450 },
      { name: 'Oil Filter', quantity: 1, price: 120 },
      { name: 'Spark Plug', quantity: 1, price: 180 }
    ],
    laborCost: 300,
    totalCost: 1050
  }
];

/* --- COMPONENT --- */

export function ServiceManagementPage({
  onNavigate,
  onLogout
}: ServiceManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceJobs, setServiceJobs] =
    useState<ServiceJob[]>(mockServiceJobs);

  const [selectedStatus, setSelectedStatus] =
    useState<string>('all');

  const [isAddDialogOpen, setIsAddDialogOpen] =
    useState(false);

  /* --- FILTERING --- */

  const filteredJobs = serviceJobs.filter(job => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ||
      job.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const monitoringJobs = filteredJobs.filter(
    job =>
      job.status === 'pending' ||
      job.status === 'in-progress'
  );

  const trackingJobs = filteredJobs.filter(
    job =>
      job.status === 'completed' ||
      job.status === 'cancelled'
  );

  /* --- STATUS COLORS --- */

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
    }
  };

  /* --- STATS --- */

  const stats = {
    pending: serviceJobs.filter(
      j => j.status === 'pending'
    ).length,
    inProgress: serviceJobs.filter(
      j => j.status === 'in-progress'
    ).length,
    completed: serviceJobs.filter(
      j => j.status === 'completed'
    ).length,
    total: serviceJobs.length
  };

  /* --- UI --- */

  return (
    <div className="dark min-h-screen bg-background flex flex-col">

      {/* NAVBAR */}
      <Navbar onLogout={onLogout} />

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar
          currentPage="services"
          onNavigate={onNavigate}
        />

        {/* CONTENT */}
        <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">

          <div className="max-w-7xl mx-auto p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">

              <div>
                <h1 className="text-foreground">
                  Service Management
                </h1>

                <p className="text-muted-foreground">
                  Track repairs and maintenance
                </p>
              </div>

              <Dialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
              >
                <DialogTrigger asChild>

                  <Button>

                    <Plus className="w-4 h-4 mr-2" />

                    New Service Job

                  </Button>

                </DialogTrigger>

                <DialogContent>

                  <DialogHeader>

                    <DialogTitle>

                      Create New Service Job

                    </DialogTitle>

                  </DialogHeader>

                </DialogContent>

              </Dialog>

            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-4 gap-4">

              <Card>

                <CardContent className="p-6">

                  Pending: {stats.pending}

                </CardContent>

              </Card>

              <Card>

                <CardContent className="p-6">

                  In Progress: {stats.inProgress}

                </CardContent>

              </Card>

              <Card>

                <CardContent className="p-6">

                  Completed: {stats.completed}

                </CardContent>

              </Card>

              <Card>

                <CardContent className="p-6">

                  Total: {stats.total}

                </CardContent>

              </Card>

            </div>

            {/* SEARCH */}
            <Card>

              <CardContent className="p-4 flex gap-4">

                <Search />

                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={e =>
                    setSearchTerm(e.target.value)
                  }
                />

              </CardContent>

            </Card>

            {/* TABS */}
            <Tabs defaultValue="monitoring">

              <TabsList>

                <TabsTrigger value="monitoring">

                  Monitoring

                </TabsTrigger>

                <TabsTrigger value="tracking">

                  Tracking

                </TabsTrigger>

              </TabsList>

              <TabsContent value="monitoring">

                {monitoringJobs.map(job => (

                  <Card key={job.id}>

                    <CardContent className="p-4">

                      <div className="flex justify-between">

                        <span>{job.id}</span>

                        <Badge
                          className={getStatusColor(
                            job.status
                          )}
                        >
                          {job.status}
                        </Badge>

                      </div>

                    </CardContent>

                  </Card>

                ))}

              </TabsContent>

              <TabsContent value="tracking">

                {trackingJobs.map(job => (

                  <Card key={job.id}>

                    <CardContent className="p-4">

                      <div className="flex justify-between">

                        <span>{job.id}</span>

                        <Badge
                          className={getStatusColor(
                            job.status
                          )}
                        >
                          {job.status}
                        </Badge>

                      </div>

                    </CardContent>

                  </Card>

                ))}

              </TabsContent>

            </Tabs>

          </div>

        </main>

      </div>

    </div>
  );
}