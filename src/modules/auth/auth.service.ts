import { pool } from "../../config/db";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../../config";
interface UserPayload {
    name: string,
    email: string,
    password: string,
    phone: string,
    role: "admin" | "customer"

}
const signupService = async (payload: UserPayload) => {
    const { name, email, password, phone, role = "customer" } = payload;
    const checkEmail = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email.toLowerCase()]
    );

    if (checkEmail.rows.length > 0) {
        throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, password, phone, role`,
        [name, email.toLowerCase(), hashedPassword, phone, role]
    );
    return result.rows[0];
};
const signinService = async (email: string, password: string) => {
    const result = await pool.query(
        `
            SELECT * FROM users WHERE email=$1
            `, [email],
    )
    if (result.rows.length === 0) {
        return null;
    }

    console.log({ result });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return false
    }

    const token = jwt.sign(
        { id: user.id, role: user.role }, config.jwt_secret as string, { expiresIn: "7d" }
    );
    const { password: _, ...userWithoutPassword } = user;
    return {
        token, user: userWithoutPassword
    }
}
export const authService = {
    signupService,
    signinService
}