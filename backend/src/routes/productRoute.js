const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateInventory,
  updateInventoryV2,
  getInventoryLogs,
} = require("../controllers/productController");

router.use(protect);

// INVENTORY ROUTES
router.get("/inventory-logs", getInventoryLogs);
router.patch("/inventory/v2/:id", updateInventoryV2);
router.patch("/:id/inventory", updateInventory);

// PRODUCT ROUTES
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;


