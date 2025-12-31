import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function EditProductModal({ product, onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "",
    price: "",
    category: "",
  });

  /* PREFILL FORM WHEN PRODUCT CHANGES */
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        sku: product.sku || "",
        unit: product.unit || "",
        price: product.price || "",
        category: product.category || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/products/${product._id}`, {
        ...form,
        price: Number(form.price),
      });

      toast.success("Product updated successfully");
      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (!product) return null;

  return (
    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-5">
        Edit Product
      </h3>

      <div className="space-y-4">
        {/* NAME */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
        />

        {/* SKU */}
        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
        />

        {/* UNIT */}
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select unit</option>
          <option value="pcs">pieces</option>
          <option value="kg">kg</option>
          <option value="litre">litre</option>
          <option value="box">box</option>
        </select>

        {/* PRICE */}
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
        />

        {/* CATEGORY */}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}


