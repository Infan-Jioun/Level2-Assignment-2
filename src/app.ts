import express, { Request, Response } from "express";
const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Vehicle  data server running ")
})
export default app;