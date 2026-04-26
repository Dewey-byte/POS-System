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

/* PARTS STRUCTURE */

interface PartUsed {
  name: string;
  quantity: number;
  price: number;
}

/* SERVICE JOB STRUCTURE */

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
  status:
    | "pending"
    | "in-progress"
    | "completed"
    | "cancelled";
}

export function ServiceManagementPage({
  onNavigate,
  onLogout
}: Props) {

  const [serviceJobs, setServiceJobs] =
    useState<ServiceJob[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] =
    useState(false);

  const [newJob, setNewJob] =
    useState<ServiceJob>({
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

  const [newPart, setNewPart] =
    useState<PartUsed>({
      name: "",
      quantity: 1,
      price: 0
    });

  /* FETCH DATA */

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/sales/service-records"
      );

      const formatted =
        res.data.map((item: any) => ({
          id: item.id,
          customerName: item.customer,
          motorcycleBrand: item.brand || "",
          motorcycleModel: item.model || "",
          plateNumber: item.plate || "",
          serviceType: [item.type],
          assignedMechanic: item.mechanic,
          partsUsed: item.parts || [],
          laborCost: item.labor || 0,
          totalCost: item.total,
          status: item.status
        }));

      setServiceJobs(formatted);

    } catch {

      toast.error(
        "Failed loading service records"
      );

    }
  };

  /* ADD PART */

  const addPart = () => {

    setNewJob({
      ...newJob,
      partsUsed: [
        ...newJob.partsUsed,
        newPart
      ]
    });

    setNewPart({
      name: "",
      quantity: 1,
      price: 0
    });

  };

  /* CREATE SERVICE JOB */

  const createServiceJob = async () => {

    try {

      const payload = {

        customer: newJob.customerName,
        brand: newJob.motorcycleBrand,
        model: newJob.motorcycleModel,
        plate: newJob.plateNumber,
        type: newJob.serviceType[0],
        mechanic: newJob.assignedMechanic,
        parts: newJob.partsUsed,
        labor: newJob.laborCost,
        total:
          newJob.partsUsed.reduce(
            (sum, part) =>
              sum +
              part.price *
              part.quantity,
            0
          ) + newJob.laborCost,
        status: newJob.status

      };

      const res =
        await axios.post(
          "http://localhost:5000/api/sales/service-records",
          payload
        );

      setServiceJobs([
        ...serviceJobs,
        res.data
      ]);

      toast.success(
        "Service job created successfully"
      );

      setIsAddDialogOpen(false);

    } catch {

      toast.error(
        "Failed creating service job"
      );

    }

  };

  /* FILTER */

  const filteredJobs =
    serviceJobs.filter(job =>
      job.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      job.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const monitoringJobs =
    filteredJobs.filter(
      j =>
        j.status === "pending" ||
        j.status === "in-progress"
    );

  const trackingJobs =
    filteredJobs.filter(
      j =>
        j.status === "completed" ||
        j.status === "cancelled"
    );

  /* STATUS COLORS */

  const getStatusColor = (
    status: string
  ) => {

    switch (status) {

      case "pending":
        return "bg-yellow-500/20 text-yellow-500";

      case "in-progress":
        return "bg-blue-500/20 text-blue-500";

      case "completed":
        return "bg-green-500/20 text-green-500";

      case "cancelled":
        return "bg-red-500/20 text-red-500";

    }

  };

  return (

    <div className="dark min-h-screen bg-background flex flex-col">

      <Navbar onLogout={onLogout} name="" />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar
          currentPage="services"
          onNavigate={onNavigate}
        />

        <main className="flex-1 overflow-y-auto">

          <div className="max-w-7xl mx-auto p-6 space-y-6">

            {/* HEADER */}

            <div className="flex justify-between items-center">

              <div>

                <h1>
                  Service Management
                </h1>

                <p className="text-muted-foreground">
                  Track repairs and maintenance
                </p>

              </div>

              {/* MODAL */}

              <Dialog
                open={isAddDialogOpen}
                onOpenChange={
                  setIsAddDialogOpen
                }
              >

                <DialogTrigger asChild>

                  <Button>

                    <Plus className="mr-2 w-4 h-4" />

                    New Service Job

                  </Button>

                </DialogTrigger>

                <DialogContent>

                  <DialogHeader>

                    <DialogTitle>
                      Create Service Job
                    </DialogTitle>

                  </DialogHeader>

                  <div className="space-y-3">

                    <Input
                      placeholder="Customer Name"
                      onChange={e =>
                        setNewJob({
                          ...newJob,
                          customerName:
                            e.target.value
                        })
                      }
                    />

                    <Input
                      placeholder="Motorcycle Brand"
                      onChange={e =>
                        setNewJob({
                          ...newJob,
                          motorcycleBrand:
                            e.target.value
                        })
                      }
                    />

                    <Input
                      placeholder="Motorcycle Model"
                      onChange={e =>
                        setNewJob({
                          ...newJob,
                          motorcycleModel:
                            e.target.value
                        })
                      }
                    />

                    <Input
                      placeholder="Plate Number"
                      onChange={e =>
                        setNewJob({
                          ...newJob,
                          plateNumber:
                            e.target.value
                        })
                      }
                    />

                    <Input
                      placeholder="Service Type"
                      onChange={e =>
                        setNewJob({
                          ...newJob,
                          serviceType: [
                            e.target.value
                          ]
                        })
                      }
                    />

                    <Input
                      placeholder="Assigned Mechanic"
                      onChange={e =>
                        setNewJob({
                          ...newJob,
                          assignedMechanic:
                            e.target.value
                        })
                      }
                    />

                    {/* PARTS SECTION */}

                    <div className="border p-3 rounded">

                      <strong>
                        Add Parts Used
                      </strong>

                      <Input
                        placeholder="Part Name"
                        value={newPart.name}
                        onChange={e =>
                          setNewPart({
                            ...newPart,
                            name:
                              e.target.value
                          })
                        }
                      />

                      <Input
                        type="number"
                        placeholder="Qty"
                        value={
                          newPart.quantity
                        }
                        onChange={e =>
                          setNewPart({
                            ...newPart,
                            quantity:
                              Number(
                                e.target.value
                              )
                          })
                        }
                      />

                      <Input
                        type="number"
                        placeholder="Price"
                        value={
                          newPart.price
                        }
                        onChange={e =>
                          setNewPart({
                            ...newPart,
                            price:
                              Number(
                                e.target.value
                              )
                          })
                        }
                      />

                      <Button
                        onClick={addPart}
                      >
                        Add Part
                      </Button>

                    </div>

                    <Input
                      type="number"
                      placeholder="Labor Cost"
                      onChange={e =>
                        setNewJob({
                          ...newJob,
                          laborCost:
                            Number(
                              e.target.value
                            )
                        })
                      }
                    />

                    <select
                      className="border rounded p-2"
                      onChange={e =>
                        setNewJob({
                          ...newJob,
                          status:
                            e.target.value as any
                        })
                      }
                    >

                      <option value="pending">
                        Pending
                      </option>

                      <option value="in-progress">
                        In Progress
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>

                    </select>

                    <Button
                      onClick={
                        createServiceJob
                      }
                    >
                      Save Service Job
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
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={e =>
                    setSearchTerm(
                      e.target.value
                    )
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

                    <CardContent className="p-4 flex justify-between">

                      {job.id}

                      <Badge
                        className={
                          getStatusColor(
                            job.status
                          )
                        }
                      >
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

                      <Badge
                        className={
                          getStatusColor(
                            job.status
                          )
                        }
                      >
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