import { useState } from "react";
import { createPortal } from "react-dom";
import { updateInventoryV2 } from "../api/inventory";
import { toast } from "react-toastify";

export default function UpdateInventoryModal({ product, onClose, refresh }) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleSubmit = async () => {
    if (!quantity || !reason) {
      return toast.error("Quantity and reason are required");
    }

    try {
      setLoading(true);
      await updateInventoryV2(product._id, {
        quantity: Number(quantity),
        reason,
      });

      toast.success("Inventory updated successfully");
      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">
          
          {/* Header */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Update Inventory
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {product.name}
          </p>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Change
            </label>
            <input type="number" placeholder="+5 or -3" value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg
              focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Use positive for stock in, negative for stock out
            </p>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              placeholder="Sale, purchase, damage, adjustment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg
              focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm
              text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-5 py-2 rounded-lg text-sm font-medium text-white
              transition ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Updating..." : "Update Inventory"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

