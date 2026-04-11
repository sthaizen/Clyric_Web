import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { updateProfile } from "../controllers/userController.js";

const router = Router();

router.patch("/profile", protectRoute, updateProfile);

export default router;
