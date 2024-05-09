import express from "express";

const app = express();
const PORT = 5050;

app.get("/api/v1/", (req, res) => {
  res.status(200).send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
