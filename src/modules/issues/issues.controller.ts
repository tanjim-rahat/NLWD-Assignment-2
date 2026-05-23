import type { Request, Response } from "express";
import { pool } from "@/database/connection";

export const getIssues = async (req: Request, res: Response) => {
  const {
    sort = "newest",
    type,
    status,
  }: { sort?: string; type?: string; status?: string } = req.query;

  let query = "SELECT * FROM issues";

  if (type) {
    query += ` WHERE type = '${type}'`;
  }

  if (status) {
    query += type ? ` AND status = '${status}'` : ` WHERE status = '${status}'`;
  }

  if (sort && ["newest", "oldest"].includes(sort)) {
    query += ` ORDER BY created_at ${sort === "newest" ? "DESC" : "ASC"}`;
  }

  const result = await pool.query(query);

  return res.status(200).json({
    success: true,
    message: "Issues retrieved successfully",
    data: result.rows,
  });
};

export const createIssue = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const { title, description, type } = req.body;

  if (!title || !description || !type) {
    return res.status(400).json({
      success: false,
      message: "Title, description, and type are required",
    });
  }

  const result = await pool.query(
    "INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, description, type, req.user?.id],
  );

  return res.status(201).json({
    success: true,
    message: "Issue created successfully",
    data: result.rows[0],
  });
};
