import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ProductForm({ fetchProducts, selectedProduct, setSelectedProduct, onClose }){
  const [formData, setFormData] = useState({
    name: "", sku: "", unit: "pcs", price: "", quantity: "", category: "", minStockLevel: "" });

  const [loading, setLoading] = useState(false);

  /* Prefill data when editing */
  useEffect(() => {
    if(selectedProduct){
      setFormData({
        name: selectedProduct.name ?? "",
        sku: selectedProduct.sku ?? "",
        unit: selectedProduct.unit ?? "pcs",
        price: selectedProduct.price ?? "",
        category: selectedProduct.category ?? "",
        minStockLevel: selectedProduct.minStockLevel ?? "",
        quantity: "",
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.name || !formData.sku || !formData.price){
      return toast.error("Please fill all required fields");
    }

    setLoading(true);

    try{
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        unit: formData.unit,
        price: Number(formData.price),
        category: formData.category.trim(),
        minStockLevel: Number(formData.minStockLevel),
      };

      // Quantity only when creating product
      if(!selectedProduct){
        payload.quantity = Number(formData.quantity);
      }

      selectedProduct
        ? await api.patch(`/products/${selectedProduct._id}`, payload)
        : await api.post("/products", payload);

      toast.success(
        selectedProduct
          ? "Product updated successfully"
          : "Product created successfully"
      );

      fetchProducts();
      setSelectedProduct?.(null);
      onClose();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Operation failed");
    } 
    finally{
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border rounded-md text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          {selectedProduct ? "Update Product" : "Add Product"}
        </h2>
      </div>

      {/* PRODUCT NAME */}
      <input autoFocus name="name" value={formData.name}
        onChange={handleChange} placeholder="Product name" required className={inputClass}
      />

      {/* SKU + PRICE */}
      <div className="grid grid-cols-2 gap-3">
        <input name="sku" value={formData.sku} onChange={handleChange}
          disabled={Boolean(selectedProduct)} placeholder="SKU" required
          className={`${inputClass} bg-gray-100 disabled:text-gray-500`}
        />

        <input type="number" min="0" name="price" value={formData.price}
          onChange={handleChange} placeholder="Price" required className={inputClass}
        />
      </div>

      {/* QUANTITY (CREATE ONLY) */}
      {!selectedProduct && (
        <input type="number" min="0" name="quantity" value={formData.quantity}
          onChange={handleChange} placeholder="Initial quantity" required className={inputClass}
        />
      )}

      {/* UNIT + MIN STOCK */}
      <div className="grid grid-cols-2 gap-3">
        <select name="unit" value={formData.unit}
          onChange={handleChange} className={inputClass}
        >
          <option value="pcs">pcs</option>
          <option value="kg">kg</option>
          <option value="litre">litre</option>
          <option value="box">box</option>
        </select>

        <input type="number" min="0" name="minStockLevel" value={formData.minStockLevel}
          onChange={handleChange} placeholder="Min stock level" required className={inputClass}
        />
      </div>

      {/* CATEGORY */}
      <input name="category" value={formData.category} onChange={handleChange}
        placeholder="Category" required className={inputClass}
      />

      {/* FOOTER */}
      <div className="flex justify-end gap-3 pt-3">
        <button type="button" onClick={onClose}
          className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded-md text-white
                     bg-indigo-600 hover:bg-indigo-700
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : selectedProduct ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}

