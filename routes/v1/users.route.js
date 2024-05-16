import { Router } from "express";
import { v4 as uuidV4 } from "uuid";
import { users } from "../../services/v1/data/cache.store.js";

const router = Router();

router.get("/", (req, res) => {
  // return res.status(200).send({ "users": userList });
  return res.status(501).send({ "message": "Not implemented" });
})

router.post("/", (req, res) => {
  validatePostService(req, res);
  const peopleAppend = req.body;
  peopleAppend.map((person) => {
    usersCache.push({ userId: uuidV4(), ...person });
  })
  res.status(201).send({ "message": "user successfully append." });
})

router.post("/login", (req, res) => {
  const { userEmail, userPassword } = req.body;
  if (!userEmail || !userPassword) {
    return res.status(400).send("Invalid email or password");
  }
  const user = usersCache.find(user => user.userEmail === userEmail && user.userPassword === userPassword);
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }
  return res.status(200).send("This is a dummy route");
})

router.post("/register", (req, res) => {
  if (req.headers["content-type"] !== "application/json" && req.method !== 'POST') {
    return res.status(400).send("Invalid request");
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("Invalid user data");
  }
  const { userEmail, userPassword } = req.body;
  if (!userEmail || !userPassword) {
    return res.status(400).send("Invalid email or password");
  }

})

router.post("/logout", (req, res) => {
  res.status(200).send("This is a dummy route");
})



export default router;
