import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ProductForm({ fetchProducts, onClose }) {
  const [formData, setFormData] = useState({ name: "",
    sku: "", unit: "pcs", price: "", quantity: "", category: "", minStockLevel: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.name || !formData.sku || !formData.category){
      return toast.error("Name, SKU and Category are required");
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      data.set("price", Number(formData.price || 0));
      data.set("quantity", Number(formData.quantity || 0));
      data.set("minStockLevel", Number(formData.minStockLevel || 0));

      if(image) data.append("image", image);

      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully");
      fetchProducts();
      onClose();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Product creation failed");
    } 
    finally{
      setLoading(false);
    }
  };

  const input = "w-full rounded-xl border border-gray-300 px-3 py-2 text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

  const label = "text-xs font-bold text-gray-600";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-h-[90vh] overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Add New Product
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Add inventory details for tracking
        </p>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 py-6 space-y-6 overflow-y-auto flex-1">
        {/* Product Name */}
        <div className="space-y-1">
          <label className={label}>Product Name *</label>
          <input autoFocus name="name" value={formData.name}
            onChange={handleChange} placeholder="e.g. Wireless Mouse" className={input}
          />
        </div>

        {/* Product Image */}
        <div className="space-y-2">
          <label className={label}>Product Image</label>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border bg-gray-50 overflow-hidden flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No Image</span>
              )}
            </div>

            <label className="cursor-pointer">
              <input type="file" accept="image/*"
                onChange={handleImageChange} className="hidden"
              />
              <span className="px-4 py-2 text-sm rounded-xl bg-gray-200 hover:bg-gray-300 transition">
                Upload Image
              </span>
            </label>
          </div>
        </div>

        {/* SKU / Price / Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className={label}>SKU *</label>
            <input name="sku" value={formData.sku}
              onChange={handleChange} placeholder="e.g. SKU-001" className={input}
            />
          </div>

          <div className="space-y-1">
            <label className={label}>Price</label>
            <input type="number" min="0" name="price" value={formData.price} 
              onChange={handleChange} placeholder="Rs 0" className={input}
            />
          </div>

          <div className="space-y-1">
            <label className={label}>Quantity</label>
            <input type="number" min="0" name="quantity" value={formData.quantity}
              onChange={handleChange} placeholder="0" className={input}
            />
          </div>
        </div>

        {/* Unit / Min Stock / Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className={label}>Unit</label>
            <select name="unit" value={formData.unit}
              onChange={handleChange} className={input}
            >
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="box">box</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className={label}>Min Stock</label>
            <input type="number" min="0" name="minStockLevel"
              value={formData.minStockLevel} onChange={handleChange}
              placeholder="0" className={input}
            />
          </div>

          <div className="space-y-1">
            <label className={label}>Category *</label>
            <input name="category" value={formData.category} onChange={handleChange}
              placeholder="e.g. Electronics" className={input}
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
        <button type="button" onClick={onClose}
          className="px-4 py-2 rounded-xl text-sm bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <button type="submit" disabled={loading}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white
            bg-indigo-600 hover:bg-indigo-700 
            disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>
    </form>
  );
}


