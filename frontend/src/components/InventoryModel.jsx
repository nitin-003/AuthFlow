import { useState } from "react";
import api from "../api/axios";

export default function InventoryModal({ product, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const submit = async () => {
    await api.patch(`/products/inventory/v2/${product._id}`, {
      quantity: Number(quantity),
      reason,
    });
    onSuccess();
    onClose();
  };

  if(!product) return null;

  return (
    <div style={{ border: "1px solid black", padding: 20 }}>
      <h3>Update Inventory: {product.name}</h3>

      <input
        type="number"
        placeholder="+ / - Quantity"
        onChange={(e) => setQuantity(e.target.value)}
      />

      <input
        placeholder="Reason"
        onChange={(e) => setReason(e.target.value)}
      />

      <button onClick={submit}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}



