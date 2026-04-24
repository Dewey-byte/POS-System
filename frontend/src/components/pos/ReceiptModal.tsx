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

declare global {
  interface Window {
    electronAPI?: {
      printReceipt: (sale: ReceiptData) => void;
    };
  }
}

export function ReceiptModal({
  open,
  sale,
  onClose,
}: ReceiptModalProps) {
  useEffect(() => {
    if (!open || !sale) return;

    if (!window.electronAPI) {
      console.error("Electron API not available");
      return;
    }

    const timer = setTimeout(() => {
      console.log("Printing receipt...", sale);
      window.electronAPI?.printReceipt(sale);
    }, 800);

    return () => clearTimeout(timer);
  }, [open, sale]);

  if (!open || !sale) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 w-[300px]">
        <h2 className="font-bold mb-2">Printing Receipt...</h2>

        <p>Sale ID: {sale.sale_id}</p>
        <p>Total: ₱{sale.total_amount}</p>

        <Button onClick={onClose} className="w-full mt-4">
          Close
        </Button>
      </div>
    </div>
  );
}