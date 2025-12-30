const Product = require("../models/products");
const InventoryLog = require("../models/inventoryLog");
const updateStockStatus = require("../utils/updateStockStatus");

/* CREATE PRODUCT */
exports.createProduct = async (req, res) => {
  try{
    const { name, price, quantity, category } = req.body;

    const product = await Product.create({
      name,
      price,
      quantity,
      category,
      createdBy: req.user.id,
    });

    updateStockStatus(product);
    await product.save();

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

/* UPDATE PRODUCT */
exports.updateProduct = async (req, res) => {
  try{
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
    const product = await Product.findByIdAndDelete(req.params.id);

    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* BASIC INVENTORY UPDATE */
exports.updateInventory = async (req, res) => {
  try{
    const { quantity } = req.body;

    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    const newQty = product.quantity + quantity;
    if(newQty < 0){
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.quantity = newQty;
    updateStockStatus(product);
    await product.save();

    res.json(product);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* SAFE INVENTORY UPDATE WITH LOGGING */
exports.updateInventoryV2 = async (req, res) => {
  try{
    const { quantity, reason } = req.body;

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

    await InventoryLog.create({
      product: product._id,
      type: quantity > 0 ? "IN" : "OUT",
      quantity: Math.abs(quantity),
      reason,
      performedBy: req.user.id,
    });

    res.json(product);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};

/* GET INVENTORY HISTORY */
exports.getInventoryLogs = async (req, res) => {
  try{
    const logs = await InventoryLog.find()
      .populate("product", "name")
      .populate("performedBy", "name")
      .sort({ createdAt: -1 });

    res.json(logs);
  } 
  catch(err){
    res.status(500).json({ message: err.message });
  }
};



