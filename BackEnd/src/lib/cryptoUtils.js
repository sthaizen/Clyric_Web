import crypto from "crypto";

/**
 * Generate a short, human-readable room code (e.g., "A3X-9K2")
 */
export function generateRoomId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No 0/O/1/I to avoid confusion
  let code = "";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}

/**
 * Hash a password with SHA-256 + salt
 */
export function hashPassword(password, salt) {
  return crypto.createHash("sha256").update(password + salt).digest("hex");
}

/**
 * Verify a password against a stored hash
 */
export function verifyPassword(password, salt, storedHash) {
  const hash = hashPassword(password, salt);
  return hash === storedHash;
}
