import { useState } from "react";
import { updateInventoryV2 } from "../api/inventory";
import { toast } from "react-toastify";

export default function UpdateInventoryModal({ product, onClose, refresh }) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="modal">
      <h3>Update Inventory - {product.name}</h3>

      <input
        type="number"
        placeholder="+5 or -3"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <input
        type="text"
        placeholder="Reason (sale, purchase, damage...)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Updating..." : "Update"}
      </button>

      <button onClick={onClose}>Cancel</button>
    </div>
  );
}


