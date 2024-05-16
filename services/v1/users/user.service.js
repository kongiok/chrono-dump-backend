
import { poolData } from "./pg.service"

/**
  * @function fetchAllUsers
  * @description Fetches all users from the database. Note that only get users id, email and role.
  * @returns {Promise<Array>}
**/
export const fetchAllUsers = async () => {
  await poolData.connect();
  return result = await poolData.query('SELECT id AS user_id, email AS user_email, role AS user_role FROM users WHERE is_active = true');
}

/**
  * @function fetchUserById
  * @description Fetches a user from the database by id. Note that only get users id, password, phone and role.
  * @param {string} userId
  * @description The user's unique identifier. It contains UUID format.
  * @returns {Promise<Array>}
**/
export const fetchUserById = async (userId) => {
  await poolData.connect();
  return result = await poolData.query('SELECT id AS user_id, password AS user_password, role AS user_role , phone as user_phone, create_at FROM users WHERE id = $1 AND is_active = true', [userId]);
}

/**
  * @function fetchUserLoginCredentialById
  * @description fetches a user's login credential by id. Note that only get users id, email and password.
  * @param {string} userId
  * @description The user's unique identifier. It contains UUID format.
  * @returns {Promise<Array>}
**/
export const fetchUserLoginCredentialById = async (userId) => {
  await poolData.connect();
  return result = await poolData.query('SELECT id AS user_id, email AS user_email, password AS user_password FROM users WHERE id = $1 AND is_active = true', [userId]);
}

/**
  * @function pushUserToLocal
  * @description Pushes the user to the list.
  * @param {Array} userList
  * @description The list of users.
  * @returns {void}
**/
export const pushUserToLocal = (userList) => {
  const usersCloud = fetchAllUsers().then(user => user).catch(err => err);
  userList.push(usersCloud);
}
