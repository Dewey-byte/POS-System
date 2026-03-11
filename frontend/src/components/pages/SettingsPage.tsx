import { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { User, Store, Bell, Moon, Users, Mail } from 'lucide-react';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings';

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

// Mock user accounts data
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
    <div className="dark min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentPage="settings" onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account and store preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Profile Card */}
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-card-foreground">User Profile</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">JA</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="border-border">
                        Change Photo
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input 
                      id="fullname" 
                      defaultValue="John Admin" 
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue="john@motopos.com" 
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      defaultValue="+1 (555) 123-4567" 
                      className="bg-input border-border"
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                </div>
              </Card>

              {/* Store Information */}
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-3 mb-6">
                  <Store className="w-5 h-5 text-primary" />
                  <h3 className="text-card-foreground">Store Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storename">Store Name</Label>
                    <Input 
                      id="storename" 
                      defaultValue="Moto Parts & Accessories" 
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      defaultValue="123 Main Street, City, State 12345" 
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storephone">Phone</Label>
                    <Input 
                      id="storephone" 
                      defaultValue="+1 (555) 987-6543" 
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeemail">Email</Label>
                    <Input 
                      id="storeemail" 
                      type="email" 
                      defaultValue="info@motoparts.com" 
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax">Tax Rate (%)</Label>
                    <Input 
                      id="tax" 
                      type="number" 
                      defaultValue="8.5" 
                      className="bg-input border-border"
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Update Store Info
                  </Button>
                </div>
              </Card>
            </div>

            {/* Preferences */}
            <Card className="p-6 bg-card border-border">
              <h3 className="text-card-foreground mb-6">Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-primary" />
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-muted-foreground">Use dark theme for the interface</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <div>
                      <Label>Notifications</Label>
                      <p className="text-muted-foreground">Receive low stock and sales alerts</p>
                    </div>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <Label>Email Alerts</Label>
                      <p className="text-muted-foreground">Send notifications via email</p>
                    </div>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>
              </div>
            </Card>

            {/* User Accounts */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="text-card-foreground">User Accounts</h3>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  Add User
                </Button>
              </div>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAccounts.map((user) => (
                      <TableRow key={user.id} className="border-border hover:bg-muted/50">
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.role === 'Admin' ? 'default' : 'secondary'}
                            className={user.role === 'Admin' ? 'bg-primary' : ''}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === 'Active' ? 'default' : 'secondary'}
                            className={user.status === 'Active' ? 'bg-green-500' : ''}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
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
