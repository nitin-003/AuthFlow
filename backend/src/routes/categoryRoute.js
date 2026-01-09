const express = require("express");
const { createCategory, getCategories, getCategoryById, 
  getCategoryImage, updateCategory, deleteCategory } = require("../controllers/categoryController");

const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/image/:id", getCategoryImage);
router.get("/:id", getCategoryById);
router.patch("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;

