import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ProductForm({ fetchProducts, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    unit: "pcs",
    price: "",
    quantity: "",
    category: "",
    minStockLevel: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      unit: "pcs",
      price: "",
      quantity: "",
      category: "",
      minStockLevel: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.name || !formData.sku || !formData.category){
      return toast.error("Name, SKU and Category are required");
    }

    try{
      setLoading(true);

      await api.post("/products", {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        unit: formData.unit,
        price: Number(formData.price || 0),
        quantity: Number(formData.quantity || 0),
        category: formData.category.trim(),
        minStockLevel: Number(formData.minStockLevel || 0),
      });

      toast.success("Product created successfully");
      fetchProducts();
      resetForm();
      onClose();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Product creation failed");
    } 
    finally{
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition";

  const labelClass =
    "text-xs font-medium text-gray-600 mb-1 block";

  return (
    <form
        onSubmit={handleSubmit}
        className="w-[450px] bg-white rounded-2xl shadow-lg flex flex-col"
    >
      {/* -------- HEADER -------- */}
      <div className="px-5 py-4 border-b">
        <h2 className="text-base font-semibold text-gray-800">
          Add New Product
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Enter basic product details for inventory tracking
        </p>
      </div>

      {/* -------- BODY -------- */}
      <div className="px-5 py-4 space-y-4 flex-1">
        {/* Product Name */}
        <div>
          <label className={labelClass}>Product Name *</label>
          <input
            autoFocus
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Mouse"
            className={inputClass}
            required
          />
        </div>

        {/* SKU / Price / Qty */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>SKU *</label>
            <input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SKU-001"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Rs 0"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Quantity</label>
            <input
              type="number"
              min="0"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>

        {/* Unit / Min / Category */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="box">box</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Min Stock</label>
            <input
              type="number"
              min="0"
              name="minStockLevel"
              value={formData.minStockLevel}
              onChange={handleChange}
              placeholder="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Electronics"
              className={inputClass}
              required
            />
          </div>
        </div>
      </div>

      {/* -------- FOOTER -------- */}
      <div className="px-5 py-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>
    </form>
  );
}

