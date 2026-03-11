import { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { SearchBar } from '../pos/SearchBar';
import { CategoryFilterTabs } from '../pos/CategoryFilterTabs';
import { ProductGrid } from '../pos/ProductGrid';
import { CartSidebar } from '../pos/CartSidebar';

type Page = 'dashboard' | 'pos' | 'inventory' | 'sales' | 'settings';

interface POSScreenProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export function POSScreen({ onNavigate, onLogout }: POSScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: { id: string; name: string; price: number; image: string }) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => setCart([]);

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentPage="pos" onNavigate={onNavigate} />
        
        <main className="flex-1 flex overflow-hidden">
          {/* Products Section */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-foreground">Point of Sale</h1>
                <p className="text-muted-foreground mt-1">Select products to add to cart</p>
              </div>

              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <CategoryFilterTabs selected={selectedCategory} onSelect={setSelectedCategory} />
              <ProductGrid
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onAddToCart={addToCart}
              />
            </div>
          </div>

          {/* Cart Section */}
          <CartSidebar
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
          />
        </main>
      </div>
    </div>
  );
}
