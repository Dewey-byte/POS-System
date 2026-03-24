import { LayoutDashboard, ShoppingCart, Package, TrendingUp, Settings, Wrench, Users, UserCog } from 'lucide-react';
import { cn } from '../../lib/utils';

export type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings' | 'services' | 'customers' | 'mechanics';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos' as Page, label: 'Point of Sale', icon: ShoppingCart },
  { id: 'services' as Page, label: 'Service Management', icon: Wrench },
  { id: 'inventory' as Page, label: 'Inventory', icon: Package },
  { id: 'customers' as Page, label: 'Customers', icon: Users },
  { id: 'mechanics' as Page, label: 'Mechanics', icon: UserCog },
  { id: 'sales' as Page, label: 'Reports', icon: TrendingUp },
  { id: 'settings' as Page, label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-[calc(100vh-73px)] p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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