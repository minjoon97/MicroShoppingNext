import { fetchProducts } from "@/data/products";
import { fetchedProductsType } from "@/types/ProductType";
import { useEffect, useState } from "react";

export function useProducts() {
  const [items, setItems] = useState<fetchedProductsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchProducts();
      setItems(products);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { items, loading };
}
