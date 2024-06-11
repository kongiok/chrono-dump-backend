import express from "express";
import { env } from "process";
import { config } from "dotenv";
import { v1UsersRouter } from "./routes/v1/users.route.js";
import { v1AuthRouter } from "./routes/v1/auth.route.js";
import { v1TasksRouter } from "./routes/v1/tasks.route.js";
import cors from "cors";
import morgan from "morgan";
config();

const app = express();
const PORT = env.PORT || 3000;

app.use(cors());
app.use(morgan());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', v1UsersRouter);
app.use('/api/v1/tasks', v1TasksRouter);
app.use('/api/v1/auth', v1AuthRouter);

export { app, PORT };
