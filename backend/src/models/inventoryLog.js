const mongoose = require("mongoose");

const inventoryLogSchema = new mongoose.Schema(
  {
    // Reference to product (used for relation)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // Snapshot fields (DO NOT UPDATE LATER)
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    unit: {
      type: String,
      enum: ["pcs", "kg", "litre", "box"],
      required: true,
    },

    // Inventory movement direction
    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },

    // Always positive value
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Reason for audit trail
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Who performed the action
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("InventoryLog", inventoryLogSchema);


