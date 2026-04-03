import mongoose from "mongoose";

const docCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sortOrder: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  color: { type: String, default: "#1a1a2e" }
}, { timestamps: true });

export const DocCategory = mongoose.models.DocCategory || mongoose.model("DocCategory", docCategorySchema);
