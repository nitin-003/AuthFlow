const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, 
  updateInventory, getInventoryLogs } = require("../controllers/productController");

router.use(protect);

// INVENTORY ROUTES (static first)
router.get("/inventory-logs", getInventoryLogs);
router.patch("/inventory/v2/:id", updateInventory);

// PRODUCT ROUTES
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;


