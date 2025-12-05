import { Pool } from "pg"
import config from "."
export const pool = new Pool({
    connectionString: `${config.connection_str}`

})
const connectDB = async () => {
    try {
        // users
        await pool.query(
            `
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
        created_at TIMESTAMP DEFAULT NOW()
         
        )
        `
        )
        // vehicle
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            registration_number TEXT NOT NULL UNIQUE,
            daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
            availability_status TEXT NOT NULL CHECK (availability_status IN ('available', 'booked')),
            created_at TIMESTAMP DEFAULT NOW()
            )
            `
        )

        // bookings
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES users(id) on DELETE RESTRICT,
            vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) on DELETE RESTRICT,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
            status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT NOW(),
            CHECK (rent_end_date > rent_start_date)
            ) 
            `
        )
    }
    catch (err: any) {
        console.error("connection err", err)
    }
}
export default connectDB; 