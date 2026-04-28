import { useState } from "react";
import { Navbar } from "../layout/Navbar";
import { Sidebar, type Page, type UserRole } from "../layout/Sidebar";
import { SearchBar } from "../pos/SearchBar";
import { CategoryFilterTabs } from "../pos/CategoryFilterTabs";
import { ProductGrid } from "../pos/ProductGrid";
import { CartSidebar } from "../pos/CartSidebar";

interface POSScreenProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  userRole: UserRole; // ✅ FIXED
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export function POSScreen({ onNavigate, onLogout }: { onNavigate: (page: Page) => void; onLogout: () => void }) {
const user = JSON.parse(localStorage.getItem("user") || "null");
const userRole = user?.role || "cashier"; // default to cashier if not found

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const addToCart = (product: {
    id: number;
    name: string;
    price: number;
    image: string;
  }) => {
    setCart((prev) => {
      const productIdString = String(product.id);
      const existingItem = prev.find(
        (item) => item.id === productIdString
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === productIdString
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: productIdString,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity === 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  return (
    <div className="dark min-h-screen bg-background flex flex-col">

      {/* Navbar */}
      <Navbar onLogout={onLogout} role={userRole} name={""} />

      <div className="flex flex-1">

        {/* Sidebar */}
        <Sidebar
          currentPage="pos"
          onNavigate={onNavigate}
          userRole={userRole} // ✅ FIXED HERE
        />

        {/* MAIN */}
        <main className="flex flex-1 h-[calc(100vh-73px)] overflow-hidden">

          {/* PRODUCTS */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6 max-w-6xl">

              <div>
                <h1>Point of Sale</h1>
                <p className="text-muted-foreground">
                  Select products to add to cart
                </p>
              </div>

              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />

              <CategoryFilterTabs
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />

              <ProductGrid
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onAddToCart={addToCart}
                refreshTrigger={refreshTrigger ? 1 : 0}
              />
            </div>
          </div>

          {/* CART */}
          <CartSidebar
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
            setRefreshTrigger={setRefreshTrigger}
          />

        </main>
      </div>
    </div>
  );
}