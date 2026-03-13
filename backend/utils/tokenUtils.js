import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
  const payload = { id: userId, role };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret, { expiresIn });
};

