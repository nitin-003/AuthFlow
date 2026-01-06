const SubCategory = require("../models/subcategory");
const Category = require("../models/category");

/* Create SubCategory  */
exports.createSubCategory = async (req, res) => {
  try{
    const { name, description = "", category } = req.body;

    if(!name || !category){
      return res.status(400).json({
        message: "Subcategory name and category are required",
      });
    }

    // Check parent category exists & is active
    const parentCategory = await Category.findOne({ _id: category });

    if(!parentCategory){
      return res.status(404).json({
        message: "Parent category not found",
      });
    }

    const subCategoryData = {
      name: name.trim(),
      description: description.trim(),
      category,
    };

    if(req.file){
      subCategoryData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const subCategory = await SubCategory.create(subCategoryData);

    res.status(201).json(subCategory);
  } 
  catch(err){
    // Duplicate subcategory under same category
    if(err.code === 11000){
      return res.status(400).json({
        message: "Subcategory already exists in this category",
      });
    }

    res.status(500).json({ message: "Failed to create subcategory" });
  }
};

/* Get SubCategories */
exports.getSubCategories = async (req, res) => {
  try{
    const { categoryId } = req.query;

    const filter = {
      ...(categoryId && { category: categoryId }),
    };

    const subCategories = await SubCategory.find(filter)
      .select("-image.data").populate("category", "name").sort({ createdAt: -1 });

    res.status(200).json(subCategories);
  } 
  catch(err){
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
};

/* Get SubCategory Image */
exports.getSubCategoryImage = async (req, res) => {
  try{
    const subCategory = await SubCategory.findById(req.params.id);

    if(!subCategory || !subCategory.image?.data){
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", subCategory.image.contentType);
    res.send(subCategory.image.data);
  } 
  catch(err){
    res.status(500).send("Failed to load image");
  }
};

/* Update SubCategory */
exports.updateSubCategory = async (req, res) => {
  try{
    const { id } = req.params;
    const updateData = {};

    if(req.body.name){
      updateData.name = req.body.name.trim();
    }

    if(req.body.description !== undefined){
      updateData.description = req.body.description.trim();
    }

    if(req.file){
      updateData.image = { data: req.file.buffer, contentType: req.file.mimetype };
    }

    if(!Object.keys(updateData).length){
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate( id, updateData,
      { new: true, runValidators: true }
    ).select("-image.data");

    if(!updatedSubCategory){
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(updatedSubCategory);
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ message: "Failed to update subcategory" });
  }
};

/* Delete SubCategory */
exports.deleteSubCategory = async (req, res) => {
  try{
    const { id } = req.params;

    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if(!deletedSubCategory){
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json({ message: "Subcategory deleted permanently" });
  } 
  catch(err){
    res.status(500).json({ message: "Failed to delete subcategory" });
  }
};

