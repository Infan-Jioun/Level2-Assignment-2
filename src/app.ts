import express, { Request, Response } from "express";
import path from "path"
import { authRoutes } from "./modules/auth/auth.routes";
import connectDB from "./config/db";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { userRoutes } from "./modules/users/users.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";
const app = express();
app.use(express.json())
connectDB();
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.get("/", (req: Request, res: Response) => {
    res.send("Vehicle  data server running now")
})
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
})
export default app;