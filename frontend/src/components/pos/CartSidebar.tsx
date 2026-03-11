import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSidebarProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
}

export function CartSidebar({ cart, onUpdateQuantity, onClearCart }: CartSidebarProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="w-96 bg-card border-l border-border p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h3 className="text-foreground">Cart</h3>
        </div>
        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="text-destructive hover:text-destructive"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto space-y-4">
        {cart.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <Card key={item.id} className="bg-secondary border-border p-3">
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-foreground truncate">{item.name}</h4>
                  <p className="text-primary">₱{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 ml-auto text-destructive"
                      onClick={() => onUpdateQuantity(item.id, 0)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Checkout Section */}
      {cart.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-foreground">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Tax (10%)</span>
              <span>₱{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground border-t border-border pt-2">
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">
            Checkout - ₱{total.toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  );
}