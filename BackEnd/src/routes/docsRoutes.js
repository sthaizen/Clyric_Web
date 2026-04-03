import express from "express";
import {
  getCategories,
  upsertCategory,
  deleteCategory,
  getPages,
  upsertPage,
  deletePage,
  bulkDeletePages,
  duplicatePage,
  uploadDocImage
} from "../controllers/docsController.js";
import { adminRoute } from "../middleware/adminMiddleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});


// Public routes
router.get("/categories", getCategories);
router.get("/pages", getPages);

// Admin routes
router.post("/categories", adminRoute, upsertCategory);
router.delete("/categories/:id", adminRoute, deleteCategory);

router.post("/pages", adminRoute, upsertPage);
router.post("/pages/bulk-delete", adminRoute, bulkDeletePages);
router.post("/pages/:id/duplicate", adminRoute, duplicatePage);
router.delete("/pages/:id", adminRoute, deletePage);

// Image uploading
router.post("/upload", adminRoute, upload.single("image"), uploadDocImage);



export default router;
