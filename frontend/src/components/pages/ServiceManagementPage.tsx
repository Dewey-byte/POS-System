import { useState, useEffect } from "react";
import axios from "axios";

import { Navbar } from "../layout/Navbar";
import { Sidebar } from "../layout/Sidebar";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

import { 
  Search, 
  Plus, 
  Clock, 
  Wrench, 
  CheckCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Phone, 
  Calendar,
  Pencil,
  XCircle
} from "lucide-react";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

/* TYPES */

type Page =
  | "dashboard"
  | "pos"
  | "inventory"
  | "sales"
  | "settings"
  | "services"
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
  customer_name: string;
  phone_number?: string;
  motorcycle_brand: string;
  motorcycle_model: string;
  plate_number: string;
  service_type: string[];
  assigned_mechanic: string;
  parts_used: PartUsed[];
  labor_cost: number;
  total: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  description?: string;
  date_received?: string;
  estimated_completion?: string;
}

interface EditServiceJobForm {
  customer_name: string;
  motorcycle_brand: string;
  motorcycle_model: string;
  plate_number: string;
  service_type: string;
  assigned_mechanic: string;
  labor_cost: number;
  estimated_completion: string;
}

export function ServiceManagementPage({
  onNavigate,
  onLogout
}: Props) {

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userRole = user?.role || "cashier"; // default to cashier if not found

  const [serviceJobs, setServiceJobs] = useState<ServiceJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [dateReceived, setDateReceived] = useState(new Date());
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editJob, setEditJob] = useState<EditServiceJobForm>({
    customer_name: "",
    motorcycle_brand: "",
    motorcycle_model: "",
    plate_number: "",
    service_type: "",
    assigned_mechanic: "",
    labor_cost: 0,
    estimated_completion: "",
  });

  const toggleExpand = (id: string) => {
    setExpandedJobId(prev => (prev === id ? null : id));
  };

  const [newJob, setNewJob] = useState<ServiceJob>({
    id: "",
    customer_name: "",
    phone_number: "",
    motorcycle_brand: "",
    motorcycle_model: "",
    plate_number: "",
    service_type: [],
    assigned_mechanic: "",
    parts_used: [],
    labor_cost: 0,
    total: 0,
    status: "pending",
    description: "",
    date_received: new Date().toLocaleString(),
    estimated_completion: ""
  });

  const [newPart, setNewPart] = useState<PartUsed>({
    name: "",
    quantity: 1,
    price: 0
  });

  /* FETCH */

  useEffect(() => {
    fetchJobs();
    fetchMechanics();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/sales/service-records"
      );

              const formatted = res.data.map((item: any) => ({
              id: item.id,

              customer_name: item.customer ?? "",
              phone_number: item.phone_number ?? "",

              motorcycle_brand: item.brand ?? "",
              motorcycle_model: item.model ?? "",
              plate_number: item.plate ?? "",

              service_type: item.type ? item.type.split(", ") : [],

              assigned_mechanic: item.mechanic ?? "",

              parts_used:
                typeof item.parts === "string"
                  ? JSON.parse(item.parts || "[]")
                  : item.parts ?? [],

              labor_cost: item.labor ?? 0,
              total: item.total ?? 0,
              status: item.status ?? "pending",

              description: "",

              date_received: item.date ?? "",

              estimated_completion: item.estimated_completion
                ? item.estimated_completion === "0000-00-00 00:00:00"
                  ? ""
                  : item.estimated_completion
                : ""
            }));

      setServiceJobs(formatted);

    } catch (err) {
      toast.error("Failed loading service records");
    }
  };

  const fetchMechanics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/mechanics/");
      setMechanics(res.data || []);
    } catch (err) {
      toast.error("Failed loading mechanics");
    }
  };

  /* =========================
     WORKLOAD CALCULATION (NEW)
  ========================= */

  const mechanicWorkload = mechanics.map((m) => {
    const jobCount = serviceJobs.filter(
      (job) =>
        job.assigned_mechanic === m.name &&
        job.status !== "completed" &&
        job.status !== "cancelled"
    ).length;

    return {
      ...m,
      jobCount
    };
  });

  /* ADD PART */

  const addPart = () => {
    setNewJob(prev => ({
      ...prev,
      parts_used: [...prev.parts_used, newPart]
    }));

    setNewPart({ name: "", quantity: 1, price: 0 });
  };

  /* CREATE JOB */

  const createServiceJob = async () => {
    try {
      const payload = {
        customer_name: newJob.customer_name,
        phone_number: newJob.phone_number,
        service_type: newJob.service_type.join(", "),
        motorcycle_brand: newJob.motorcycle_brand,
        motorcycle_model: newJob.motorcycle_model,
        plate_number: newJob.plate_number,
        mechanic_name: newJob.assigned_mechanic,
        parts_used: newJob.parts_used,
        labor_cost: newJob.labor_cost,
        description: newJob.description || "",
        total:
          newJob.parts_used.reduce(
            (sum, part) => sum + part.price * part.quantity,
            0
          ) + newJob.labor_cost,
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
          customer_name: newJob.customer_name,
          phone_number: newJob.phone_number,
          motorcycle_brand: newJob.motorcycle_brand,
          motorcycle_model: newJob.motorcycle_model,
          plate_number: newJob.plate_number,
          service_type: newJob.service_type,
          assigned_mechanic: newJob.assigned_mechanic,
          parts_used: newJob.parts_used,
          labor_cost: newJob.labor_cost,
          total:
            newJob.parts_used.reduce(
              (sum, part) => sum + part.price * part.quantity,
              0
            ) + newJob.labor_cost,
          status: created?.status || "pending",
          description: newJob.description || ""
        }
      ]);

      toast.success("Service job created successfully");
      setIsAddDialogOpen(false);
      
      // RESET FORM
      setNewJob({
        id: "",
        customer_name: "",
        phone_number: "",
        motorcycle_brand: "",
        motorcycle_model: "",
        plate_number: "",
        service_type: [],
        assigned_mechanic: "",
        parts_used: [],
        labor_cost: 0,
        total: 0,
        status: "pending",
        description: ""
      });

    } catch (err) {
      toast.error("Failed creating service job");
    }
  };

  /* FILTER */

  const filteredJobs = serviceJobs.filter((job) => {
    const q = searchTerm.toLowerCase();

    const matchesSearch =
      (job.customer_name ?? "").toLowerCase().includes(q) ||
      (job.id ?? "").toLowerCase().includes(q) ||
      (job.motorcycle_brand ?? "").toLowerCase().includes(q) ||
      (job.motorcycle_model ?? "").toLowerCase().includes(q) ||
      (job.plate_number ?? "").toLowerCase().includes(q);

    const matchesStatus =
      selectedStatus === "all" || job.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const monitoringJobs = filteredJobs.filter(
    (j) => j.status === "pending" || j.status === "in-progress"
  );

  const trackingJobs = filteredJobs.filter(
    (j) => j.status === "completed" || j.status === "cancelled"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "completed":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case "in-progress":
        return <Wrench className="w-3.5 h-3.5 mr-1.5" />;
      case "completed":
        return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      default:
        return null;
    }
  };

 async function handleUpdateStatus(id: string, newStatus: string) {
  try {
    await axios.put(
      `http://localhost:5000/api/sales/service-records/${id}/status`,
      {
        status: newStatus
      }
    );

    setServiceJobs(prev =>
      prev.map(job =>
        job.id === id
          ? { ...job, status: newStatus as ServiceJob["status"] }
          : job
      )
    );

    toast.success(`Status updated to ${newStatus}`);
  } catch (err) {
    toast.error("Failed to update status");
  }
}

  const openEditDialog = (job: ServiceJob) => {
    setEditingJobId(job.id);
    setEditJob({
      customer_name: job.customer_name || "",
      motorcycle_brand: job.motorcycle_brand || "",
      motorcycle_model: job.motorcycle_model || "",
      plate_number: job.plate_number || "",
      service_type: (job.service_type || []).join(", "),
      assigned_mechanic: job.assigned_mechanic || "",
      labor_cost: job.labor_cost || 0,
      estimated_completion: job.estimated_completion
        ? String(job.estimated_completion).slice(0, 10)
        : "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingJobId) return;

    const parsedServiceTypes = editJob.service_type
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    try {
      await axios.put(
        `http://localhost:5000/api/sales/service-records/${editingJobId}`,
        {
          customer_name: editJob.customer_name,
          motorcycle_brand: editJob.motorcycle_brand,
          motorcycle_model: editJob.motorcycle_model,
          plate_number: editJob.plate_number,
          mechanic_name: editJob.assigned_mechanic,
          labor_cost: editJob.labor_cost,
          service_type: parsedServiceTypes,
          estimated_completion: editJob.estimated_completion || null,
        }
      );

      setServiceJobs((prev) =>
        prev.map((job) =>
          job.id === editingJobId
            ? {
                ...job,
                customer_name: editJob.customer_name,
                motorcycle_brand: editJob.motorcycle_brand,
                motorcycle_model: editJob.motorcycle_model,
                plate_number: editJob.plate_number,
                service_type: parsedServiceTypes,
                assigned_mechanic: editJob.assigned_mechanic,
                labor_cost: editJob.labor_cost,
                estimated_completion: editJob.estimated_completion,
              }
            : job
        )
      );

      toast.success("Service job updated");
      setIsEditDialogOpen(false);
      setEditingJobId(null);
    } catch (err) {
      toast.error("Failed to update service job");
    }
  };

  /* RENDER JOB CARD FUNCTION */
  const renderJobCard = (job: ServiceJob, tab: "monitoring" | "tracking") => (
    <Card key={job.id} className="bg-[#121212] text-white border-border text-gray-200 mb-4 rounded-xl shadow-md overflow-hidden">
      {/* HEADER SECTION */}
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => toggleExpand(job.id)}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-white tracking-wide">{job.id}</span>

          <Badge className={`flex items-center rounded-full px-2.5 py-1.5 border ${getStatusColor(job.status)}`}>
            {getStatusIcon(job.status)}
            {job.status}
          </Badge>
          
          {job.service_type.map((type, idx) => (
            <Badge key={idx} variant="outline" className="border-gray-600 text-white rounded-md font-medium px-2.5 py-1.5">
              {type}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {tab === "monitoring" && job.status === "pending" && (
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 h-9"
              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(job.id, "in-progress"); }}
            >
              Start Service
            </Button>
          )}
          
          {tab === "monitoring" && job.status === "in-progress" && (
            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 h-9"
              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(job.id, "completed"); }}
            >
              Mark Complete
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="font-medium px-3 h-9"
            onClick={(e) => {
              e.stopPropagation();
              openEditDialog(job);
            }}
          >
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>

          {tab === "monitoring" && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-500/40 text-red-400 hover:text-red-300 font-medium px-3 h-9"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Cancel service job ${job.id}?`)) {
                  handleUpdateStatus(job.id, "cancelled");
                }
              }}
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
              Cancel
            </Button>
          )}

          <div className="text-muted-foreground p-1">
            {expandedJobId === job.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* EXPANDED CONTENT SECTION */}
      {expandedJobId === job.id && (
        <CardContent className="border-t border-border/50 p-6 space-y-8 text-white bg-[#181818]/50">
          
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="text-sm text-gray-500 flex items-center gap-2"><User className="w-4 h-4"/> Customer</div>
              <div className="text-gray-200">{job.customer_name}</div>
              <div className="text-gray-400 text-sm flex items-center gap-2"><Phone className="w-4 h-4"/> {job.phone_number || "0917-123-4567"}</div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-500">Motorcycle</div>
              <div className="text-gray-200">{job.motorcycle_brand} {job.motorcycle_model}</div>
              <div className="text-gray-400 text-sm">Plate: {job.plate_number}</div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-500">Assigned Mechanic</div>
              <div className="text-gray-200">{job.assigned_mechanic}</div>
              <div className="text-gray-400 text-sm flex items-center gap-2"><Calendar className="w-4 h-4"/> Due: {job.estimated_completion || "N/A"}</div>
            </div>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* Date Received */}
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Date Received</div>
            <div className="text-gray-200 text-sm">{job.date_received || "2026-03-07 09:30 AM"}</div>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* Service Description */}
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Service Description</div>
            <div className="text-gray-200 text-sm leading-relaxed">{job.description || "No description provided."}</div>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* Parts Used */}
          <div className="space-y-3">
            <div className="text-sm text-gray-500">Parts Used</div>
            {job.parts_used.length > 0 ? (
              <div className="space-y-2.5">
                {job.parts_used.map((part, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="text-gray-200">{part.name} <span className="text-gray-400 ml-1">x{part.quantity}</span></div>
                    <div className="text-gray-400">₱{(part.price * part.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No parts have been added to this service job.</div>
            )}
          </div>

        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="dark h-screen bg-background flex flex-col">

      <Navbar onLogout={onLogout} role={user?.role || ""} name={""} />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar currentPage="services" onNavigate={onNavigate} userRole={userRole} />

        <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">

          <div className="max-w-7xl mx-auto p-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-foreground">Service Management</h1>
                  <p className="text-muted-foreground mt-1">Track repairs, maintenance, and service history</p>
                </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      New Service Job
                    </Button>
                  </DialogTrigger>

                <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 border-none">
                  <DialogHeader className="p-6 pb-2 border-b">
                    <DialogTitle className="text-xl font-bold">Create New Service Job</DialogTitle>
                  </DialogHeader>
    

                  <div className="space-y-6 p-6">
                    {/* CUSTOMER & PHONE */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Customer Name</label>
                        <Input
                          placeholder="Enter customer name"
                          value={newJob.customer_name}
                          onChange={(e) => setNewJob({ ...newJob, customer_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                      
                      </div>
                    </div>

                    {/* BRAND, MODEL, PLATE */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Brand</label>
                        <select
                          className="w-full h-10 border rounded-md px-3 bg-background"
                          value={newJob.motorcycle_brand}
                          onChange={(e) => setNewJob({ ...newJob, motorcycle_brand: e.target.value })}
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
                          value={newJob.motorcycle_model}
                          onChange={(e) => setNewJob({ ...newJob, motorcycle_model: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Plate Number</label>
                        <Input
                          placeholder="ABC-1234"
                          value={newJob.plate_number}
                          onChange={(e) => setNewJob({ ...newJob, plate_number: e.target.value })}
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
                              checked={newJob.service_type.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewJob({ ...newJob, service_type: [...newJob.service_type, type] });
                                } else {
                                  setNewJob({ ...newJob, service_type: newJob.service_type.filter((t) => t !== type) });
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
                            value={newJob.assigned_mechanic}
                            onChange={(e) =>
                              setNewJob({ ...newJob, assigned_mechanic: e.target.value })
                            }
                          >
                            <option value="">Select mechanic</option>
                            {mechanicWorkload.map((m) => (
                              <option key={m.id} value={m.name}>
                                {m.name} ({m.jobCount} jobs)
                              </option>
                            ))}
                          </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Service Description</label>
                        <textarea
                          className="w-full border rounded-md p-2 h-20 text-sm bg-background"
                          placeholder="Describe the service or issue..."
                          value={newJob.description}
                          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* DATE INFO */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Date Received (Auto-generated)</label>
                        <Input
                          disabled
                          value={dateReceived.toLocaleString('en-PH')}
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Estimated Completion</label>
                        <Input
                          type="date"
                          value={estimatedCompletion}
                          onChange={(e) => setEstimatedCompletion(e.target.value)}
                          className="block"
                        />
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
                              <th className="text-center py-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {newJob.parts_used.map((p, i) => (
                              <tr key={i} className="border-b">
                                <td className="py-2">{i + 1}</td>
                                <td className="py-2">{p.name}</td>
                                <td className="text-center py-2">{p.quantity}</td>
                                <td className="text-center py-2">
                                  <button onClick={() => {
                                      const updatedParts = [...newJob.parts_used];
                                      updatedParts.splice(i, 1);
                                      setNewJob({...newJob, parts_used: updatedParts});
                                  }} className="text-red-500">🗑️</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                       
                      </div>

                      {/* RIGHT: LABOR & SUMMARY */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Labor Cost</label>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Labor Cost (₱)</span>
                            <Input 
                              type="number" 
                              value={newJob.labor_cost} 
                              onChange={e => setNewJob({...newJob, labor_cost: Number(e.target.value)})}
                            />
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 space-y-2 border border-orange-100 dark:border-orange-900">
                          <div className="flex justify-between text-sm">
                         
                            
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Labor Cost</span>
                            <span>₱{newJob.labor_cost.toFixed(2)}</span>
                          </div>
                     
                          <div className="flex justify-between items-center pt-2">
                           
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 p-6 border-t bg-muted/20">
                    
                   <Button
                      onClick={createServiceJob}
                      disabled={
                        !newJob.customer_name ||
                        !newJob.motorcycle_brand ||
                        !newJob.assigned_mechanic ||
                        newJob.service_type.length === 0
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                    >
                      Save Service
                    </Button>

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

            {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mr-4">
                <Card><CardContent className="p-6 flex justify-between items-center">
                  <div><p className="text-muted-foreground text-sm">Pending</p><p className="text-2xl font-bold">{monitoringJobs.filter(j=>j.status==="pending").length}</p></div>
                  <Clock className="w-8 h-8 text-yellow-500"/>
                </CardContent></Card>

                <Card><CardContent className="p-6 flex justify-between items-center">
                  <div><p className="text-muted-foreground text-sm">In Progress</p><p className="text-2xl font-bold">{monitoringJobs.filter(j=>j.status==="in-progress").length}</p></div>
                  <Wrench className="w-8 h-8 text-blue-500"/>
                </CardContent></Card>

                <Card><CardContent className="p-6 flex justify-between items-center">
                  <div><p className="text-muted-foreground text-sm">Completed</p><p className="text-2xl font-bold">{trackingJobs.filter(j=>j.status==="completed").length}</p></div>
                  <CheckCircle className="w-8 h-8 text-green-500"/>
                </CardContent></Card>

                <Card><CardContent className="p-6 flex justify-between items-center">
                  <div><p className="text-muted-foreground text-sm">Total Jobs</p><p className="text-2xl font-bold">{serviceJobs.length}</p></div>
                   <FileText className="w-8 h-8 text-primary" />
                </CardContent></Card>
              </div>

          
                {/* Search and Filter */}
                <Card className="bg-card border-border">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center">

                      {/* SEARCH */}
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"  />
                        <Input
                          placeholder="Search job ID, customer, brand, model, or plate..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-input border-border text-white"
                        />
                      </div>

                      {/* STATUS FILTER */}
                      <div className="w-10 md:w-[220px]">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-10 h-10 rounded-md border px-3 bg-background text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                    </div>
                  </CardContent>
                </Card>

            {/* TABS */}
            <Tabs defaultValue="monitoring" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="monitoring" className="space-y-4">
                {monitoringJobs.map(job => renderJobCard(job, "monitoring"))}
                {monitoringJobs.length === 0 && (
                  <div className="text-center text-muted-foreground py-10">No pending or in-progress jobs found.</div>
                )}
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4">
                {trackingJobs.map(job => renderJobCard(job, "tracking"))}
                {trackingJobs.length === 0 && (
                  <div className="text-center text-muted-foreground py-10">No completed or cancelled jobs found.</div>
                )}
              </TabsContent>
            </Tabs>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Service Job</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Customer Name</label>
                    <Input
                      value={editJob.customer_name}
                      onChange={(e) =>
                        setEditJob((prev) => ({ ...prev, customer_name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Assigned Mechanic</label>
                    <select
                      className="w-full h-10 border rounded-md px-3 bg-background"
                      value={editJob.assigned_mechanic}
                      onChange={(e) =>
                        setEditJob((prev) => ({ ...prev, assigned_mechanic: e.target.value }))
                      }
                    >
                      <option value="">Select mechanic</option>
                      {mechanicWorkload.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.jobCount} jobs)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Motorcycle Brand</label>
                    <Input
                      value={editJob.motorcycle_brand}
                      onChange={(e) =>
                        setEditJob((prev) => ({ ...prev, motorcycle_brand: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Motorcycle Model</label>
                    <Input
                      value={editJob.motorcycle_model}
                      onChange={(e) =>
                        setEditJob((prev) => ({ ...prev, motorcycle_model: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Plate Number</label>
                    <Input
                      value={editJob.plate_number}
                      onChange={(e) =>
                        setEditJob((prev) => ({ ...prev, plate_number: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Estimated Completion</label>
                    <Input
                      type="date"
                      value={editJob.estimated_completion}
                      onChange={(e) =>
                        setEditJob((prev) => ({ ...prev, estimated_completion: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium">Service Types (comma-separated)</label>
                    <Input
                      value={editJob.service_type}
                      onChange={(e) =>
                        setEditJob((prev) => ({ ...prev, service_type: e.target.value }))
                      }
                      placeholder="Oil Change, Brake Repair"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium">Labor Cost</label>
                    <Input
                      type="number"
                      value={editJob.labor_cost}
                      onChange={(e) =>
                        setEditJob((prev) => ({
                          ...prev,
                          labor_cost: Number(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>

          </div>
        </main>
      </div>
    </div>
  );
}