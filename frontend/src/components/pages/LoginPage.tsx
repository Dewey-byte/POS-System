import { useState } from "react";
import { Bike } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type UserRole = "admin" | "cashier";

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sendingToken, setSendingToken] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

      const role = (data.user.role || "").toLowerCase();

      if (role === "admin" || role === "cashier") {
        onLogin(role);
      } else {
        alert("Unknown user role from server");
      }

      } else {
        alert(data.message || "Invalid login");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      alert("Please enter your email.");
      return;
    }

    setSendingToken(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      alert(data.message || "If email exists, a reset token was sent.");
    } catch (err) {
      console.error("Forgot password error:", err);
      alert("Could not send reset token.");
    } finally {
      setSendingToken(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken.trim() || !newPassword.trim()) {
      alert("Please enter token and new password.");
      return;
    }

    setResettingPassword(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken.trim(),
          new_password: newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Password reset failed.");
        return;
      }

      alert("Password reset successful. You can now login.");
      setForgotOpen(false);
      setResetToken("");
      setNewPassword("");
    } catch (err) {
      console.error("Reset password error:", err);
      alert("Could not reset password.");
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 rotate-12">
          <Bike className="w-64 h-64 text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 -rotate-12">
          <Bike className="w-64 h-64 text-primary" />
        </div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-2xl p-8">

          {/* Logo Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/20 p-4 rounded-full mb-4 border-2 border-primary/30">
              <Bike className="w-12 h-12 text-primary" />
            </div>

            <h1 className="text-foreground text-2xl font-bold">
              Motorcycle POS
            </h1>

            <p className="text-muted-foreground mt-2">
              Parts & Accessories
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>

              <Input
              
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-zinc-900 border border-zinc-700 focus:border-primary focus:ring-2 focus:ring-primary text-white placeholder:text-gray-400 pr-10 autofill:bg-zinc-900"
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-primary focus:ring-2 focus:ring-primary text-white placeholder:text-gray-400"
                />
              </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Forgot Password */}
            <Button
              type="button"
              variant="ghost"
              className="w-full text-muted-foreground hover:text-primary"
              onClick={() => setForgotOpen(true)}
            >
              Forgot Password?
            </Button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground mt-4">
          Use your registered account to login
        </p>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="bg-background/95 border-border/50">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your account email (username) to receive a reset token, then set a new password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email (Username)</Label>
              <Input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleForgotPassword}
              disabled={sendingToken}
            >
              {sendingToken ? "Sending..." : "Send Reset Token"}
            </Button>

            <div className="space-y-2">
              <Label>Reset Token</Label>
              <Input
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste token from email"
              />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleResetPassword}
              disabled={resettingPassword}
            >
              {resettingPassword ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}