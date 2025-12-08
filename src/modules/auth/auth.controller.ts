import { Request, Response } from "express";
import { authService } from "./auth.service";

const signupController = async (req: Request, res: Response) => {
    try {

        const result = await authService.signupService(req.body)
        res.status(200).json({
            seucces: true,
            message: "User Successfully Created",
            data: result
        })
        console.log({ result });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
const signinController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(500).json({
            success: false,
            message: "Email and password required"
        })
    }
    try {
        const user = await authService.signinService(email, password);

        if (user === null) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user === false) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: user
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
export const authController = {
    signupController,
    signinController
} 