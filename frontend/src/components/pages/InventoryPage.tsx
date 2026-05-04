import { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { InventoryTable } from '../inventory/InventoryTable';
import { AddProductModal } from '../inventory/AddProductModal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Download, Search } from 'lucide-react';
import * as XLSX from "xlsx";

type Page =
  | 'dashboard'
  | 'pos'
  | 'inventory'
  | 'sales'
  | 'settings'
  | 'services'
  | 'mechanics';

export function InventoryPage({
  onNavigate,
  onLogout
}: {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userRole = user?.role || "cashier";

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'normal'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleExport = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");

      if (!res.ok) {
        throw new Error(`HTTP error! ${res.status}`);
      }

      const data = await res.json();

      if (!data || data.length === 0) {
        alert("No data to export");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
      XLSX.writeFile(workbook, "inventory.xlsx");

    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Check API connection.");
    }
  };

  return (
    <div className="dark min-h-screen bg-background flex flex-col">
      <Navbar
        onLogout={onLogout}
        role={user?.role || ""}
        name={user?.name || ""}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentPage="inventory"
          onNavigate={onNavigate}
          userRole={userRole}
        />

        <main className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-foreground">Inventory Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your product stock and details
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-border"
                  onClick={handleExport}
                >
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

            {/* Search + Filter */}
            <div className="flex gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, category, or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-border text-white"
                />
              </div>

              {/* Filter */}
              <select
                value={stockFilter}
                onChange={(e) =>
                  setStockFilter(e.target.value as 'all' | 'low' | 'normal')
                }
                className="bg-input border border-border text-white px-3 rounded-md"
              >
                <option value="all">All</option>
                <option value="low">Low Stock</option>
                <option value="normal">Normal Stock</option>
              </select>
            </div>

            {/* Table */}
            <InventoryTable
              key={refreshKey}
              searchQuery={searchQuery}
              stockFilter={stockFilter}
            />

          </div>
        </main>
      </div>

      {/* Modal */}
      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
}