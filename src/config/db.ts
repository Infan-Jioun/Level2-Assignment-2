import { Pool } from "pg"
import config from "."
export const pool = new Pool({
    connectionString: `${config.connection_str}`

})
const connectDB = async () => {
    // users
    await pool.query(
        ``
    )
    // vehicle
    await pool.query(
        ``
    )
    // bookings
    await pool.query(
        ``
    )
}
export default connectDB; 