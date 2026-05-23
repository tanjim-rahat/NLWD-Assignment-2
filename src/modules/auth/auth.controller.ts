import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/index";
import { pool } from "../../database/connection";
import { isValidRole } from "../../utils";

export const signup = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const {
    name,
    email,
    password,
    role,
  }: { name: string; email: string; password: string; role: string } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, email, password, role",
    });
  }

  if (!isValidRole(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Valid roles are: maintainer, contributor",
    });
  }

  // check if user already exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      success: false,
      message: "User with this email already exists",
    });
  }

  // hash password (using bcrypt)
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user into database
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at",
    [name, email, hashedPassword, role],
  );

  res.json({
    success: true,
    message: "User registered successfully!",
    data: result.rows[0],
  });
};

export const login = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: email, password",
    });
  }

  // check if user exists
  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (userResult.rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const user = userResult.rows[0];

  // compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // create and send jwt token
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    config.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.json({
    success: true,
    message: "User logged in successfully!",
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    },
  });
};
