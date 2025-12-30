import api from "./axios";

/* Safe Inventory Update */
export const updateInventoryV2 = (productId, data) => {
  return api.post(`/products/${productId}/inventory-v2`, data);
};

/* Get Inventory Logs */
export const getInventoryLogs = () => {
  return api.get("/inventory/logs");
};



