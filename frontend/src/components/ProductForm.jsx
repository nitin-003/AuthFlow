import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ProductForm({ fetchProducts, onClose }){
  const [formData, setFormData] = useState({
    name: "", sku: "", unit: "pcs", price: "", quantity: "", category: "", minStockLevel: "" });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.name || !formData.sku || !formData.price){
      return toast.error("Please fill all required fields");
    }

    try{
      setLoading(true);

      await api.post("/products", {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        unit: formData.unit,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        category: formData.category.trim(),
        minStockLevel: Number(formData.minStockLevel),
      });

      toast.success("Product created successfully");
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

  const inputClass =
    "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Add Product
      </h2>

      <input autoFocus name="name" value={formData.name} onChange={handleChange}
        placeholder="Product name" className={inputClass} required
      />

      <div className="grid grid-cols-2 gap-3">
        <input name="sku" value={formData.sku} onChange={handleChange}
          placeholder="SKU" className={inputClass} required
        />

        <input type="number" min="0" name="price" value={formData.price}
          onChange={handleChange} placeholder="Price"
          className={inputClass} required
        />
      </div>

      <input type="number" min="0" name="quantity" value={formData.quantity} 
        onChange={handleChange} placeholder="Initial quantity" 
        className={inputClass} required
      />

      <div className="grid grid-cols-2 gap-3">
        <select name="unit" value={formData.unit}
          onChange={handleChange} className={inputClass}
        >
          <option value="pcs">pcs</option>
          <option value="kg">kg</option>
          <option value="litre">litre</option>
          <option value="box">box</option>
        </select>

        <input type="number" min="0" name="minStockLevel"
          value={formData.minStockLevel} onChange={handleChange}
          placeholder="Min stock level" className={inputClass} required
        />
      </div>

      <input name="category" value={formData.category}
        onChange={handleChange} placeholder="Category"
        className={inputClass} required
      />

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>

        <button type="submit" disabled={loading}
          className="px-4 py-2 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>
    </form>
  );
}


