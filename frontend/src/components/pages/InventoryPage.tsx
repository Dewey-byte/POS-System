import { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { InventoryTable } from '../inventory/InventoryTable';
import { AddProductModal } from '../inventory/AddProductModal';
import { Button } from '../ui/button';
import { Plus, Download } from 'lucide-react';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings';

interface InventoryPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function InventoryPage({ onNavigate, onLogout }: InventoryPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentPage="inventory" onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-foreground">Inventory Management</h1>
                <p className="text-muted-foreground mt-1">Manage your product stock and details</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-border">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Inventory Table */}
            <InventoryTable />
          </div>
        </main>
      </div>

      <AddProductModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}
