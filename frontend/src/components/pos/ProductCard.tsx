import { Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  sku: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: { id: string; name: string; price: number; image: string }) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors">
      <div className="aspect-square bg-secondary relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stock < 10 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Low Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-muted-foreground">{product.sku}</p>
        <h4 className="text-foreground mt-1">{product.name}</h4>
        <p className="text-primary mt-2">₱{product.price.toFixed(2)}</p>
        <p className="text-muted-foreground mt-1">Stock: {product.stock}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full bg-primary hover:bg-primary/90"
          disabled={product.stock === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}