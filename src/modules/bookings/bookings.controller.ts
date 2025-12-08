import { Request, Response } from "express";
import { bookingService } from "./bookings.service";


const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = await bookingService.createBooking(req.body, req.user!);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getBookings(req.user!);
        res.json({
            success: true,
            message: req.user!.role === "admin" ? "Bookings retrieved successfully" : "Your bookings retrieved successfully",
            data: bookings,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const updateBooking = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        if (!["cancelled", "returned"].includes(status))
            return res.status(400).json({ success: false, message: "Invalid status" });

        const booking = await bookingService.updateBooking(parseInt(req.params.bookingId as string), status, req.user!);

        const message =
            status === "cancelled" ? "Booking cancelled successfully" : "Booking marked as returned. Vehicle is now available";

        res.json({ success: true, message, data: booking });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
export const bookingController = {
    createBooking,
    getBookings,
    updateBooking
};  
