const Category = require("../models/category");

/* Create Category */
exports.createCategory = async (req, res) => {
  try{
    const name = req.body.name?.trim();
    const description = req.body.description?.trim() || "";

    if(!name){
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if(exists){
      return res.status(400).json({ message: "Category already exists" });
    }

    const categoryData = {
      name: name.toLowerCase(),
      description,
    };

    if(req.file){
      categoryData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      message: "Category created successfully",
      categoryId: category._id,
    });
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ message: "Failed to create category" });
  }
};

/* Get All Categories  */
exports.getCategories = async (req, res) => {
  try{
    const categories = await Category.find()
      .select("-image.data")
      .sort({ createdAt: -1 });

    res.status(200).json(categories);
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* Get Category By Id */
exports.getCategoryById = async (req, res) => {
  try{
    const category = await Category.findById(req.params.id)
      .select("-image.data");

    if(!category){
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

/* Get Category Image */
exports.getCategoryImage = async (req, res) => {
  try{
    const category = await Category.findById(req.params.id);

    if(!category || !category.image?.data){
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", category.image.contentType);
    res.send(category.image.data);
  } 
  catch(err){
    console.error(err);
    res.status(500).send("Failed to load image");
  }
};

/* Update Category */
exports.updateCategory = async (req, res) => {
  try{
    const { id } = req.params;
    const updateData = {};

    if(req.body.name){
      const newName = req.body.name.trim().toLowerCase();

      const exists = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: `^${newName}$`, $options: "i" },
      });

      if(exists){
        return res.status(400).json({ message: "Category name already exists" });
      }

      updateData.name = newName;
    }

    if(req.body.description !== undefined){
      updateData.description = req.body.description.trim();
    }

    if(req.file){
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    if(!Object.keys(updateData).length){
      return res.status(400).json({ message: "Nothing to update" });
    }

    const category = await Category.findByIdAndUpdate(
      id, updateData, { new: true, runValidators: true }).select("-image.data");

    if(!category){
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ message: "Failed to update category" });
  }
};

/* Delete Category */
exports.deleteCategory = async (req, res) => {
  try{
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if(!category){
      return res.status(404).json({ message: "Category not found" });
    }

    // Image buffer is automatically deleted with document
    res.status(200).json({
      message: "Category and image permanently deleted",
    });
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ message: "Failed to delete category" });
  }
};



