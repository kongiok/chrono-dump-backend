import { SignJWT, jwtVerify } from "jose";
import { config } from "dotenv";
config();

export const generateToken = async ({
  id,
  scope,
  expiresIn,
  issuer,
  audience,
}) => {
  return await new SignJWT({
    sub: id,
    scope,
    client_id: id,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

export const verifyToken = async (token) => {
  return await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
}

export const decodeToken = async (token) => {
  return await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET), {
    issuer: token.iss,
    audience: token.aud,
    complete: true
  });
}
