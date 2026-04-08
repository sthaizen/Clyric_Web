import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { updateProfile } from "../controllers/userController.js";

const router = Router();

router.patch("/profile", requireAuth(), updateProfile);

export default router;
