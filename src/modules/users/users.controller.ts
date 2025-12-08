import { Request, Response } from "express";
import { userService } from "./users.service";

export const userController = {
    getAllUsers: async (req: Request, res: Response) => {
        const users = await userService.getAllUsers();
        res.json({
            success: true,
            message: "Users fetch successfully",
            data: users
        });
    },

    updateUser: async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.userId as string);
            const updated = await userService.updateUser(userId, req.body, req.user!);
            if (!updated) return res.status(404).json({ success: false, message: "User not found" });

            res.json({ success: true, message: "User updated successfully", data: updated });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try {
            await userService.deleteUser(parseInt(req.params.userId as string));
            res.json({ success: true, message: "User deleted successfully" });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            })

        }
    },
};