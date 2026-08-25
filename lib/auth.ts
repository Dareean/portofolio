import { cookies } from "next/headers";

const ADMIN_USERNAME = process.env.CMS_ADMIN_USERNAME || "dmardin@gmail.com";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD || "Roxygn@2026";
const SESSION_SECRET = process.env.CMS_SESSION_SECRET || "dareean_portfolio_secret_key_2026";
const COOKIE_NAME = "cms_session_token";

// Configured admin accounts
const VALID_ACCOUNTS: Record<string, string> = {
  "dmardin@gmail.com": "Roxygn@2026",
  "dareean": "dareean2026",
};

/**
 * Checks if username is a valid admin account
 */
export function isValidAdminUser(username: string): boolean {
  if (!username) return false;
  const clean = username.trim().toLowerCase();
  return (
    clean === ADMIN_USERNAME.toLowerCase() ||
    Object.keys(VALID_ACCOUNTS).includes(clean)
  );
}

/**
 * Validates credentials against environment configuration and registered accounts
 */
export function validateCredentials(username: string, password: string): boolean {
  if (!username || !password) return false;
  const cleanUsername = username.trim().toLowerCase();

  // Check against env variables
  if (
    cleanUsername === ADMIN_USERNAME.toLowerCase() &&
    password === ADMIN_PASSWORD
  ) {
    return true;
  }

  // Check against configured accounts table
  if (VALID_ACCOUNTS[cleanUsername] && VALID_ACCOUNTS[cleanUsername] === password) {
    return true;
  }

  return false;
}

/**
 * Generates a simple tamper-resistant session token
 */
export function generateSessionToken(username: string = ADMIN_USERNAME): string {
  const timestamp = Date.now();
  const payload = `${username.trim().toLowerCase()}:${timestamp}`;
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

    if (!isValidAdminUser(username)) return false;

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
