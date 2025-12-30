import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get("/products");
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, fetchProducts };
}

