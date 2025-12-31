import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import UpdateInventoryModal from "./UpdateInventoryModel";
import EditProductModal from "./EditProductModel";

export default function ProductTable({ products, fetchProducts, loading }) {
  const navigate = useNavigate();

  const [inventoryProduct, setInventoryProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

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

  /* QUICK STOCK UPDATE (+ / -) */
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
    switch(status){
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

  if(loading){
    return (
      <p className="text-center py-10 text-gray-500">
        Loading products...
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-x-auto">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="font-semibold text-gray-700">Products</h2>

        <button
          onClick={() => navigate("/inventory-logs")}
          className="text-sm text-blue-600 hover:underline"
        >
          View Inventory Logs →
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-center">Name</th>
            <th className="p-4 text-center">SKU</th>
            <th className="p-4 text-center">Price</th>
            <th className="p-4 text-center">Qty</th>
            <th className="p-4 text-center">Unit</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Category</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-8 text-gray-400">
                No products found
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">

                {/* Name */}
                <td className="p-4 text-center font-medium">
                  {p.name}
                </td>

                {/* SKU */}
                <td className="p-4 text-center text-gray-600">
                  {p.sku || "-"}
                </td>

                {/* Price */}
                <td className="p-4 text-center">
                  ₹{p.price}
                </td>

                {/* Quantity */}
                <td className="p-4 text-center font-semibold">
                  {p.quantity}
                </td>

                {/* Unit */}
                <td className="p-4 text-center text-gray-600">
                  per {p.unit || "-"}
                </td>

                {/* Status */}
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                      getStatus(p)
                    )}`}
                  >
                    {getStatus(p)?.replace("_", " ")}
                  </span>
                </td>

                {/* Category */}
                <td className="p-4 text-center">
                  {p.category}
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex justify-center gap-2 items-center">

                    {/* Quick +/- */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
                      <button
                        disabled={p.quantity === 0}
                        onClick={() => updateStock(p._id, -1)}
                        className="h-6 w-6 text-sm rounded bg-gray-600 text-white disabled:bg-gray-300"
                      >
                        −
                      </button>

                      <button
                        onClick={() => updateStock(p._id, 1)}
                        className="h-6 w-6 text-sm rounded bg-green-600 text-white"
                      >
                        +
                      </button>
                    </div>

                    {/* Update Stock */}
                    <button
                      onClick={() => setInventoryProduct(p)}
                      className="h-9 px-4 rounded-md text-sm font-medium
                      bg-indigo-500 text-white hover:bg-indigo-700"
                    >
                      Update Stock
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditProduct(p)}
                      className="h-9 px-3 rounded-md text-sm
                      bg-blue-50 text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="h-9 px-3 rounded-md text-sm
                      text-red-600 hover:bg-red-200"
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

      {/* Update Inventory Modal */}
      {inventoryProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <UpdateInventoryModal
            product={inventoryProduct}
            onClose={() => setInventoryProduct(null)}
            refresh={fetchProducts}
          />
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <EditProductModal
            product={editProduct}
            onClose={() => setEditProduct(null)}
            refresh={fetchProducts}
          />
        </div>
      )}
    </div>
  );
}

