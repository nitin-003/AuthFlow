const express = require("express");
const { createCategory, getCategories, getCategoryById, getCategoryImage,
  updateCategory, deleteCategory } = require("../controllers/categoryController");

const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Create category (with image upload)
router.post("/", upload.single("image"), createCategory);

// Get all categories (no image buffer)
router.get("/", getCategories);

// Get single category by ID
router.get("/:id", getCategoryById);

// Get category image (buffer → image)
router.get("/image/:id", getCategoryImage);

// Update category (partial update + image replace)
router.patch("/:id", upload.single("image"), updateCategory);

// Soft delete category
router.delete("/:id", deleteCategory);

module.exports = router;


