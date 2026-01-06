const express = require("express");
const { createSubCategory, getSubCategories, getSubCategoryImage, 
    updateSubCategory, deleteSubCategory } = require("../controllers/subCategory.Controller");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", upload.single("image"), createSubCategory);
router.get("/", getSubCategories);
router.get("/image/:id", getSubCategoryImage);
router.patch("/:id", upload.single("image"), updateSubCategory);
router.delete("/:id", deleteSubCategory);

module.exports = router;

