import express from "express";
import { env } from "process";
import { config } from "dotenv";
import { v1UsersRouter } from "./routes/v1/users/users.js";
import { v1AuthRouter } from "./routes/v1/auth/auth.js";
import { v1TasksRouter } from "./routes/v1/tasks/tasks.js";
config();

const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', v1UsersRouter);
app.use('/api/v1/tasks', v1TasksRouter);
app.use('/api/v1/auth', v1AuthRouter);

export { app, PORT };
