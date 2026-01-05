const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate subcategory names under same category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("SubCategory", subCategorySchema);

