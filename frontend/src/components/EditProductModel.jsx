import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function EditProductModal({ product, onClose, refresh }){
  const [form, setForm] = useState({
    name: "", sku: "", price: "", unit: "pcs", category: "" });

  /* Prefill when modal opens */
  useEffect(() => {
    if(product){
      setForm({
        name: product.name ?? "",
        sku: product.sku ?? "",
        price: product.price ?? "",
        unit: product.unit ?? "pcs",
        category: product.category ?? "",
      });
    }
  }, [product]);

  if(!product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if(!form.name || !form.sku || !form.category){
      return toast.error("Name, SKU and Category are required");
    }

    try{
      await api.put(`/products/${product._id}`, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: Number(form.price),
        unit: form.unit,
        category: form.category.trim(),
      });

      toast.success("Product updated successfully");
      refresh();
      onClose();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Product
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange}
            placeholder="Product Name" className="col-span-2 input"
          />

          <input name="sku" value={form.sku} onChange={handleChange}
            placeholder="SKU" className="input"
          />

          <input
            type="number" name="price" value={form.price} onChange={handleChange} 
            placeholder="Price" min="0" className="input"
          />

          <select name="unit" value={form.unit}
            onChange={handleChange} className="input"
          >
            <option value="pcs">Pieces</option>
            <option value="kg">Kg</option>
            <option value="litre">Litre</option>
            <option value="box">Box</option>
          </select>

          <input name="category" value={form.category} onChange={handleChange}
            placeholder="Category" className="col-span-2 input"
          />
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
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}



