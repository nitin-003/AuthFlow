import api from "./axios";

/* Safe Inventory Update */
export const updateInventoryV2 = (productId, data) => {
  return api.patch(`/products/inventory/v2/${productId}`, data);
};

/* Get Inventory Logs */
export const getInventoryLogs = () => {
  return api.get("/products/inventory-logs");
};



