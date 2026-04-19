import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { ReceiptModal } from "./ReceiptModal";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    const saleData: ReceiptData = {
      items: cart,
      subtotal,
      discount,
      total: grandTotal,
      date: new Date(),
      sale_id: Date.now(),
      total_amount: grandTotal,
      payment_method: "cash",
    };
    setReceiptData(saleData);
    setReceiptOpen(true);
    onClearCart();
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <div className="w-96 bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col text-white shadow-2xl h-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold tracking-tight uppercase italic">Cart</h3>
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

      <ReceiptModal open={receiptOpen} sale={receiptData} onClose={() => setReceiptOpen(false)} />

      {/* CART ITEMS */}
      <div className="flex-1 overflow-auto space-y-4 pr-2 scrollbar-hide">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-600 font-bold uppercase text-sm tracking-widest">Empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-100 truncate text-sm uppercase italic">{item.name}</h4>
                    <p className="text-orange-500 font-mono text-xs mt-1">₱{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-zinc-950 rounded border border-zinc-800 p-1">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="h-5 w-5 flex items-center justify-center text-zinc-500 hover:text-orange-500"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center font-mono text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="h-5 w-5 flex items-center justify-center text-zinc-500 hover:text-orange-500"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => onUpdateQuantity(item.id, 0)} className="ml-auto p-2 text-zinc-700 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CHECKOUT SECTION */}
      {cart.length > 0 && (
        <div className="mt-8 pt-6 border-t border-zinc-900 space-y-6">
          
          {/* DISCOUNT INPUT FIXED */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Discount</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-zinc-400 text-xs font-bold">₱</span>
              <input
                type="number"
                value={discount || ''}
                placeholder="0.00"
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded focus:border-zinc-600 outline-none text-zinc-100 text-sm font-mono transition-all"
              />
            </div>
          </div>

          {/* TOTALS */}
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              <span>Subtotal</span>
              <span className="text-zinc-300">₱{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-500 text-[10px] font-bold uppercase tracking-wider">
                <span>Discount</span>
                <span>- ₱{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t border-zinc-900">
              <span className="text-xl font-black uppercase italic tracking-tighter">Total</span>
              <span className="text-xl font-black text-orange-500">₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* ORANGE CHECKOUT BUTTON FIXED */}
          <button
            onClick={handleCheckout}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase italic tracking-widest rounded-lg active:scale-[0.98] transition-all shadow-lg shadow-orange-900/20 border-none outline-none"
          >
            Confirm 
          </button>
        </div>
      )}
    </div>
  );
}