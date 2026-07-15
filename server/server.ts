import express, { Request, Response } from "express";
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors'
import 'dotenv/config'

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())



app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});