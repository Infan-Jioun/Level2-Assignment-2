import express from "express";
import { bookingController } from "./bookings.controller";
import { authenticate } from "../../middlewere/auth";
const router = express.Router();

router.post("/", authenticate, bookingController.createBooking);
router.get("/", authenticate, bookingController.getBookings);
router.put("/:bookingId", authenticate, bookingController.updateBooking);

export const bookingRoutes = router;