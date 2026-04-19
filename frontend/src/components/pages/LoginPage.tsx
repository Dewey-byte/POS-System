import { useState } from "react";
import { Bike } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type UserRole = "admin" | "cashier";

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    </div>
  );
}