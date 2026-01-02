import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UpdateInventoryModal from "./UpdateInventoryModel";
import EditProductModal from "./EditProductModel";

export default function ProductTable({ products = [], fetchProducts, loading }){
  const navigate = useNavigate();

  const [inventoryProduct, setInventoryProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const alertedRef = useRef(new Set());

  /* DELETE PRODUCT */
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this product permanently?")) return;

    try{
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } 
    catch{
      toast.error("Delete failed");
    }
  };

  /* QUICK STOCK UPDATE */
  const updateStock = async (id, qty) => {
    try{
      await api.patch(`/products/inventory/v2/${id}`, {
        quantity: qty,
        reason: qty > 0 ? "Quick add" : "Quick remove",
      });
      fetchProducts();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const getStatus = (p) => p.stockStatus || p.status;

  const statusColor = (status) => {
    switch (status) {
      case "IN_STOCK":
        return "bg-green-100 text-green-700";
      case "LOW_STOCK":
        return "bg-yellow-100 text-yellow-700";
      case "OUT_OF_STOCK":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* STOCK ALERTS */
  useEffect(() => {
    products.forEach((p) => {
      const status = getStatus(p);
      if(alertedRef.current.has(p._id)) return;

      if(status === "LOW_STOCK"){
        toast.warning(`⚠️ Low stock: ${p.name} (${p.quantity} left)`);
        alertedRef.current.add(p._id);
      }

      if(status === "OUT_OF_STOCK"){
        toast.error(`❌ Out of stock: ${p.name}`);
        alertedRef.current.add(p._id);
      }
    });
  }, [products]);

  /* RESET ALERTS WHEN RESTOCKED */
  useEffect(() => {
    products.forEach((p) => {
      if(getStatus(p) === "IN_STOCK") {
        alertedRef.current.delete(p._id);
      }
    });
  }, [products]);

  if(loading){
    return (
      <p className="text-center py-10 text-gray-500">
        Loading products...
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Products
        </h2>
        <button
          onClick={() => navigate("/inventory-logs")}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View Inventory Logs →
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-center">Name</th>
            <th className="p-4 text-center">SKU</th>
            <th className="p-4 text-center">Price</th>
            <th className="p-4 text-center">Quantity</th>
            <th className="p-4 text-center">Unit</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Category</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-10 text-gray-400">
                No products found
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr
                key={p._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 text-center font-medium">
                  {p.name}
                </td>

                <td className="p-4 text-center text-gray-500">
                  {p.sku}
                </td>

                <td className="p-4 text-center font-medium">
                  ₹{p.price}
                </td>

                {/* Quantity controls */}
                <td className="p-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateStock(p._id, -1)}
                      disabled={p.quantity === 0}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="font-semibold w-6 text-center">
                      {p.quantity}
                    </span>

                    <button
                      onClick={() => updateStock(p._id, 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td className="p-4 text-center">
                  per {p.unit}
                </td>

                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                      getStatus(p)
                    )}`}
                  >
                    {getStatus(p)?.replace("_", " ")}
                  </span>
                </td>

                <td className="p-4 text-center text-gray-600">
                  {p.category}
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setInventoryProduct(p)}
                      className="px-3 py-1 text-md rounded-md bg-blue-50 text-blue-600 hover:bg-blue-200"
                    >
                      Update Qty
                    </button>

                    <button
                      onClick={() => setEditProduct(p)}
                      className="px-3 py-1 text-md rounded-md bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 text-md rounded-md bg-red-50 text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {inventoryProduct && (
        <UpdateInventoryModal
          product={inventoryProduct}
          onClose={() => setInventoryProduct(null)}
          refresh={fetchProducts}
        />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          refresh={fetchProducts}
        />
      )}
    </div>
  );
}


