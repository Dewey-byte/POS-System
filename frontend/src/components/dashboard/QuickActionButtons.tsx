import { ShoppingCart, Plus, Package, FileText, Wrench, Users } from 'lucide-react';
import { Button } from '../ui/button';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'services' ;

interface QuickActionButtonsProps {
  onNavigate: (page: Page) => void;
}

export function QuickActionButtons({ onNavigate }: QuickActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      <Button
        onClick={() => onNavigate('pos')}
        className="w-full h-24 bg-primary hover:bg-primary/90 flex flex-col gap-2"
      >
        <ShoppingCart className="w-6 h-6" />
        <span>New Sale</span>
      </Button>

      <Button
        onClick={() => onNavigate('services')}
        className="w-full h-24 bg-blue-600 hover:bg-blue-700 flex flex-col gap-2"
      >
        <Wrench className="w-6 h-6" />
        <span>New Service</span>
      </Button>



      <Button
        onClick={() => onNavigate('inventory')}
        variant="outline"
        className="h-24 border-border hover:bg-accent flex flex-col gap-2"
      >
        <Package className="w-6 h-6" />
        <span>Inventory</span>
      </Button>

      <Button
        onClick={() => onNavigate('sales')}
        variant="outline"
        className="h-24 border-border hover:bg-accent flex flex-col gap-2"
      >
        <FileText className="w-6 h-6" />
        <span>Reports</span>
      </Button>
    </div>
  );
}