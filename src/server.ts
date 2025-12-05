import app from "./app";
import config from "./config";
import connectDB from "./config/db";
connectDB();

app.listen(config.port, () => {
    console.log(`Vehicle data server running port : ${config.port} `);
})