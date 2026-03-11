import { Bike, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';

interface NavbarProps {
  onLogout: () => void;
}

export function Navbar({ onLogout }: NavbarProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Bike className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-foreground">Motorcycle POS</h2>
          <p className="text-muted-foreground">Parts & Accessories</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-foreground">
          <User className="w-5 h-5" />
          <span>Admin User</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
