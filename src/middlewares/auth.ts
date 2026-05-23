import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "@/config";
import { pool } from "@/database/connection";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is missing",
    });
  }

  const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

  // check if user exists in the database
  const query = await pool.query("SELECT * FROM users WHERE id = ?", [
    payload.id,
  ]);

  if (query.rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  req.user = query.rows[0];

  next();
};
