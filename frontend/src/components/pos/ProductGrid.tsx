import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  sku: string;
}

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  onAddToCart: (product: { id: string; name: string; price: number; image: string }) => void;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Full Face Helmet',
    price: 299.99,
    category: 'helmets',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=400&h=400&fit=crop',
    sku: 'HLM-001',
  },
  {
    id: '2',
    name: 'Leather Riding Jacket',
    price: 449.99,
    category: 'gear',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    sku: 'GER-001',
  },
  {
    id: '3',
    name: 'Brake Pads Set',
    price: 79.99,
    category: 'parts',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    sku: 'PRT-001',
  },
  {
    id: '4',
    name: 'Chain Lock',
    price: 129.99,
    category: 'accessories',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400&h=400&fit=crop',
    sku: 'ACC-001',
  },
  {
    id: '5',
    name: 'Engine Oil 10W-40',
    price: 24.99,
    category: 'oils',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=400&h=400&fit=crop',
    sku: 'OIL-001',
  },
  {
    id: '6',
    name: 'Riding Gloves',
    price: 89.99,
    category: 'gear',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1590422749897-dda4e2f3c7e7?w=400&h=400&fit=crop',
    sku: 'GER-002',
  },
  {
    id: '7',
    name: 'LED Headlight',
    price: 159.99,
    category: 'parts',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    sku: 'PRT-002',
  },
  {
    id: '8',
    name: 'Phone Mount',
    price: 39.99,
    category: 'accessories',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
    sku: 'ACC-002',
  },
];

export function ProductGrid({ searchQuery, selectedCategory, onAddToCart }: ProductGridProps) {
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No products found
        </div>
      )}
    </div>
  );
}
