const Product = require("../models/products");
const InventoryLog = require("../models/inventoryLog");
const updateStockStatus = require("../utils/updateStockStatus");

/* Create Product */
exports.createProduct = async (req, res) => {
  try{
    const { name, sku, price, quantity = 0, unit, category, minStockLevel } = req.body;

    // Validate required fields
    if(!name || !sku || price == null || !category || minStockLevel == null){
      return res.status(400).json({ message: "Missing required fields" });
    }

    // SKU uniqueness
    const existing = await Product.findOne({ sku: sku.toUpperCase() });
    if(existing){
      return res.status(400).json({ message: "SKU already exists" });
    }

    const product = new Product({ name, sku: sku.toUpperCase(), price, quantity, unit, category,
      minStockLevel, createdBy: req.user.id });

    // Store Image as file 
    if(req.file){
      product.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    updateStockStatus(product);
    await product.save();

    // Initial inventory log
    if(quantity > 0){
      await InventoryLog.create({ product: product._id, productName: product.name, sku: product.sku, unit: product.unit,
        type: "IN", quantity, reason: "Initial stock", performedBy: req.user.id,
      });
    }

    res.status(201).json(formatProduct(product));
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* Get All Products */
exports.getProducts = async (req, res) => {
  try{
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products.map(formatProduct));
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* Get Product By ID  */
exports.getProductById = async (req, res) => {
  try{
    const product = await Product.findById(req.params.id);

    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(formatProduct(product));
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* Update Product */
exports.updateProduct = async (req, res) => {
  try{
    const { sku } = req.body;

    // Block Inventory-related Updates
    ["quantity", "status"].forEach((f) => delete req.body[f]);

    if(sku){
      const skuExists = await Product.findOne({
        sku: sku.toUpperCase(),
        _id: { $ne: req.params.id },
      });

      if(skuExists){
        return res.status(400).json({ message: "SKU already exists" });
      }

      req.body.sku = sku.toUpperCase();
    }

    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    Object.assign(product, req.body);

    // Update Image File
    if(req.file){
      product.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    updateStockStatus(product);
    await product.save();

    res.json(formatProduct(product));
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* Delete Product */
exports.deleteProduct = async (req, res) => {
  try{
    const product = await Product.findById(req.params.id);

    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    // Log remaining stock as OUT
    if(product.quantity > 0){
      await InventoryLog.create({ product: product._id, productName: product.name,
        sku: product.sku, unit: product.unit, type: "OUT", quantity: product.quantity,
        reason: "Product deleted", performedBy: req.user.id,
      });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* Inventory Update Only */
exports.updateInventory = async (req, res) => {
  try{
    const { quantity, reason } = req.body;

    if(typeof quantity !== "number" || quantity === 0){
      return res.status(400).json({ message: "Quantity must be non-zero number" });
    }

    if(!reason){
      return res.status(400).json({ message: "Reason is required" });
    }

    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    const newQuantity = product.quantity + quantity;
    if(newQuantity < 0){
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.quantity = newQuantity;
    updateStockStatus(product);
    await product.save();

    await InventoryLog.create({ product: product._id, productName: product.name,
      sku: product.sku, unit: product.unit, type: quantity > 0 ? "IN" : "OUT",
      quantity: Math.abs(quantity), reason, performedBy: req.user.id,
    });

    res.json(formatProduct(product));
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* Inventory Logs */
exports.getInventoryLogs = async (req, res) => {
  try{
    const logs = await InventoryLog.find().populate("product", "name sku unit")
      .populate("performedBy", "name").sort({ createdAt: -1 });

    res.json(logs);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* Convert image buffer to base64 for frontend */
function formatProduct(product){
  const obj = product.toObject();

  if(obj.image?.data){
    obj.image = `data:${obj.image.contentType};base64,${obj.image.data.toString(
      "base64"
    )}`;
  } 
  else{
    obj.image = null;
  }

  return obj;
}


