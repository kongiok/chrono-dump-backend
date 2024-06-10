import { verifyToken } from '../../services/v1/auth.service.js';

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]{8,}$/;
  return passwordRegex.test(password);
}
