"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded?: () => void;
}

export function AddProductModal({
  open,
  onOpenChange,
  onProductAdded,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ REF FOR SKU INPUT
  const skuRef = useRef<HTMLInputElement>(null);

  // ✅ AUTO FOCUS WHEN MODAL OPENS
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        skuRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // ✅ SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          barcode: formData.sku,
          category_id: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          image_url: formData.image_url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add product");
      } else {
        setFormData({
          name: "",
          sku: "",
          category: "",
          price: "",
          stock: "",
          image_url: "",
        });

        onOpenChange(false);
        onProductAdded?.();
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl">

          <DialogHeader className="px-6 py-4">
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Scan barcode or enter product details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
            {error && <p className="text-red-500">{error}</p>}

            {/* ✅ SKU ONLY SCANNER FIELD */}
            <div className="space-y-2">
              <Label htmlFor="sku">Scan Barcode / SKU</Label>
              <Input
                ref={skuRef}
                id="sku"
                placeholder="Scan barcode here..."
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && formData.sku.length > 3) {
                    e.preventDefault();
                    document.getElementById("name")?.focus();
                  }
                }}
                autoFocus
                className="bg-input border-border"
                required
              />
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Engine Parts</SelectItem>
                  <SelectItem value="2">Electrical Parts</SelectItem>
                  <SelectItem value="3">Brake System</SelectItem>
                  <SelectItem value="4">Suspension</SelectItem>
                  <SelectItem value="5">Tires & Wheels</SelectItem>
                  <SelectItem value="6">Oils & Fluids</SelectItem>
                  <SelectItem value="7">Accessories</SelectItem>
                  <SelectItem value="8">Tools & Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Product"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}