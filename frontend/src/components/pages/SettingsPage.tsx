import { useEffect, useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar, Page, UserRole } from '../layout/Sidebar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { UserPlus, Edit2, ShieldAlert, Loader2, Users } from 'lucide-react'; // Modern icons

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';

/* TYPES */
interface SettingsPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  userRole: UserRole;
}

const API_URL = "http://127.0.0.1:5000/api/users";

export function SettingsPage({
  onNavigate,
  onLogout,
  userRole,
}: SettingsPageProps) {

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // EDIT USER
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // ADD USER
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isAdding, setIsAdding] = useState(false);

   // DELETE USER
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  /* FETCH USERS */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  /* UPDATE USER */
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`${API_URL}/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          username: editUsername,
          role: editRole,
          password: editPassword || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setUsers(prev =>
        prev.map(u => u.id === editingUser.id ? data.user : u)
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  /* ADD USER */
  const handleAddUser = async () => {
    setIsAdding(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          username: newUsername,
          password: newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // Optimistic or fresh fetch
      const refreshed = await fetch(`${API_URL}/users`).then(r => r.json());
      setUsers(refreshed);

      setShowAdd(false);
      setNewName("");
      setNewUsername("");
      setNewPassword("");
    } catch (error) {
      console.error("Add user failed:", error);
    } finally {
      setIsAdding(false);
    }
  };
  

 /* DELETE USER */
  const handleDeleteUser = async (user: any) => {
    if (user.role === "admin") {
      alert("Admin accounts cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${user.username}?`)) return;

    setDeletingUserId(user.id);

    try {
      const res = await fetch(`${API_URL}/${user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      setUsers(prev => prev.filter(u => u.id !== user.id));

    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingUserId(null);
    }
  };
  /* =======================
     ROLE ACCESS CONTROL
  ======================= */
  const canManageUsers = userRole === "admin";

  // Modernized Access Denied Screen
  if (userRole === "cashier") {
    return (
      <div className="dark min-h-screen bg-background flex flex-col items-center justify-center">
        <Card className="p-8 max-w-md border-destructive/20 bg-destructive/10 backdrop-blur-md flex flex-col items-center text-center rounded-3xl">
          <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Access Denied</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            You do not have the required permissions to view the settings page.
          </p>
          <Button onClick={() => onNavigate("dashboard")} variant="outline">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
   <div className="dark h-screen bg-background flex flex-col">
      
      <Navbar onLogout={onLogout} role={userRole || ""} name={""} />

      

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          currentPage="dashboard"
          onNavigate={onNavigate}
          userRole={userRole}
        />
         <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">
         
            <div className="max-w-7xl mx-auto">

            {/* HEADER */}
             {/* HEADER */}
          <div className="p-6 border-b border-border bg-background sticky top-0 z-10">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-foreground">User Settings</h1>
              <p className="text-muted-foreground mt-1">
                       Manage team members, roles, and system access.
              </p>
            </div>
          </div>

            <div className="p-6"></div>
              <div className="max-w-7xl mx-auto flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </h2>
          

              {canManageUsers && (
                <Button
                  onClick={() => setShowAdd(true)}
                  className="rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              )}
            </div>

            {/* CONTENT AREA */}
            <Card className="rounded-2xl border border-white/5 bg-black/20 backdrop-blur-xl shadow-2xl overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p>Loading user data...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="font-semibold py-4">Name</TableHead>
                        <TableHead className="font-semibold">Username</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((u) => (
                          <TableRow key={u.id} className="border-border/50 hover:bg-white/5 transition-colors group">
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell className="text-muted-foreground">{u.username}</TableCell>
                            <TableCell>
                              <span className={`px-2.5 py-1 text-xs rounded-full font-medium border ${
                                u.role === 'admin' 
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                  : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                              }`}>
                                {u.role.toUpperCase()}
                              </span>
                            </TableCell>

                            <TableCell className="text-right space-x-2">

                          {canManageUsers && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingUser(u);
                                  setEditName(u.name);
                                  setEditUsername(u.username);
                                  setEditRole(u.role);
                                }}
                              >
                                <Edit2 className="w-4 h-4 mr-1" />
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400"
                                disabled={deletingUserId === u.id}
                                onClick={() => handleDeleteUser(u)}
                              >
                                {deletingUserId === u.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Delete"
                                )}
                              </Button>
                            </>
                          )}

                        </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>

          </div>
        </main>
      </div>

      {/* EDIT USER MODAL */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-border/50 sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit User</DialogTitle>
            <DialogDescription>
              Update account details for <strong className="text-foreground">{editName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <Input className="bg-black/20" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>

                <Input
                  className="bg-black/20"
                  type="email"
                  placeholder="e.g. janedoe@example.com"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Role</Label>
              <Input className="bg-black/20" value={editRole} onChange={(e) => setEditRole(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">New Password (Optional)</Label>
              <Input
                className="bg-black/20"
                type="password"
                placeholder="Leave blank to keep current"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" className="rounded-full" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button className="rounded-full" onClick={handleUpdateUser} disabled={isUpdating}>
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD USER MODAL */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-border/50 sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create User</DialogTitle>
            <DialogDescription>
              Fill out the details below to provision a new account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <Input className="bg-black/20" placeholder="e.g. Jane Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>

            <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>

                <Input
                  className="bg-black/20"
                  type="email"
                  placeholder="e.g. janedoe@example.com"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
              <Input
                className="bg-black/20"
                type="password"
                placeholder="Secure password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" className="rounded-full" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button className="rounded-full" onClick={handleAddUser} disabled={isAdding}>
              {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}