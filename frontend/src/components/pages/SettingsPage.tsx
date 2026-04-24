import { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar, Page } from '../layout/Sidebar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { User, Store, Bell, Moon, Users, Mail } from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const userAccounts = [
  { id: 1, name: 'John Admin', email: 'john@motopos.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Sarah Manager', email: 'sarah@motopos.com', role: 'Manager', status: 'Active' },
  { id: 3, name: 'Mike Cashier', email: 'mike@motopos.com', role: 'Cashier', status: 'Active' },
  { id: 4, name: 'Lisa Sales', email: 'lisa@motopos.com', role: 'Cashier', status: 'Inactive' },
];

export function SettingsPage({ onNavigate, onLogout }: SettingsPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <div className="dark h-screen bg-background flex flex-col ">
      
      {/* Navbar */}
      <Navbar onLogout={onLogout} name="Admin" />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar currentPage="settings" onNavigate={onNavigate} />
        
        {/* Scrollable Content */}
         <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Page Header */}
          <div className="p-6 border-b border-border bg-background  sticky top-0 z-10">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-foreground">
                Settings
              </h1>

              <p className="text-muted-foreground mt-1">
                 Manage your account and store preferences
              </p>
            </div>
          </div>
           
      
             
            {/* Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* User Profile */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h3>User Profile</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="" />
                      <AvatarFallback>JA</AvatarFallback>
                    </Avatar>

                    <Button variant="outline">
                      Change Photo
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue="John Admin" />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue="john@motopos.com" />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input defaultValue="+1 (555) 123-4567" />
                  </div>

                  <Button className="w-full">
                    Save Changes
                  </Button>
                </div>
              </Card>

              {/* Store Info */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Store className="w-5 h-5 text-primary" />
                  <h3>Store Information</h3>
                </div>

                <div className="space-y-4">
                  <Input defaultValue="Moto Parts & Accessories" />
                  <Input defaultValue="123 Main Street" />
                  <Input defaultValue="+1 (555) 987-6543" />
                  <Input type="email" defaultValue="info@motoparts.com" />
                  <Input type="number" defaultValue="8.5" />

                  <Button className="w-full">
                    Update Store Info
                  </Button>
                </div>
              </Card>
            </div>

            

            {/* Users Table */}
            <Card className="p-6">
              <div className="flex justify-between mb-6">
                <h3>User Accounts</h3>
                <Button>Add User</Button>
              </div>

              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {userAccounts.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.status}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}