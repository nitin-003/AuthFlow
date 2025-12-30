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
} = require("../controllers/productController");

router.use(protect);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/inventory", updateInventory);

module.exports = router;



