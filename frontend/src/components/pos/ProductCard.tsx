import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { readAppSettings } from "../../lib/appSettings";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  sku: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [lowStockSettings, setLowStockSettings] = useState(() => readAppSettings());
  const isOutOfStock = product.stock <= 0;
  const isLowStock =
    lowStockSettings.lowStockAlertsEnabled &&
    product.stock > 0 &&
    product.stock <= lowStockSettings.lowStockThreshold;

  // ✅ image fallback state
  const [imgSrc, setImgSrc] = useState(
    product.image && product.image.trim()
      ? product.image
      : "/no-image.png"
  );

  useEffect(() => {
    const syncSettings = () => {
      setLowStockSettings(readAppSettings());
    };

    window.addEventListener("app-settings-updated", syncSettings);
    return () => {
      window.removeEventListener("app-settings-updated", syncSettings);
    };
  }, []);

  return (
    <Card className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors">
      
      {/* IMAGE (uniform size) */}
      <div className="w-full aspect-square bg-secondary relative overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover object-center"
          onError={() => setImgSrc("/no-image.png")}
        />

        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}

        {isLowStock && (
         <Badge className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-500 ">
            Low Stock
          </Badge>
        )}
      </div>

      {/* CONTENT */}
      <CardContent className="p-4">
        <p className="text-muted-foreground">{product.sku}</p>
        <h4 className="text-foreground mt-1">{product.name}</h4>
        <p className="text-primary mt-2">₱{product.price.toFixed(2)}</p>

        <p
          className={`mt-1 ${
            isOutOfStock ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          Stock: {product.stock}
        </p>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isOutOfStock}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}