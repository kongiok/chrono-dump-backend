import { Router } from "express";
import { validateUserCredentials } from "../../services/v1/users.service.js";
import { encryptWithArgon2, encryptWithAES } from "../../utils/v1/encrypt.util.js";
import { createUser, getUserByEmail } from "../../models/v1/users.model.js";
import { generateToken } from "../../services/v1/auth.service.js";
import { config } from "dotenv";
import crypto from "crypto";
import { validateDuplicateUser } from "../../middlewares/v1/auth.middleware.js";

config();

const router = Router();

router.get('/', async (req, res) => {
  const { email } = req.query;
  const mail = await getUserByEmail(email);
  res.send({ email, mail });
});

router.post('/',
  validateUserCredentials,
  validateDuplicateUser,
  async (req, res) => {
    const { name, email, password } = req.body;
    let phone = req.body.phone || null;
    const role = 'user';
    const iv = crypto.randomBytes(16);
    let nameAppend = encryptWithAES(name, process.env.JWT_SECRET, iv);
    let emailAppend = email;
    let passwordAppend = encryptWithAES(password, process.env.JWT_SECRET, iv);
    let phoneAppend = phone ? encryptWithAES(phone, process.env.JWT_SECRET, iv) : null;
    let appendUser = await createUser({
      name: nameAppend,
      email: emailAppend,
      password: passwordAppend,
      phone: phoneAppend,
      role,
      init_vector: iv.toString('hex')
    });
    const { id } = appendUser;
    const token = await generateToken({ id, scope: "tasks:write users:write", expiresIn: "1d", issuer: req.hostname, audience: req.headers.host });
    res.send({ token });
  })

export { router as v1UsersRouter };
