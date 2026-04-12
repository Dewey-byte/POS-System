import { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

// Add props interface
interface InventoryTableProps {
  searchQuery: string;
}

export function InventoryTable({ searchQuery }: InventoryTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/products/');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(
        data.map((p: any) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          image: p.image || '',
        }))
      );
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editProduct.name,
          barcode: editProduct.sku,
          price: editProduct.price,
          stock: editProduct.stock,
          category_id: 1,
          image_url: editProduct.image,
        }),
      });
      if (!res.ok) throw new Error('Failed to update product');
      setShowEditDialog(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Filter products based on searchQuery
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card className="bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((item) => {
              const status = item.stock <= 5 ? 'low' : 'normal';
              return (
                <TableRow key={item.id} className="border-border">
                  <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                  <TableCell className="text-foreground">{item.name}</TableCell>
                  <TableCell className="text-foreground">{item.category}</TableCell>
                  <TableCell className="text-foreground">₱{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-foreground">{item.stock}</TableCell>
                  <TableCell>
                    {status === 'low' ? (
                      <Badge variant="destructive">Low Stock</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        Normal
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Modal */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={editProduct.sku}
                  onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}