import express, { NextFunction, Request, Response } from "express";
import { userController } from "./users.controller";
import { authenticate, isAdmin } from "../../middlewere/auth";

const router = express.Router();


router.get("/", authenticate, isAdmin, userController.getAllUsers);
router.put("/:userId", authenticate, (req: Request, res: Response, next: NextFunction) => {
    const targetId = parseInt(req.params.userId as string);
    if (req.user!.role === "admin" || req.user!.id === targetId) {
        next();
    } else {
        return res.status(500).json({
            success: false,
            message: "Forbidden: You can only update your own profile",
        });
    }
},
    userController.updateUser
);
router.delete("/:userId", authenticate, isAdmin, userController.deleteUser);

export const userRoutes = router;  