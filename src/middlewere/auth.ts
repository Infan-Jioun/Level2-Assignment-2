import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";


type MyJwtPayload = {
    id: number;
    role: "admin" | "customer";
    iat?: number;
    exp?: number;
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log("Headers:", req.headers);             
    console.log("authorization header:", req.headers.authorization);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
    }

    const token = authHeader.split(" ")[1];

    const secret = config.jwt_secret;
    if (!secret) {
        console.error("JWT_SECRET is not set in environment");
        return res.status(500).json({
            success: false,
            message: "Server error: JWT secret not configured",
        });
    }

    try {
        const verified = jwt.verify(token as string, secret) as unknown;
        if (typeof verified === "object" && verified !== null && "id" in verified && "role" in verified) {
            const payload = verified as MyJwtPayload;
            const idNum = typeof payload.id === "number" ? payload.id : parseInt(String(payload.id), 10);

            if (!idNum || (payload.role !== "admin" && payload.role !== "customer")) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Invalid token payload",
                });
            }

            req.user = { id: idNum, role: payload.role };
            return next();
        } else {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token payload",
            });
        }
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token",
        });
    }
};

// ২. শুধু Admin হলে পাস করবে
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Admin access required",
        });
    }

    next();
};



export { };
