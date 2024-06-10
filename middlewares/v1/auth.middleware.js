import { isValidEmail, isValidPassword } from "../../utils/v1/validate.util.js";
import { getUserByEmail } from "../../models/v1/users.model.js";

export const validateUserCredentials = (req, res, next) => {
  const [scheme, credentials] = req.headers.authorization.split(' ');
  if (scheme !== 'Basic') {
    return res.status(401).send({ message: 'Invalid authentication scheme' });
  }

  const [email, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':');
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
