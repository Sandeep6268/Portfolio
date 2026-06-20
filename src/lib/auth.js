import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";
const ALG = "HS256";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

/** Set the auth cookie (call from a Route Handler / Server Action) */
export async function setAuthCookie(token) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

/** Read & verify the current admin session. Returns payload or null. */
export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

/** Throwing guard for use inside admin API routes. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return session;
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
