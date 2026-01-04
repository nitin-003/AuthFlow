const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, updateInventory, getInventoryLogs } = require("../controllers/productController");

/* Inventory */
router.get("/inventory-logs", protect, getInventoryLogs);
router.patch("/inventory/v2/:id", protect, updateInventory);

/* Product */
router.post("/", protect, upload.single("image"), createProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);
router.put("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;



