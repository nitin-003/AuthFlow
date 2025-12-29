import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ProductForm({
  fetchProducts,
  selectedProduct,
  setSelectedProduct
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: ""
  });

  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct._id}`, formData);
        toast.success("Product updated");
      } else {
        await api.post("/products", formData);
        toast.success("Product created");
      }

      setFormData({ name: "", price: "", quantity: "", category: "" });
      setSelectedProduct(null);
      fetchProducts();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow"
    >
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="border p-2 rounded"
        required
      />
      <input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="border p-2 rounded"
        required
      />
      <input
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        className="border p-2 rounded"
        required
      />
      <input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="col-span-1 md:col-span-4 bg-green-600 text-white py-2 rounded"
      >
        {selectedProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}


