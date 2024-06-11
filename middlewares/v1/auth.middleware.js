import { isValidEmail, isValidPassword } from "../../utils/v1/validate.util.js";
import { getUserByEmail, getUserById } from "../../models/v1/users.model.js";
import { decodeToken, verifyToken } from "../../services/v1/auth.service.js";


export const validateUserCredentials = (req, res, next) => {
  const [scheme, credentials] = req.headers.authorization.split(' ');
  if (scheme !== 'Basic') {
    return res.status(401).send({ message: 'Invalid authentication scheme' });
  }
  const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
  const [email, password] = decodedCredentials.split(':');
  if (!email || !password) {
    return res.status(401).send({ message: 'Invalid credentials format' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).send('Invalid email');
  }
  if (!isValidPassword(password)) {
    return res.status(400).send('Invalid password');
  }
  req.body.email = email;
  req.body.password = password;
  next();
}

export const validateDuplicateUser = async (req, res, next) => {
  const { email } = req.body;
  try {
    const users = await getUserByEmail(email);
    if (users) {
      return res.status(409).send({
        msg: 'User already exists',
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      msg: 'Internal server error',
      error: error.message,
    });
  }
}
export const isValidToken = async (req, res, next) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }
  if (!req.headers.authorization) {
    return res.status(401).send('Invalid authorization header');
  }
  if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
    return res.status(401).send('Invalid authorization header');
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Invalid authorization header');
  }
  try {
    const token = await verifyToken(token);
  } catch (err) {
    return res.status(401).send('Invalid authorization header');
  }
  next();
}

export const hasLogin = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send('Invalid authorization header');
  }
  if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
    return res.status(401).send('Invalid authorization header');
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Invalid authorization header');
  }
  try {
    const { client_id, exp, scope } = (await verifyToken(token)).payload;
    const currentTimestamp = Date.now() / 1000;
    const expirationTimestamp = exp;
    const timeRemaining = expirationTimestamp - currentTimestamp;
    // const minutesRemaining = Math.floor(timeRemaining / 60);
    // const secondsRemaining = timeRemaining % 60;
    if (timeRemaining < 0) {
      return res.status(401).send({ msg: 'Token expired', exp, now: Date.now() });
    }
    const user = await getUserById(client_id);
    if (!user) {
      return res.status(401).send({ msg: 'User not found', sub });
    }
    req.body.current = {
      scope,
      exp,
      client_id,
    }

  } catch (err) {
    return res.status(401).send({
      msg: 'Invalid authorization header',
      error: err.message,
      token: (await verifyToken(token)).payload,
    });
  }
  next();
}
