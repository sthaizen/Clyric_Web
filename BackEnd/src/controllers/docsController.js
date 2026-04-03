import { DocCategory } from "../models/DocCategory.js";
import { DocPage } from "../models/DocPage.js";

// -- Categories --

export const getCategories = async (req, res) => {
  try {
    const categories = await DocCategory.find().sort({ sortOrder: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
};

export const upsertCategory = async (req, res) => {
  try {
    const { slug } = req.body;
    if (!slug) return res.status(400).json({ error: "Slug is required" });

    // Use findOneAndUpdate to upsert based on slug
    const updatedCategory = await DocCategory.findOneAndUpdate(
      { slug },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error upserting category:", error);
    res.status(500).json({ error: "Failed to upsert category", details: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // this can be Mongo ID or string, let's assume Mongo ID or slug depending on route
    const deleted = await DocCategory.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.status(200).json({ message: "Category deleted", id });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category", details: error.message });
  }
};

// -- Pages --

export const getPages = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      // Case-insensitive status filter — handles "Published", "published", etc.
      query.status = { $regex: new RegExp(`^${req.query.status}$`, "i") };
    }

    const pages = await DocPage.find(query).sort({ sortOrder: 1 });
    res.status(200).json(pages || []);
  } catch (error) {
    console.error("CRITICAL ERROR IN GET_PAGES:", error);
    res.status(500).json({ 
      error: "Failed to fetch pages", 
      details: error.message,
    });
  }
};


export const upsertPage = async (req, res) => {
  try {
    const { slug } = req.body;
    if (!slug) return res.status(400).json({ error: "Slug is required" });

    // Normalize status to lowercase so it always matches the enum
    const data = { ...req.body };
    if (data.status) data.status = data.status.toLowerCase();

    const updatedPage = await DocPage.findOneAndUpdate(
      { slug },
      data,
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(updatedPage);
  } catch (error) {
    console.error("Error upserting page:", error);
    res.status(500).json({ error: "Failed to upsert page", details: error.message });
  }
};


export const deletePage = async (req, res) => {
  try {
    const { id } = req.params; // This can be slug or Object ID
    const deleted = await DocPage.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
    if (!deleted) return res.status(404).json({ error: "Page not found" });
    res.status(200).json({ message: "Page deleted", id });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ error: "Failed to delete page", details: error.message });
  }
};

export const bulkDeletePages = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: "IDs array is required" });

    const result = await DocPage.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Bulk delete successful", count: result.deletedCount });
  } catch (error) {
    console.error("Error bulk deleting pages:", error);
    res.status(500).json({ error: "Failed to bulk delete pages", details: error.message });
  }
};

export const duplicatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const source = await DocPage.findOne({ $or: [{ _id: id }, { slug: id }] });
    if (!source) return res.status(404).json({ error: "Source page not found" });

    // Sanitize source data
    const sourceObj = source.toObject();
    delete sourceObj._id;
    delete sourceObj.createdAt;
    delete sourceObj.updatedAt;

    // Generate unique slug and title
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4);
    sourceObj.title = `${sourceObj.title} (Copy)`;
    sourceObj.slug = `${sourceObj.slug}-copy-${timestamp}`;
    sourceObj.status = "draft"; // duplicated pages start as draft

    const duplicate = new DocPage(sourceObj);
    await duplicate.save();

    res.status(201).json(duplicate);
  } catch (error) {
    console.error("Error duplicating page:", error);
    res.status(500).json({ error: "Failed to duplicate page", details: error.message });
  }
};

import { uploadToCloudinary } from "../config/cloudinary.js";

export const uploadDocImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Upload to cloudinary
    const result = await uploadToCloudinary(req.file.buffer, "clyric_docs_images");

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ error: "Failed to upload image", details: error.message });
  }
};


