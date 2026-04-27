import { useEffect, useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar, Page } from '../layout/Sidebar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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

import { UserRole } from "../layout/Sidebar";

/* TYPES */
interface SettingsPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  userRole: UserRole; // ✅ UPDATED (consistent role system)
}

const API_URL = "http://127.0.0.1:5000/api/users";

export function SettingsPage({
  onNavigate,
  onLogout,
  userRole,
}: SettingsPageProps) {

  const [users, setUsers] = useState<any[]>([]);

  // EDIT USER
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // ADD USER
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* FETCH USERS */
  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));
  }, []);

  /* UPDATE USER */
  const handleUpdateUser = async () => {
    if (!editingUser) return;

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
  };

  /* ADD USER */
  const handleAddUser = async () => {
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

    const refreshed = await fetch(`${API_URL}/users`).then(r => r.json());
    setUsers(refreshed);

    setShowAdd(false);
    setNewName("");
    setNewUsername("");
    setNewPassword("");
  };

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
    <div className="dark min-h-screen bg-background flex flex-col">

      <Navbar onLogout={onLogout} role={userRole || ""} name={""} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentPage="settings"
          onNavigate={onNavigate}
          userRole={userRole} // ✅ UPDATED
        />

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-zinc-950">

          <div className="max-w-7xl mx-auto p-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">

              <div>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                  Settings
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage user accounts
                </p>
              </div>

              {canManageUsers && (
                <Button
                  onClick={() => setShowAdd(true)}
                  className="bg-primary hover:bg-primary/90 rounded-xl px-4"
                >
                  + Add User
                </Button>
              )}

            </div>

            {/* TABLE */}
            <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-2">

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} className="hover:bg-white/5 transition">
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.role}</TableCell>

                      <TableCell className="text-right">
                        {canManageUsers && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingUser(u);
                              setEditName(u.name);
                              setEditUsername(u.username);
                              setEditRole(u.role);
                              setEditPassword("");
                            }}
                          >
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>

            </Card>

          </div>
        </main>
      </div>

      {/* EDIT USER MODAL */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="bg-card border-border">

          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">

            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={editRole} onChange={(e) => setEditRole(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
              />
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Save Changes
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* ADD USER MODAL */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card border-border">

          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a new user account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">

            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Create User
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
}