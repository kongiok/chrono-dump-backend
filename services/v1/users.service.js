import { isValidEmail, isValidPassword } from "../../utils/v1/validate.util.js";

export const validateUserCredentials = async (req, res, next) => {
  if (!req.body) {
    return res.status(400).send('User data is required');
  }
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.status(400).send('Credential is required');
  }
  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ message: 'Invalid email' });
  }
  if (!isValidPassword(req.body.password)) {
    return res.status(400).send({ message: 'Invalid password', password: req.body.password });
  }
  next();
}
