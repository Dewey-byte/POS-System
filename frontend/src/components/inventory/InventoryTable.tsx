"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

interface InventoryTableProps {
  searchQuery: string;
  stockFilter: "all" | "low" | "normal";
}

export function InventoryTable({
  searchQuery,
  stockFilter,
}: InventoryTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/products/");
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      setProducts(
        data.map((p: any) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          image: p.image_url || "",
        }))
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowEditDialog(true);
  };

 const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!editProduct) return;

  // ✅ Image validation
  if (
    editProduct.image &&
    !editProduct.image.startsWith("http") &&
    editProduct.image.trim() !== ""
  ) {
    setError("Image URL must start with http/https");
    return;
  }

  try {
    // ✅ Build payload dynamically
    const payload: any = {
      name: editProduct.name,
      barcode: editProduct.sku,
      price: editProduct.price,
      stock: editProduct.stock,
      category_id: 1,
    };

    // ✅ ONLY include image_url if not empty
    if (editProduct.image?.trim() !== "") {
      payload.image_url = editProduct.image;
    }

    const res = await fetch(
      `http://127.0.0.1:5000/api/products/${editProduct.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error("Update failed");
    }

    setShowEditDialog(false);

    fetchProducts();
  } catch (err: any) {
    alert(err.message);
  }
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query);

    let matchesStock = true;
    if (stockFilter === "low") matchesStock = p.stock <= 5;
    if (stockFilter === "normal") matchesStock = p.stock > 5;

    return matchesSearch && matchesStock;
  });

  return (
    <>
      <Card className="bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.map((item) => {
              const isLow = item.stock <= 5;

              return (
                <TableRow key={item.id}>
                  <TableCell>{item.sku}</TableCell>

                  <TableCell className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        className="w-10 h-10 rounded object-cover border"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/40";
                        }}
                      />
                    )}
                    {item.name}
                  </TableCell>

                  <TableCell>{item.category}</TableCell>
                  <TableCell>₱{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.stock}</TableCell>

                  <TableCell>
                    {isLow ? (
                      <Badge variant="destructive">Low</Badge>
                    ) : (
                      <Badge className="bg-green-500/10 text-green-500">
                        Normal
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* EDIT MODAL */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="p-0">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl">
            <DialogHeader className="px-6 py-4">
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>

            {editProduct && (
              <form onSubmit={handleEditSubmit} className="space-y-4 px-6 pb-6">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>SKU</Label>
                  <Input
                    value={editProduct.sku}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        sku: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      value={editProduct.stock}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          stock: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

             {/* IMAGE */}
              <div className="space-y-2">
                <Label>Image URL</Label>

                <Input
                  placeholder="https://example.com/image.jpg"
                  value={editProduct.image || ""}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      image: e.target.value,
                    })
                  }
                />

           {editProduct.image && (
          <div className="mt-2 w-20 h-20 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
            <img
              src={editProduct.image}
              alt="Preview"
              className="w-full h-full object-cover block"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/150?text=No+Image";
              }}
            />
          </div>
        )}
              </div>

                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}