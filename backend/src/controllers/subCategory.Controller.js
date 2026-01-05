const SubCategory = require("../models/subcategory");
const Category = require("../models/category");

/* Create Subcategory  */
exports.createSubCategory = async (req, res) => {
  try{
    const { name, description, category } = req.body;

    if(!name || !category){
      return res.status(400).json({ message: "Subcategory name and category are required" });
    }

    // Check parent category exists & active
    const parentCategory = await Category.findOne({ _id: category, isActive: true });

    if(!parentCategory){
      return res.status(404).json({ message: "Parent category not found" });
    }

    const subCategory = await SubCategory.create({ name,
      description, category, image: req.file?.path || null,
    });

    res.status(201).json(subCategory);
  } 
  catch(err){
    // Duplicate subcategory under same category
    if(err.code === 11000){
      return res.status(400).json({ message: "Subcategory already exists in this category" });
    }

    res.status(500).json({ message: "Failed to create subcategory" });
  }
};

/* Get Subcategories */
exports.getSubCategories = async (req, res) => {
  try{
    const { categoryId } = req.query;

    const filter = { isActive: true,
      ...(categoryId && { category: categoryId }),
    };

    const subCategories = await SubCategory.find(filter)
      .populate("category", "name").sort({ createdAt: -1 });

    res.status(200).json(subCategories);
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
};

/* UPDATE SUBCATEGORY */
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({
        message: "Subcategory not found",
      });
    }

    res.status(200).json(updatedSubCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update subcategory",
    });
  }
};

/* ================= DELETE SUBCATEGORY (SOFT DELETE) ================= */
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedSubCategory) {
      return res.status(404).json({
        message: "Subcategory not found",
      });
    }

    res.status(200).json({
      message: "Subcategory deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete subcategory",
    });
  }
};

