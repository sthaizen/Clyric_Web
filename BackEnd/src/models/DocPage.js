import mongoose from "mongoose";

const docPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  status: { type: String, default: "draft", enum: ["draft", "published", "archived"] },
  shortDesc: { type: String },
  difficulty: { type: String },
  metaTitle: { type: String },
  metaDesc: { type: String },
  sortOrder: { type: Number, default: 0 },
  sections: { type: [mongoose.Schema.Types.Mixed], default: [] }
}, { timestamps: true });

export const DocPage = mongoose.models.DocPage || mongoose.model("DocPage", docPageSchema);
