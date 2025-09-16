import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", toNodeHandler(auth));

app.use(express.json());

const port = 8000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
