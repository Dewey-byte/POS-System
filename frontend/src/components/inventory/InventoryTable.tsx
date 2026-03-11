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

const inventoryData = [
  {
    id: '1',
    sku: 'HLM-001',
    name: 'Full Face Helmet',
    category: 'Helmets',
    price: 299.99,
    stock: 15,
    status: 'normal',
  },
  {
    id: '2',
    sku: 'GER-001',
    name: 'Leather Riding Jacket',
    category: 'Riding Gear',
    price: 449.99,
    stock: 8,
    status: 'low',
  },
  {
    id: '3',
    sku: 'PRT-001',
    name: 'Brake Pads Set',
    category: 'Parts',
    price: 79.99,
    stock: 25,
    status: 'normal',
  },
  {
    id: '4',
    sku: 'ACC-001',
    name: 'Chain Lock',
    category: 'Accessories',
    price: 129.99,
    stock: 5,
    status: 'low',
  },
  {
    id: '5',
    sku: 'OIL-001',
    name: 'Engine Oil 10W-40',
    category: 'Oils & Fluids',
    price: 24.99,
    stock: 30,
    status: 'normal',
  },
  {
    id: '6',
    sku: 'GER-002',
    name: 'Riding Gloves',
    category: 'Riding Gear',
    price: 89.99,
    stock: 20,
    status: 'normal',
  },
  {
    id: '7',
    sku: 'PRT-002',
    name: 'LED Headlight',
    category: 'Parts',
    price: 159.99,
    stock: 3,
    status: 'low',
  },
  {
    id: '8',
    sku: 'ACC-002',
    name: 'Phone Mount',
    category: 'Accessories',
    price: 39.99,
    stock: 35,
    status: 'normal',
  },
];

export function InventoryTable() {
  return (
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
          {inventoryData.map((item) => (
            <TableRow key={item.id} className="border-border">
              <TableCell className="text-muted-foreground">{item.sku}</TableCell>
              <TableCell className="text-foreground">{item.name}</TableCell>
              <TableCell className="text-foreground">{item.category}</TableCell>
              <TableCell className="text-foreground">₱{item.price.toFixed(2)}</TableCell>
              <TableCell className="text-foreground">{item.stock}</TableCell>
              <TableCell>
                {item.status === 'low' ? (
                  <Badge variant="destructive">Low Stock</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                    Normal
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}