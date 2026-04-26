import { useState, useEffect } from "react";
import axios from "axios";

import { Navbar } from "../layout/Navbar";
import { Sidebar } from "../layout/Sidebar";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

import { Search, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";

import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../ui/tabs";

/* TYPES */

type Page =
  | "dashboard"
  | "pos"
  | "inventory"
  | "sales"
  | "settings"
  | "services"
  | "customers"
  | "mechanics";

interface Props {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface PartUsed {
  name: string;
  quantity: number;
  price: number;
}

interface ServiceJob {
  id: string;
  customerName: string;
  motorcycleBrand: string;
  motorcycleModel: string;
  plateNumber: string;
  serviceType: string[];
  assignedMechanic: string;
  partsUsed: PartUsed[];
  laborCost: number;
  totalCost: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
}

export function ServiceManagementPage({
  onNavigate,
  onLogout
}: Props) {

  const [serviceJobs, setServiceJobs] = useState<ServiceJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newJob, setNewJob] = useState<ServiceJob>({
    id: "",
    customerName: "",
    motorcycleBrand: "",
    motorcycleModel: "",
    plateNumber: "",
    serviceType: [],
    assignedMechanic: "",
    partsUsed: [],
    laborCost: 0,
    totalCost: 0,
    status: "pending"
  });

  const [newPart, setNewPart] = useState<PartUsed>({
    name: "",
    quantity: 1,
    price: 0
  });

  /* FETCH */

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/sales/service-records"
      );

      const formatted = res.data.map((item: any) => ({
        id: item.id,
        customerName: item.customer_name ?? "",
        motorcycleBrand: item.motorcycle_brand ?? "",
        motorcycleModel: item.motorcycle_model ?? "",
        plateNumber: item.plate_number ?? "",
        serviceType: item.service_type ? [item.service_type] : [],
        assignedMechanic: item.mechanic_name ?? "",
        partsUsed: item.parts_used ? JSON.parse(item.parts_used) : [],
        laborCost: item.labor_cost ?? 0,
        totalCost: item.total ?? 0,
        status: item.status ?? "pending"
      }));

      setServiceJobs(formatted);

    } catch (err) {
      toast.error("Failed loading service records");
    }
  };

  /* ADD PART */

  const addPart = () => {
    setNewJob(prev => ({
      ...prev,
      partsUsed: [...prev.partsUsed, newPart]
    }));

    setNewPart({ name: "", quantity: 1, price: 0 });
  };

  /* CREATE JOB */

  const createServiceJob = async () => {
    try {
      const payload = {
        customer_name: newJob.customerName,
        service_type: newJob.serviceType[0],
        motorcycle_brand: newJob.motorcycleBrand,
        motorcycle_model: newJob.motorcycleModel,
        plate_number: newJob.plateNumber,
        mechanic_name: newJob.assignedMechanic,
        parts_used: newJob.partsUsed,
        labor_cost: newJob.laborCost,
        total:
          newJob.partsUsed.reduce(
            (sum, part) => sum + part.price * part.quantity,
            0
          ) + newJob.laborCost,
        status: newJob.status
      };

      const res = await axios.post(
        "http://localhost:5000/api/sales/service-records",
        payload
      );

      const created = res.data.created?.[0];

      setServiceJobs(prev => [
        ...prev,
        {
          id: created?.id || "NEW",
          customerName: newJob.customerName,
          motorcycleBrand: newJob.motorcycleBrand,
          motorcycleModel: newJob.motorcycleModel,
          plateNumber: newJob.plateNumber,
          serviceType: newJob.serviceType,
          assignedMechanic: newJob.assignedMechanic,
          partsUsed: newJob.partsUsed,
          laborCost: newJob.laborCost,
          totalCost:
            newJob.partsUsed.reduce(
              (sum, part) => sum + part.price * part.quantity,
              0
            ) + newJob.laborCost,
          status: created?.status || "pending"
        }
      ]);

      toast.success("Service job created successfully");
      setIsAddDialogOpen(false);

    } catch (err) {
      toast.error("Failed creating service job");
    }
  };

  /* FILTER (FIXED SAFE VERSION) */

  const filteredJobs = serviceJobs.filter(job => {
    const q = searchTerm.toLowerCase();

    return (
      (job.customerName ?? "").toLowerCase().includes(q) ||
      (job.id ?? "").toLowerCase().includes(q)
    );
  });

  const monitoringJobs = filteredJobs.filter(
    j => j.status === "pending" || j.status === "in-progress"
  );

  const trackingJobs = filteredJobs.filter(
    j => j.status === "completed" || j.status === "cancelled"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "in-progress":
        return "bg-blue-500/20 text-blue-500";
      case "completed":
        return "bg-green-500/20 text-green-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="dark min-h-screen bg-background flex flex-col">

      <Navbar onLogout={onLogout} name="" />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar currentPage="services" onNavigate={onNavigate} />

        <main className="flex-1 overflow-y-auto">

          <div className="max-w-7xl mx-auto p-6 space-y-6">

            {/* HEADER */}
               <div className="p-6 border-b border-border bg-background sticky top-0 z-10">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-foreground">
              Service Management
              </h1>

              <p className="text-muted-foreground mt-1">
            Track repairs and maintenance
              </p>
            </div>
          </div>
            <div className="flex justify-between items-center">

             

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>

                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    New Service Job
                  </Button>
                </DialogTrigger>

        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 border-none">
  <DialogHeader>
    <DialogTitle className="text-xl font-bold">Create New Service Job</DialogTitle>
  </DialogHeader>

  <div className="space-y-6 py-4">
    {/* CUSTOMER & PHONE */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Customer Name</label>
        <Input
          placeholder="Enter customer name"
          value={newJob.customerName}
          onChange={(e) => setNewJob({ ...newJob, customerName: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Phone Number</label>
        <Input placeholder="0917-XXX-XXXX" />
      </div>
    </div>

    {/* BRAND, MODEL, PLATE */}
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Brand</label>
        <select
          className="w-full h-10 border rounded-md px-3 bg-background"
          value={newJob.motorcycleBrand}
          onChange={(e) => setNewJob({ ...newJob, motorcycleBrand: e.target.value })}
        >
          <option value="">Select brand</option>
          <option>Honda</option>
          <option>Yamaha</option>
          <option>Suzuki</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Model</label>
        <Input
          placeholder="Model"
          value={newJob.motorcycleModel}
          onChange={(e) => setNewJob({ ...newJob, motorcycleModel: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Plate Number</label>
        <Input
          placeholder="ABC-1234"
          value={newJob.plateNumber}
          onChange={(e) => setNewJob({ ...newJob, plateNumber: e.target.value })}
        />
      </div>
    </div>

    {/* SERVICE TYPE CHECKBOXES */}
    <div className="space-y-2 border rounded-lg p-4">
      <label className="text-sm font-medium">Service Type (Select multiple)</label>
      <div className="grid grid-cols-3 gap-y-3 gap-x-4 mt-2">
        {[
          "Oil Change & Tune-up", "Brake Repair", "Suspension Repair",
          "Engine Overhaul", "Tire Replacement", "Other",
          "Electrical Repair", "Bodywork & Paint"
        ].map((type) => (
          <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="accent-orange-600 h-4 w-4"
              checked={newJob.serviceType.includes(type)}
              onChange={(e) => {
                if (e.target.checked) {
                  setNewJob({ ...newJob, serviceType: [...newJob.serviceType, type] });
                } else {
                  setNewJob({ ...newJob, serviceType: newJob.serviceType.filter((t) => t !== type) });
                }
              }}
            />
            {type}
          </label>
        ))}
      </div>
    </div>

    {/* MECHANIC & DESCRIPTION */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Assign Mechanic</label>
        <select
          className="w-full h-10 border rounded-md px-3 bg-background"
          onChange={(e) => setNewJob({ ...newJob, assignedMechanic: e.target.value })}
        >
          <option>Select mechanic</option>
          <option>John Doe</option>
          <option>Mike Santos</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Service Description</label>
        <textarea
          className="w-full border rounded-md p-2 h-20 text-sm bg-background"
          placeholder="Describe the service or issue..."
        />
      </div>
    </div>

    {/* DATE INFO */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Date Received (Auto-generated)</label>
        <Input disabled value={new Date().toLocaleString()} className="bg-muted" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Estimated Completion</label>
        <Input type="date" className="block" />
      </div>
    </div>

    {/* PARTS & LABOR SECTION */}
    <div className="grid grid-cols-2 gap-6">
      {/* LEFT: PARTS USED TABLE */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-sm">Parts Used</h3>
        <div className="flex gap-2">
          <Input 
            placeholder="Part name" 
            className="flex-1"
            value={newPart.name}
            onChange={e => setNewPart({...newPart, name: e.target.value})}
          />
          <Input 
            type="number" 
            className="w-16" 
            value={newPart.quantity}
            onChange={e => setNewPart({...newPart, quantity: Number(e.target.value)})}
          />
          <Input 
            type="number" 
            placeholder="0.00" 
            className="w-24"
            value={newPart.price}
            onChange={e => setNewPart({...newPart, price: Number(e.target.value)})}
          />
          <Button variant="outline" size="sm" onClick={addPart} className="text-orange-600 border-orange-600">
            Add Part
          </Button>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">Part Name</th>
              <th className="text-center py-2">Quantity</th>
              <th className="text-right py-2">Price (₱)</th>
              <th className="text-right py-2">Total (₱)</th>
              <th className="text-center py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {newJob.partsUsed.map((p, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{i + 1}</td>
                <td className="py-2">{p.name}</td>
                <td className="text-center py-2">{p.quantity}</td>
                <td className="text-right py-2">{p.price.toFixed(2)}</td>
                <td className="text-right py-2">{(p.quantity * p.price).toFixed(2)}</td>
                <td className="text-center py-2">
                   <button className="text-red-500">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right text-sm font-bold">
          Parts Subtotal: ₱{newJob.partsUsed.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
        </div>
      </div>

      {/* RIGHT: LABOR & SUMMARY */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Labor Cost</label>
          <div className="space-y-1">
             <span className="text-xs text-muted-foreground">Labor Cost (₱)</span>
             <Input 
               type="number" 
               value={newJob.laborCost} 
               onChange={e => setNewJob({...newJob, laborCost: Number(e.target.value)})}
             />
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 space-y-2 border border-orange-100 dark:border-orange-900">
           <div className="flex justify-between text-sm">
              <span>Parts Subtotal</span>
              <span>₱{newJob.partsUsed.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}</span>
           </div>
           <div className="flex justify-between text-sm">
              <span>Labor Cost</span>
              <span>₱{newJob.laborCost.toFixed(2)}</span>
           </div>
           <hr className="border-orange-200 dark:border-orange-900" />
           <div className="flex justify-between items-center pt-2">
              <span className="font-bold">TOTAL COST</span>
              <span className="text-2xl font-bold text-orange-600">
                ₱{(newJob.partsUsed.reduce((sum, p) => sum + (p.price * p.quantity), 0) + newJob.laborCost).toLocaleString()}
              </span>
           </div>
        </div>
      </div>
    </div>
  </div>

  {/* DIALOG FOOTER */}
  <div className="flex justify-end gap-3 pt-4 border-t">
    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
      Cancel
    </Button>
    <Button onClick={createServiceJob} className="bg-orange-600 hover:bg-orange-700 text-white px-8">
      Create Service Job
    </Button>
  </div>
</DialogContent>

              </Dialog>

            </div>

            {/* SEARCH */}
            <Card>
              <CardContent className="p-4 flex gap-4">
                <Search />
                <Input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search jobs..."
                />
              </CardContent>
            </Card>

            {/* TABS */}
            <Tabs defaultValue="monitoring">

              <TabsList>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="monitoring">
                {monitoringJobs.map(job => (
                  <Card key={job.id}>
                    <CardContent className="p-4 flex justify-between">
                      {job.id}
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="tracking">
                {trackingJobs.map(job => (
                  <Card key={job.id}>
                    <CardContent className="p-4 flex justify-between">
                      {job.id}
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
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