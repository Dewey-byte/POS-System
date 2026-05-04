import { useState, useEffect } from 'react';
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
  Mail,
  Wrench,
  CheckCircle,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings' | 'services' | 'mechanics';

interface MechanicsPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface Mechanic {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialization: string;
  experience: number;
  status: 'available' | 'busy' | 'off-duty';
  current_jobs: number;
  completed_jobs: number;
  active_jobs: {
    id: string;
    customerName: string;
    serviceType: string;
    status: string;
  }[];
}

export function MechanicsPage({ onNavigate, onLogout }: MechanicsPageProps) {

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userRole = user?.role || "cashier"; // default to cashier if not found

  const [searchTerm, setSearchTerm] = useState('');
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/mechanics/');
      const data = await res.json();

    const normalized = (data || []).map((m: any) => ({
      id: m?.id ?? '',
      name: m?.name ?? '',
      phone: m?.phone ?? '',
      email: m?.email ?? '',
      specialization: m?.specialization ?? '',
      experience: m?.experience ?? 0,
      status: m?.status ?? 'available',
      current_jobs: m?.current_jobs ?? 0,
      completed_jobs: m?.completed_jobs ?? 0,
      active_jobs: m?.active_jobs ?? []
    }));

      setMechanics(normalized);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load mechanics');
    }
  };

const filteredMechanics = mechanics.filter(mechanic => {
  const name = mechanic?.name ?? '';
  const specialization = mechanic?.specialization ?? '';
  const id = mechanic?.id ?? '';

  return (
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    id.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  // ✅ ADD MECHANIC → BACKEND
  const handleAddMechanic = async () => {
    try {
      const newMechanic = {
        name: (document.getElementById('name') as HTMLInputElement).value,
        phone: (document.getElementById('phone') as HTMLInputElement).value,
        email: (document.getElementById('email') as HTMLInputElement).value,
        specialization: 'General',
        experience: Number((document.getElementById('experience') as HTMLInputElement).value),

        // keep UI compatible
        status: 'available',
        current_jobs: 0,
        completed_jobs: 0,
      
        active_jobs: []
      };

      const res = await fetch('http://localhost:5000/api/mechanics/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMechanic),
      });

      const data = await res.json();

      setMechanics(prev => [...prev, {
        ...data,
        status: data.status || 'available',
        current_jobs: data.current_jobs || 0,
        completed_jobs: data.completed_jobs || 0,    
        active_jobs: data.active_jobs || []
      }]);

      toast.success('Mechanic added successfully');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Error adding mechanic');
    }
  };

  const handleViewDetails = (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
    setIsDetailsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'busy': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'off-duty': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const stats = {
    total: mechanics.length,
    available: mechanics.filter(m => m.status === 'available').length,
    busy: mechanics.filter(m => m.status === 'busy').length,
    totalCompleted: mechanics.reduce((sum, m) => sum + m.completed_jobs, 0)
  };

  function setIsOpen(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }
  
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


  return (
    <div className="dark h-screen bg-background flex flex-col ">
      <Navbar onLogout={onLogout} role={user?.role || ""} name={''} />
       <div className="flex flex-1 overflow-hidden">
        
       <Sidebar currentPage="mechanics" onNavigate={onNavigate} userRole={userRole} />
        
         <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* EVERYTHING BELOW IS UNCHANGED */}


  
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-foreground">Mechanic Management</h1>
                <p className="text-muted-foreground mt-1">Manage mechanic profiles and job assignments</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Mechanic
                  </Button>
                </DialogTrigger>
                
                   <DialogContent className="sm:max-w-2xl">
        {/* Centered automatically by shadcn/radix */}
        <DialogHeader>
          <DialogTitle>Add New Mechanic</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter mechanic name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="0917-XXX-XXXX" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="mechanic@shop.com" />
          </div>

          {/* Specialization + Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Select>
                <SelectTrigger id="specialization">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="engine">Engine Specialist</SelectItem>
                  <SelectItem value="brake">Brake & Suspension</SelectItem>
                  <SelectItem value="electrical">Electrical Systems</SelectItem>
                  <SelectItem value="general">General Maintenance</SelectItem>
                  <SelectItem value="bodywork">Bodywork & Paint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" type="number" placeholder="0" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-border pt-4">

          <Button
            onClick={handleAddMechanic}
            className="bg-primary hover:bg-primary/90"
          >
            Add Mechanic
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
                      <p className="text-muted-foreground">Total Mechanics</p>
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
                      <p className="text-muted-foreground">Available</p>
                      <p className="text-foreground mt-1">{stats.available}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">Currently Busy</p>
                      <p className="text-foreground mt-1">{stats.busy}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">Total Jobs Done</p>
                      <p className="text-foreground mt-1">{stats.totalCompleted}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500" />
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
                    placeholder="Search by name, specialization, or mechanic ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

          {/* Mechanics Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {filteredMechanics.map((mechanic) => (
    <Card key={mechanic.id} className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-primary" />
            </div>

            <div>
              <CardTitle className="text-foreground">
                {mechanic.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {mechanic.id}
              </p>
            </div>
          </div>

          <Badge className={getStatusColor(mechanic.status)}>
            {mechanic.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              {mechanic.specialization}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              {mechanic.phone}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              {mechanic.email}
            </span>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="text-muted-foreground text-xs">
                Active Jobs
              </p>
              <p className="text-foreground">
                {mechanic.current_jobs}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs">
                Completed
              </p>
              <p className="text-foreground">
                {mechanic.completed_jobs}
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <Button
          onClick={() => handleViewDetails(mechanic)}
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary"
          variant="outline"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  ))}
</div>

            {filteredMechanics.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No mechanics found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Mechanic Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mechanic Details</DialogTitle>
          </DialogHeader>
          {selectedMechanic && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mechanic ID</Label>
                  <p className="text-foreground">{selectedMechanic.id}</p>
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <p className="text-foreground">{selectedMechanic.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <p className="text-foreground">{selectedMechanic.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <p className="text-foreground">{selectedMechanic.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <p className="text-foreground">{selectedMechanic.specialization}</p>
                </div>
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <p className="text-foreground">{selectedMechanic.experience} years</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedMechanic.status)}>
                    {selectedMechanic.status}
                  </Badge>
                </div>

              </div>

              {/* Performance */}
              <div className="space-y-2">
                <Label>Performance</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Active Jobs</p>
                      <p className="text-foreground">{selectedMechanic.current_jobs}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Completed Jobs</p>
                      <p className="text-foreground">{selectedMechanic.completed_jobs}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Active Jobs */}
              {selectedMechanic.active_jobs.length > 0 && (
                <div className="space-y-2">
                  <Label>Active Jobs</Label>
                  <div className="space-y-2">
                    {selectedMechanic.active_jobs.map((job) => (
                      <Card key={job.id} className="bg-card/50 border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-foreground">{job.serviceType}</p>
                              <p className="text-sm text-muted-foreground">{job.id} • {job.customerName}</p>
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                              {job.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
