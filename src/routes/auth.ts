import express, { type Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../database/connection";

const router: Router = express.Router();

router.use(express.json());

router.post("/signup", async (req: Request, res: Response) => {
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
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
    [name, email, hashedPassword, role],
  );

  res.json({
    success: true,
    message: "User registered successfully!",
    data: {
      id: result.rows[0]?.id,
      name,
      email,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
});

router.post("/login", async (req: Request, res: Response) => {
  // Handle user login logic here
  res.send("User logged in successfully!");
});

export default router;
