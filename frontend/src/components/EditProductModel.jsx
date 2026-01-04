import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function EditProductModal({ product, onClose, refresh }) {
  const [form, setForm] = useState({ name: "", sku: "",
    price: "", unit: "pcs", category: "", minStockLevel: "" });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* Prefill when modal opens */
  useEffect(() => {
    if(product){
      setForm({ name: product.name ?? "", sku: product.sku ?? "",
        price: product.price ?? "", unit: product.unit ?? "pcs",
        category: product.category ?? "", minStockLevel: product.minStockLevel ?? "",
      });

      setPreview(product.image || null);
    }
  }, [product]);

  if(!product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if(!form.name || !form.sku || !form.category){
      return toast.error("Name, SKU and Category are required");
    }

    try{
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));

      data.set("price", Number(form.price || 0));
      data.set("minStockLevel", Number(form.minStockLevel || 0));

      if(image) data.append("image", image);

      await api.put(`/products/${product._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully");
      refresh();
      onClose();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Update failed");
    } 
    finally{
      setLoading(false);
    }
  };

  /* Shared styles */
  const input = "w-full rounded-xl border border-gray-300 px-3 py-2 text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

  const label = "block text-xs font-semibold text-gray-600 mb-1 tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="border-t border-gray-200" />
          <span
            className="absolute left-1/2 -top-3 -translate-x-1/2
              bg-white px-3 text-xs font-semibold text-gray-500"
          ></span>
        </div>

        {/* Image Section */}
        <div className="mb-6 space-y-2">
          <label className={label}>Product Image</label>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border bg-gray-50 overflow-hidden flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover"/>
              ) : (
                <span className="text-xs text-gray-400">No Image</span>
              )}
            </div>

            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
              <span className="px-4 py-2 text-sm rounded-xl bg-gray-200 hover:bg-gray-300 transition">
                Change Image
              </span>
            </label>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={label}>Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className={input}/>
          </div>

          <div>
            <label className={label}>SKU *</label>
            <input name="sku" value={form.sku} onChange={handleChange} className={input}/>
          </div>

          <div>
            <label className={label}>Price</label>
            <input type="number" min="0" name="price" value={form.price}
              onChange={handleChange} className={input}
            />
          </div>

          <div>
            <label className={label}>Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange} className={input}>
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="box">box</option>
            </select>
          </div>

          <div>
            <label className={label}>Min Stock</label>
            <input type="number" min="0" name="minStockLevel" value={form.minStockLevel}
              onChange={handleChange} className={input}/>
          </div>

          <div className="col-span-2">
            <label className={label}>Category *</label>
            <input name="category" value={form.category} onChange={handleChange} className={input}/>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}


