import { AES } from "crypto-js";
import { users as usersCache } from "../data/cache.store";
import { fetchUserLoginCredentialById, pushUserToLocal } from "./user.service";
import { env } from "process";


export const validatePostService = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json" && req.method !== 'POST') {
    return res.status(400).send("Invalid request");
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("Invalid user data");
  }
  next();
}

/**
  * @function validateBasicAuth
  * @param {object} req - request object
  * @param {object} res - response object
  * @param {function} next - next function
  * @description validate the basic auth header
  * @returns {object} response object
**/

export const validateBasicAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized");
  }
  const [tokenType, tokenText] = req.headers.authorization.split(" ");
  if (tokenType !== "Basic") {
    return res.status(401).send("Can not support this type of authorization");
  }
  const [emailGiven, passwordGiven] = Buffer.from(tokenText, 'base64').toString().split(":");
  if (Object.length(usersCache) === 0) {
    pushUserToLocal(usersCache);
  }
  const matchedUser = usersCache.find(user => user.userEmail === emailGiven);
  if (!matchedUser) {
    return res.status(401).send("Unknown user");
  }
  const passwordUserMatched = fetchUserLoginCredentialById(matchedUser.user_id);
  const decryptedText = AES.decrypt(passwordGiven, env.EXPRESS_APP_SECRET_KEY).toString();
  if (decryptedText !== passwordUserMatched) {
    return res.status(401).send("Invalid password");
  }
  req.role = matchedUser.user_role;
  next();
}

/**
  * @function validateTokenAuth
  * @param {object} req - request object
  * @param {object} res - response object
  * @param {function} next - next function
  * @description validate the token auth header
  * @returns {object} response object
**/
export const validateTokenAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized");
  }
  const [tokenType, tokenText] = req.headers.authorization.split(" ");
  if (tokenType !== "Bearer") {
    return res.status(401).send("Can not support this type of authorization");
  }

  next();
}
