const Product = require("../models/products");
const InventoryLog = require("../models/inventoryLog");
const updateStockStatus = require("../utils/updateStockStatus");

/* CREATE PRODUCT */
exports.createProduct = async (req, res) => {
  try{
    const { name, sku, price, quantity, unit, category, minStockLevel } = req.body;

    if(!name || !sku || price == null || quantity == null || !category){
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Product.findOne({ sku: sku.toUpperCase() });
    if(existing){
      return res.status(400).json({ message: "SKU already exists" });
    }

    const product = await Product.create({ name, sku: sku.toUpperCase(),
      price, quantity, unit, category, minStockLevel, createdBy: req.user.id });

    updateStockStatus(product);
    await product.save();

    if(quantity > 0){
      await InventoryLog.create({ product: product._id, productName: product.name,
        sku: product.sku, unit: product.unit, type: "IN", quantity,
        reason: "Initial stock", performedBy: req.user.id,
      });
    }

    res.status(201).json(product);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL PRODUCTS */
exports.getProducts = async (req, res) => {
  try{
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* GET PRODUCT BY ID */
exports.getProductById = async (req, res) => {
  try{
    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE PRODUCT (NO STOCK CHANGE) */
exports.updateProduct = async (req, res) => {
  try{
    const { sku } = req.body;

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

    // Block stock manipulation here
    delete req.body.quantity;
    delete req.body.status;

    const product = await Product.findByIdAndUpdate(
      req.params.id, req.body,
      { new: true, runValidators: true });

    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    updateStockStatus(product);
    await product.save();

    res.json(product);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* DELETE PRODUCT */
exports.deleteProduct = async (req, res) => {
  try{
    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    if(product.quantity > 0){
      await InventoryLog.create({ product: product._id,
        productName: product.name, sku: product.sku, unit: product.unit,
        type: "OUT", quantity: product.quantity, reason: "Product deleted", 
        performedBy: req.user.id,
      });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* INVENTORY UPDATE ONLY */
exports.updateInventory = async (req, res) => {
  try{
    const { quantity, reason } = req.body;

    if(typeof quantity !== "number" || quantity === 0){
      return res.status(400).json({ message: "Quantity must be non-zero" });
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

    await InventoryLog.create({ product: product._id,
      productName: product.name, sku: product.sku, unit: product.unit,
      type: quantity > 0 ? "IN" : "OUT", quantity: Math.abs(quantity), reason,
      performedBy: req.user.id,
    });

    res.json(product);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* GET INVENTORY LOGS */
exports.getInventoryLogs = async (req, res) => {
  try{
    const logs = await InventoryLog.find()
      .populate("product", "name sku unit")
      .populate("performedBy", "name")
      .sort({ createdAt: -1 });

    res.json(logs);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};


