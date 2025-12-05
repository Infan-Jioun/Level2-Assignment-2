import app from "./app";
import config from "./config";
import connectDB from "./config/db";
connectDB();
// app.use("/api/v1/auth/signup");
// app.use("/api/v1/auth/signin");
// app.use("/api/v1/auth/users");
// app.use("/api/v1/bookings");

app.listen(config.port, () => {
    console.log(`Vehicle data server running port : ${config.port} `);
})