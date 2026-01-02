import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function InventoryModal({ product, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if(!quantity || Number(quantity) === 0){
      toast.error("Quantity cannot be zero");
      return;
    }

    try{
      setLoading(true);

      await api.patch(`/products/inventory/v2/${product._id}`, {
        quantity: Number(quantity), 
        reason: reason.trim(),
      });

      toast.success("Inventory updated successfully");
      onSuccess();
      onClose();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Inventory update failed");
    } 
    finally{
      setLoading(false);
    }
  };

  if(!product) return null;

  return (
    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Update Inventory
      </h3>

      <p className="text-sm text-gray-500 mb-5">
        <span className="font-medium">{product.name}</span> ({product.sku || "No SKU"})
      </p>

      <div className="space-y-4">
        {/* QUANTITY */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Quantity Change
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="+ / - quantity"
            className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Use positive for stock in, negative for stock out
          </p>
        </div>

        {/* REASON */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Reason (optional)
          </label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. New stock arrival / Damaged items"
            className="w-full border rounded-lg px-4 py-2.5
              focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white
            hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

