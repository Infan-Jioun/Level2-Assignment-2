import express, { Request, Response } from "express";
const app = express();
app.use(express.json())
app.get("/", (req: Request, res: Response) => {
    res.send("Vehicle  data server running now")
})
export default app;