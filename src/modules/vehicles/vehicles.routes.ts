import express from "express";
import { vehicleController } from "./vehicles.controller";
import { authenticate, isAdmin } from "../../middlewere/auth";

const router = express.Router();

// Public routes
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getVehicleById);

// Admin only routes
router.post("/", authenticate, isAdmin, vehicleController.createVehicle);
router.put("/:vehicleId", authenticate, isAdmin, vehicleController.updateVehicle);
router.delete("/:vehicleId", authenticate, isAdmin, vehicleController.deleteVehicle);

export const vehiclesRoutes = router;