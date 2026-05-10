import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { ReceiptModal } from "./ReceiptModal";
import axios from "axios";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image: string;
}

interface ReceiptData {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  date: Date;
  sale_id: number;
  total_amount: number;
  payment_method: string;
}

interface CartSidebarProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  setRefreshTrigger: (callback: (prev: boolean) => boolean) => void;
}

export function CartSidebar({
  cart,
  onUpdateQuantity,
  onClearCart,
  setRefreshTrigger,
}: CartSidebarProps) {
  const [discount, setDiscount] = useState<number>(0);
  const [receiptOpen, setReceiptOpen] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const grandTotal = Math.max(0, subtotal - discount);

  const handleCheckout = async () => {
    if (isCheckingOut || cart.length === 0) return;

    const saleData = {
      items: cart.map((item) => ({
        product_id: Number(item.id),
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      discount,
      total: grandTotal,
      payment_method: "cash",
    };

    try {
      setIsCheckingOut(true);

      // Single source of truth: /api/sales handles stock deduction + sale log.
      const salesRes = await axios.post(
        "http://127.0.0.1:5000/api/sales/",
        {
          items: saleData.items,
          total_amount: grandTotal,
          payment_method: "cash",
        }
      );

      // 3. USE REAL DB SALE ID (FIX)
      const receipt: ReceiptData = {
        items: cart,
        subtotal,
        discount,
        total: grandTotal,
        date: new Date(),
        sale_id: salesRes.data.sale_id, // ✅ REAL DATABASE ID
        total_amount: grandTotal,
        payment_method: "cash",
      };

      setReceiptData(receipt);
      setReceiptOpen(true);
      onClearCart();
      setRefreshTrigger((prev) => !prev);

    } catch (err: any) {
      console.error("Checkout failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="w-96 bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col text-white shadow-2xl h-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold tracking-tight uppercase italic">
            Cart
          </h3>
        </div>

        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="text-zinc-500 hover:text-rose-500 hover:bg-transparent transition-all uppercase text-xs font-bold"
          >
            Clear
          </Button>
        )}
      </div>

      {/* RECEIPT MODAL */}
      <ReceiptModal
        open={receiptOpen}
        sale={receiptData}
        onClose={() => setReceiptOpen(false)}
      />

      {/* CART ITEMS */}
      <div className="flex-1 overflow-auto space-y-4 pr-2 scrollbar-hide">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-600 font-bold uppercase text-sm tracking-widest">
              Empty
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-100 truncate text-sm uppercase italic">
                      {item.name}
                    </h4>
                    <p className="text-orange-500 font-mono text-xs mt-1">
                      ₱{item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-zinc-950 rounded border border-zinc-800 p-1">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="h-5 w-5 flex items-center justify-center text-zinc-500 hover:text-orange-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-8 text-center font-mono text-xs font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="h-5 w-5 flex items-center justify-center text-zinc-500 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-[10px] text-zinc-500">
                      max {item.stock}
                    </span>

                    <button
                      onClick={() => onUpdateQuantity(item.id, 0)}
                      className="ml-auto p-2 text-zinc-700 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CHECKOUT */}
      {cart.length > 0 && (
        <div className="mt-8 pt-6 border-t border-zinc-900 space-y-6">
          
          {/* TOTALS */}
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              <span>Subtotal</span>
              <span className="text-zinc-300">₱{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-900">
              <span className="text-xl font-black uppercase italic tracking-tighter">
                Total
              </span>
              <span className="text-xl font-black text-orange-500">
                ₱{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full bg-primary hover:bg-orange-500 py-3 font-bold uppercase disabled:opacity-50 text-primary-foreground rounded-md"
          >
            {isCheckingOut ? "Processing..." : "Confirm"}
          </button>
        </div>
      )}
    </div>
  );
}