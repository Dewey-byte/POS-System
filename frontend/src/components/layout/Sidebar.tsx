import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  TrendingUp,
  Settings,
  Wrench,
  UserCog,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type Page =
  | "dashboard"
  | "pos"
  | "inventory"
  | "sales"
  | "settings"
  | "services"
  | "mechanics";

export type UserRole = "cashier" | "admin";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: UserRole; // ✅ REQUIRED
}

// All menu items
const menuItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "pos" as Page, label: "Point of Sale", icon: ShoppingCart },
  { id: "services" as Page, label: "Service Management", icon: Wrench },
  { id: "inventory" as Page, label: "Inventory", icon: Package },
  { id: "mechanics" as Page, label: "Mechanics", icon: UserCog },
  { id: "sales" as Page, label: "Reports", icon: TrendingUp },
  { id: "settings" as Page, label: "Settings", icon: Settings },
];

export function Sidebar({
  currentPage,
  onNavigate,
  userRole,
}: SidebarProps) {
  const cashierPages: Page[] = ["dashboard", "pos", "inventory", "services"];

  const visibleItems = menuItems.filter((item) => {
    if (userRole === "cashier") {
      return cashierPages.includes(item.id);
    }
    return true;
  });

  return (
    <div className="w-64 sticky top-[73px] h-[calc(100vh-73px)] bg-sidebar border-r border-sidebar-border p-4">
      <nav className="space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}