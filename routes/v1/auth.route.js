import { Router } from "express";
import { validateUserCredentials, isValidToken } from "../../middlewares/v1/auth.middleware.js";
import { getUserByEmail, setUserActive } from "../../models/v1/users.model.js";
import { generateToken, verifyToken } from "../../services/v1/auth.service.js";
import { decryptWithAES, verifyWithArgon2 } from "../../utils/v1/encrypt.util.js";


const router = Router();

router.post('/login',
  validateUserCredentials,
  async (req, res) => {
    const { email, password: passwdGiven } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).send('There is no user with that email');
    }
    const { id, password, is_active, init_vector } = user;
    const encryptedPassword = {
      encryptedData: password,
    };
    const decryptedPassword = decryptWithAES(encryptedPassword, process.env.JWT_SECRET, Buffer.from(init_vector, 'hex'));
    const isCorrectPassword = decryptedPassword === passwdGiven;
    if (!isCorrectPassword) {
      return res.status(401).send({ msg: 'Invalid email or password' });
    }
    if (!is_active) {
      setUserActive(user.id);
    }
    const token = await generateToken({ id, scope: "tasks:write users:write", expiresIn: "1d", issur: req.hostname, audience: req.headers.host });
    res.status(200).send({ token });
  });

router.post('/logout',
  isValidToken,
  (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const { id, issuer, audience } = verifyToken(token);
    const tokenReturned = generateToken({ id, scope: "", expiresIn: "1s", issuer, audience });
    res.status(200).send({ token: tokenReturned });
  });

router.post('/refresh',
  isValidToken,
  (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const { id, scope, issuer, audiance } = verifyToken(token);
    const tokenReturned = generateToken({ id, scope, expiresIn: "1d", issuer, audiance });
    res.status(200).send({ token: tokenReturned });
  });

router.post('/validate',
  async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const tokenReturned = await verifyToken(token);
    return res.status(200).send({ token: tokenReturned });
  })
export { router as v1AuthRouter };
