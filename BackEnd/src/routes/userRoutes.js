import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = Router();

router.get("/profile", protectRoute, getProfile);
router.patch("/profile", protectRoute, updateProfile);

export default router;
