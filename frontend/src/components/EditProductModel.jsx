import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function EditProductModal({ product, onClose, refresh }) {
  const [form, setForm] = useState({ name: "", sku: "", price: "", 
    unit: "pcs", category: "", minStockLevel: "" });

  const [loading, setLoading] = useState(false);

  /* Prefill when modal opens */
  useEffect(() => {
    if(product){
      setForm({
        name: product.name ?? "",
        sku: product.sku ?? "",
        price: product.price ?? "",
        unit: product.unit ?? "pcs",
        category: product.category ?? "",
        minStockLevel: product.minStockLevel ?? "",
      });
    }
  }, [product]);

  if(!product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.sku || !form.category) {
      return toast.error("Name, SKU and Category are required");
    }

    try {
      setLoading(true);

      await api.put(`/products/${product._id}`, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: Number(form.price),
        unit: form.unit,
        category: form.category.trim(),
        minStockLevel: Number(form.minStockLevel),
      });

      toast.success("Product updated successfully");
      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          {/* Product Name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="input w-full"
            />
          </div>

          {/* SKU (editable now) */}
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
              className="input w-full"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="input w-full"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="box">box</option>
            </select>
          </div>

          {/* Min Stock Level */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Min Stock
            </label>
            <input
              type="number"
              name="minStockLevel"
              value={form.minStockLevel}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="input w-full"
            />
          </div>

          {/* Category */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Enter category"
              className="input w-full"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}


