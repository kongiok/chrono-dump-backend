import { Router } from "express";
import { validateUserCredentials } from "../../services/v1/users.service.js";
import { encryptWithAES } from "../../utils/v1/encrypt.util.js";
import { createUser, deleteUser, getUserByEmail, getUsers, updateUser } from "../../models/v1/users.model.js";
import { generateToken } from "../../services/v1/auth.service.js";
import { config } from "dotenv";
import crypto from "crypto";
import { hasLogin, validateDuplicateUser } from "../../middlewares/v1/auth.middleware.js";
import { parseScopes } from "../../utils/v1/validate.util.js";

config();

const router = Router();

router.get('/', async (req, res) => {
  const users = await getUsers();
  res.status(200).send({ users });
});

router.get('/:email', hasLogin, async (req, res) => {
  const { email } = req.params;
  const { user, scope } = req.headers.authorization.split(" ")[1].payload;
  const permission = parseScopes(scope);
  const usersFetched = await getUserByEmail(email);
  let usersByMail = usersFetched;
  if (!(permission["users"] === "read" && id === user.id) && permission["users"] !== "admin") {
    usersByMail = usersFetched.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active
      }
    });
  }
  res.status(200).send({ user: usersByMail });
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
    const expired = Date.now() + (24 * 60 * 60 * 1000);
    const token = await generateToken({ id, scope: "tasks:write users:write", expiresIn: expired, issuer: req.hostname, audience: req.headers.host });
    res.send({ token });
  })

router.patch('/:id', hasLogin, async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  let phone = req.body.phone || null;
  const { user, scope } = req.body.current;
  const permission = parseScopes(scope);
  if (!(permission["users"] === "write" && id === user.id) && permission["users"] !== "admin") {
    return res.status(403).send({ msg: "You don't have permission to update this user" });
  }
  let nameAppend = name ? encryptWithAES(name, process.env.JWT_SECRET, Buffer.from(user.init_vector, 'hex')) : user.name;
  let emailAppend = email ? email : user.email;
  let passwordAppend = password ? encryptWithAES(password, process.env.JWT_SECRET, Buffer.from(user.init_vector, 'hex')) : user.password;
  let phoneAppend = phone ? encryptWithAES(phone, process.env.JWT_SECRET, Buffer.from(user.init_vector, 'hex')) : user.phone;
  let updatedUser = await updateUser(id, {
    name: nameAppend,
    email: emailAppend,
    password: passwordAppend,
    phone: phoneAppend
  });
  res.status(200).send({ updatedUser });
})

router.delete('/:id', hasLogin, async (req, res) => {
  const { id } = req.params;
  const { user, scope } = req.body.current;
  const permission = parseScopes(scope);
  if (!(permission["users"] === "write" && id === user.id) && permission["users"] !== "admin") {
    return res.status(403).send({ msg: "You don't have permission to delete this user" });
  }
  let deletedUser = await deleteUser(id);
  res.status(200).send({ deletedUser });
})

export { router as v1UsersRouter };
