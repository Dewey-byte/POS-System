import { useEffect } from "react";
import { Button } from "../ui/button";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptData {
  sale_id: number;
  total_amount: number;
  payment_method: string;
  items: ReceiptItem[];
}

interface ReceiptModalProps {
  open: boolean;
  sale: ReceiptData | null;
  onClose: () => void;
}

export function ReceiptModal({
  open,
  sale,
  onClose,
}: ReceiptModalProps) {

  useEffect(() => {
    if (open && sale) {
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [open, sale]);

  if (!open || !sale) return null;

  return (
    // Update this line in your component
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:bg-transparent print:static print:block">

      {/* 🧾 RECEIPT CONTAINER */}
      <div
        className="bg-white w-[300px] p-2 text-[12px] font-mono receipt-container print:w-full print:p-0"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >

        {/* HEADER */}
        <div className="text-center mb-2">
          <h2 className="font-bold text-sm uppercase">My Store</h2>
          <p>Official Receipt</p>
          <p>--------------------------------</p>
        </div>

        {/* SALE INFO */}
        <div className="mb-2">
          <div className="flex justify-between">
             <span>ID: {sale.sale_id}</span>
             <span>{new Date().toLocaleDateString()}</span>
          </div>
          <p>Pay Method: {sale.payment_method}</p>
          <p>--------------------------------</p>
        </div>

        {/* ITEMS */}
        <div className="space-y-1">
          {sale.items?.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              {/* Name on its own line ensures it doesn't get cut off */}
              <span className="font-bold uppercase">{item.name}</span>
              <div className="flex justify-between">
                <span>{item.quantity} x {item.price.toFixed(2)}</span>
                <span>₱{(item.quantity * item.price).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-2">--------------------------------</p>

        {/* TOTAL */}
        <div className="flex justify-between font-bold text-[14px]">
          <span>TOTAL</span>
          <span>₱{Number(sale.total_amount || 0).toFixed(2)}</span>
        </div>

        <p className="text-center mt-4 mb-2">
          Thank you for your purchase!
        </p>

        {/* CLOSE BUTTON (hidden when printing) */}
        <div className="mt-4 print:hidden">
          <Button onClick={onClose} className="w-full" variant="outline">
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}