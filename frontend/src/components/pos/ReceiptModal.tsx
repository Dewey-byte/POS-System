import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { readAppSettings } from "../../lib/appSettings";

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

interface PrintableReceiptData extends ReceiptData {
  storeName: string;
  storeLocation: string;
}

interface ReceiptModalProps {
  open: boolean;
  sale: ReceiptData | null;
  onClose: () => void;
}

declare global {
  interface Window {
    electronAPI?: {
      printReceipt: (sale: PrintableReceiptData) => void;
    };
  }
}

export function ReceiptModal({
  open,
  sale,
  onClose,
}: ReceiptModalProps) {
  const hasPrinted = useRef(false);

  useEffect(() => {
    if (!open || !sale) {
      hasPrinted.current = false; // reset when modal closes
      return;
    }

    if (!window.electronAPI) {
      console.error("Electron API not available");
      return;
    }

    // 🔥 prevent duplicate printing
    if (hasPrinted.current) return;
    hasPrinted.current = true;

    const timer = setTimeout(() => {
      const settings = readAppSettings();
      const printableSale: PrintableReceiptData = {
        ...sale,
        storeName: settings.storeName,
        storeLocation: settings.storeLocation,
      };
      console.log("Printing receipt...", printableSale);
      window.electronAPI?.printReceipt(printableSale);
    }, 500);

    return () => clearTimeout(timer);
  }, [open, sale]);

  if (!open || !sale) return null;

  const formatMoney = (value: number) => `PHP ${Number(value || 0).toFixed(2)}`;
  const appSettings = readAppSettings();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl w-[340px] text-white">
        <div className="bg-zinc-950 text-white border border-zinc-800 p-4 rounded-md font-mono text-xs receipt-container">
          <p className="text-center font-bold">{appSettings.storeName}</p>
          <p className="text-center">{appSettings.storeLocation}</p>
          <div className="border-t border-dashed border-zinc-600 my-2" />
          <p className="font-bold">Order</p>
          <p>Receipt #{sale.sale_id}</p>
          <div className="border-t border-dashed border-zinc-600 my-2" />
          <p>Date: {new Date().toLocaleString()}</p>
          <p>Payment: {sale.payment_method}</p>
          <div className="border-t border-dashed border-zinc-600 my-2" />

          <div className="grid grid-cols-4 gap-1 font-bold">
            <span>ITEM</span>
            <span className="text-right">QTY</span>
            <span className="text-right">PRICE</span>
            <span className="text-right">AMT</span>
          </div>
          {sale.items.map((item, index) => (
            <div key={`${item.name}-${index}`} className="grid grid-cols-4 gap-1">
              <span className="truncate">{item.name}</span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">{formatMoney(item.price)}</span>
              <span className="text-right">
                {formatMoney(item.price * item.quantity)}
              </span>
            </div>
          ))}

          <div className="border-t border-dashed border-zinc-600 my-2" />
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>{formatMoney(sale.total_amount)}</span>
          </div>
          <p className="text-center mt-3">♥ ♥ ♥ ♥ ♥ ♥</p>
          <p className="text-center font-bold">THANK YOU!</p>
          <p className="text-center font-bold">for your purchase!</p>
        </div>

        <Button onClick={onClose} className="w-full mt-4">
          Close
        </Button>
      </div>
    </div>
  );
}