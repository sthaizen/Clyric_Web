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
import { adminJwtAuth } from "../middleware/adminJwtAuth.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});


// Public routes
router.get("/categories", getCategories);
router.get("/pages", getPages);

// Admin routes (protected by custom JWT — no Clerk)
router.post("/categories", adminJwtAuth, upsertCategory);
router.delete("/categories/:id", adminJwtAuth, deleteCategory);

router.post("/pages", adminJwtAuth, upsertPage);
router.post("/pages/bulk-delete", adminJwtAuth, bulkDeletePages);
router.post("/pages/:id/duplicate", adminJwtAuth, duplicatePage);
router.delete("/pages/:id", adminJwtAuth, deletePage);

// Image uploading
router.post("/upload", adminJwtAuth, upload.single("image"), uploadDocImage);



export default router;
