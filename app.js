import express from "express";
import logger from "morgan";
import cors from "cors";

import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from "path";


import authRouter from "./routes/authRouter.js";
import commentsRouter from "./routes/commentsRouter.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use('/users', authRouter);
app.use("/api/comments", commentsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
