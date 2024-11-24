import jwt from "jsonwebtoken";

export async function generateToken(userId, res) {
  const token = jwt.sign({ userId }, process.env.JWT_SECTET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, //XXS attacks
    sameSite: "strict", //CSRF
    secure: process.env.NODE_ENV !== "development",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
}