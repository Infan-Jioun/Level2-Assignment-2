import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";


const createVehicle = async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleService.createVehicle(req.body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: vehicle,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await vehicleService.getAllVehicles();
        res.json({
            success: true,
            message: vehicles.length ? "Vehicles retrieved successfully" : "No vehicles found",
            data: vehicles,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleService.getVehicleById(parseInt(req.params.vehicleId as string));
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }
        res.json({ success: true, message: "Vehicle retrieved successfully", data: vehicle });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleService.updateVehicle(parseInt(req.params.vehicleId as string), req.body);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }
        res.json({ success: true, message: "Vehicle updated successfully", data: vehicle });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const deleted = await vehicleService.deleteVehicle(parseInt(req.params.vehicleId as string));
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }
        res.json({ success: true, message: "Vehicle deleted successfully" });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
export const vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}