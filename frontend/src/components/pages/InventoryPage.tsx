import { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { InventoryTable } from '../inventory/InventoryTable';
import { AddProductModal } from '../inventory/AddProductModal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Download, Search } from 'lucide-react';

type Page =
  | 'dashboard'
  | 'pos'
  | 'inventory'
  | 'sales'
  | 'settings'
  | 'services'
  | 'customers'
  | 'mechanics';

export function InventoryPage({ onNavigate, onLogout }: { onNavigate: (page: Page) => void; onLogout: () => void }) {
const user = JSON.parse(localStorage.getItem("user") || "null");
const userRole = user?.role || "cashier"; // default to cashier if not found

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // triggers table refresh

  const handleProductAdded = () => {
    // Increment refreshKey to re-fetch products
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="dark min-h-screen bg-background flex flex-col">
      <Navbar onLogout={onLogout} role={user?.role || ""} name={user?.name || ""} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage="inventory" onNavigate={onNavigate} userRole={userRole} />

        <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
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

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, category, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Inventory Table */}
            <InventoryTable key={refreshKey} searchQuery={searchQuery} />
          </div>
        </main>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onProductAdded={handleProductAdded} // refresh table after adding
      />
    </div>
  );
}