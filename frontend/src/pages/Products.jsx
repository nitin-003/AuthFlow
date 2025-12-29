import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductForm from "../components/ProductForm";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <ProductForm
        fetchProducts={fetchProducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">₹{p.price}</td>
                <td className="p-2 border">{p.quantity}</td>
                <td className="p-2 border">{p.category}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center mt-4 text-gray-500">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}

