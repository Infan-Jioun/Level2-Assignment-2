import { pool } from "../../config/db";


const createBooking = async (payload: any, user: any) => {
    let { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    if (user.role === "customer") {
        customer_id = user.id;
    }

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    if (end <= start) throw new Error("End date must be after start date");

    const vehicleRes = await pool.query(
        `SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'`,
        [vehicle_id]
    );
    if (vehicleRes.rows.length === 0) {
        throw new Error("Vehicle not available");
    }

    const vehicle = vehicleRes.rows[0];
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const total_price = vehicle.daily_rent_price * days;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const bookingRes = await client.query(
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
         VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
        );

        await client.query(
            `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
            [vehicle_id]
        );

        await client.query("COMMIT");

        return {
            ...bookingRes.rows[0],
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: vehicle.daily_rent_price,
            },
        };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}


const getBookings = async (user: any) => {
    let query, values: any[] = [];

    if (user.role === "admin") {
        query = `
        SELECT b.*, u.name AS customer_name, u.email, v.vehicle_name, v.registration_number
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
        ORDER BY b.id
      `;
    } else {
        query = `
        SELECT b.*, v.vehicle_name, v.registration_number, v.type
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        ORDER BY b.id
      `;
        values = [user.id];
    }

    const result = await pool.query(query, values);

    if (user.role === "admin") {
        return result.rows.map((r: any) => ({
            ...r,
            customer: { name: r.customer_name, email: r.email },
            vehicle: { vehicle_name: r.vehicle_name, registration_number: r.registration_number },
        }));
    }
    return result.rows;
}


const updateBooking = async (bookingId: number, status: string, user: any) => {
    const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (bookingRes.rows.length === 0) throw new Error("Booking not found");
    const booking = bookingRes.rows[0];


    if (status === "cancelled") {
        if (user.role !== "admin" && booking.customer_id !== user.id) {
            throw new Error("You can only cancel your own booking");
        }

    }

    if (status === "returned" && user.role !== "admin") {
        throw new Error("Only admin can mark as returned");
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const updatedRes = await client.query(
            `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
            [status, bookingId]
        );

        if (["cancelled", "returned"].includes(status)) {
            await client.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
                [booking.vehicle_id]
            );
        }

        await client.query("COMMIT");

        const updated = updatedRes.rows[0];
        if (status === "returned") {
            return { ...updated, vehicle: { availability_status: "available" } };
        }
        return updated;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}
export const bookingService = {
    createBooking,
    getBookings,
    updateBooking
}               