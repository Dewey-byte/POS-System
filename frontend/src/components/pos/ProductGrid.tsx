import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ProductCard } from "./ProductCard";
import { debounce } from "lodash";

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
  onAddToCart: (product: {
    id: string;
    name: string;
    price: number;
    image: string;
  }) => void;
}

export function ProductGrid({
  searchQuery,
  selectedCategory,
  onAddToCart,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 🔗 Fetch products once
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setDisplayedProducts(res.data.slice(0, 20)); // initial load
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ⚡ Debounced filter
  const debouncedFilter = useRef(
    debounce((query: string, category: string, allProducts: Product[]) => {
      const filtered = allProducts.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.sku.toLowerCase().includes(query.toLowerCase());

        const matchesCategory =
          category === "all" || product.category === category;

        return matchesSearch && matchesCategory;
      });

      setDisplayedProducts(filtered.slice(0, 20));
      setPage(1);
    }, 300)
  ).current;

  useEffect(() => {
    debouncedFilter(searchQuery, selectedCategory, products);
  }, [searchQuery, selectedCategory, products]);

  // 🔄 Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [displayedProducts]);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * 20;

    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setDisplayedProducts(filtered.slice(start, end));
    setPage(nextPage);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      
      {/* 📌 Sticky Category Header */}
      <div className="sticky top-0 bg-white z-10 p-2 border-b">
        <h2 className="font-semibold text-lg">
          {selectedCategory === "all" ? "All Products" : selectedCategory}
        </h2>
      </div>

      {/* 🔥 Scrollable Grid */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                image: product.image || "/default-product.png",
              }}
              onAddToCart={onAddToCart}
            />
          ))}

          {displayedProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No products found
            </div>
          )}
        </div>

        {/* 🔄 Infinite Scroll Trigger */}
        <div ref={observerRef} className="h-10 flex items-center justify-center">
          <span className="text-sm text-gray-400">Loading more...</span>
        </div>
      </div>
    </div>
  );
}