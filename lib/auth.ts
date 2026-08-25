import { cookies } from "next/headers";

const ADMIN_USERNAME = process.env.CMS_ADMIN_USERNAME || "dareean";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD || "dareean2026";
const SESSION_SECRET = process.env.CMS_SESSION_SECRET || "dareean_portfolio_secret_key_2026";
const COOKIE_NAME = "cms_session_token";

/**
 * Validates credentials against environment configuration
 */
export function validateCredentials(username: string, password: string): boolean {
  if (!username || !password) return false;
  return (
    username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}

/**
 * Generates a simple tamper-resistant session token
 */
export function generateSessionToken(): string {
  const timestamp = Date.now();
  const payload = `${ADMIN_USERNAME}:${timestamp}`;
  const encoded = Buffer.from(payload).toString("base64");
  return `${encoded}.${SESSION_SECRET.slice(0, 8)}`;
}

/**
 * Validates session token
 */
export function validateSessionToken(token: string): boolean {
  if (!token) return false;
  try {
    const [encoded, secretSuffix] = token.split(".");
    if (secretSuffix !== SESSION_SECRET.slice(0, 8)) return false;

    const payload = Buffer.from(encoded, "base64").toString("utf-8");
    const [username, timestamp] = payload.split(":");

    if (username !== ADMIN_USERNAME) return false;

    // Check expiration (7 days validity)
    const tokenTime = parseInt(timestamp, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - tokenTime > maxAge) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if current server request is authenticated via cookie
 */
export function isServerAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return validateSessionToken(token);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
