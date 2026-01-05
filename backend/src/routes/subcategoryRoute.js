const express = require("express");
const { createSubCategory, getSubCategories, updateSubCategory, deleteSubCategory } = require("../controllers/subCategory.Controller");
const router = express.Router();

router.post("/", createSubCategory);
router.get("/", getSubCategories);
router.patch("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

module.exports = router;

