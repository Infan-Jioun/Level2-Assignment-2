import express from "express";
import { authController } from "./auth.controller";
import logger from "../../middlewere/logger";

const router = express.Router();
router.post("/signup", logger, authController.signupController)
router.post("/signin", logger, authController.signinController)
export const authRoutes = router;