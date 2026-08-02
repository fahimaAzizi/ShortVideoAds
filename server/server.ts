import "./configs/instrument.mjs"
import express, { Request, Response } from "express";
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors'
import 'dotenv/config'
import clerkWebhooks from "./controllers/clerk";
import userRouter from "./routes/userroutes";
import projectRouter from "./routes/projectRoutes";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors())

app.post('/api/clerk',express.raw({type: 'application/json'}), clerkWebhooks)

app.use(express.json())
app.use(clerkMiddleware())

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");

});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});