import express from "express";
import { env } from "process";
import { config } from "dotenv";
config();

const app = express();
const PORT = env.PROGRAM_PORT;

app.get("/v1/", (req, res) => {
  res.status(200).send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
