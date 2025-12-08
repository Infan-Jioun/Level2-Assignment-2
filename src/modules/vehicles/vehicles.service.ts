import { pool } from "../../config/db";


const createVehicle = async (payload: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status = "available" } = payload;
    if (!vehicle_name || !type || !registration_number || daily_rent_price <= 0) {
        throw new Error("Invalid input for vehicle");
    }

    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );
    return result.rows[0];


}
const getAllVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles ORDER BY id`);
    return result.rows;
}


const getVehicleById = async (id: number) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
    return result.rows[0] || null;
}


const updateVehicle = async (id: number, payload: any) => {
    const fields = Object.keys(payload).map((key, i) => `${key} = $${i + 2}`).join(", ");
    const values = Object.values(payload);

    if (fields.length === 0) {
        throw new Error("No fields to update");
    }

    const result = await pool.query(
        `UPDATE vehicles SET ${fields} WHERE id = $1 RETURNING *`,
        [id, ...values]
    );
    return result.rows[0] || null;
}


const deleteVehicle = async (id: number) => {
    // Check active bookings (API spec: only if no active bookings)
    const check = await pool.query(
        `SELECT id FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
        [id]
    );
    if (check.rows.length > 0) {
        throw new Error("Cannot delete vehicle with active bookings");
    }

    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
}
export const vehicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}