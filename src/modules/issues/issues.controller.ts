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

export const getIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Issue not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Issue retrieved successfully",
    data: result.rows[0],
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

export const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const { title, description, type, status } = req.body;

  const queryResult = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);

  if (queryResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Issue not found",
    });
  }

  const issue = queryResult.rows[0];

  if (
    req.user?.id !== issue.reporter_id &&
    issue.status === "open" &&
    req.user?.role !== "maintainer"
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this issue",
    });
  }

  const updatedIssue = {
    title: title || issue.title,
    description: description || issue.description,
    type: type || issue.type,
    status: status || issue.status,
  };

  const result = await pool.query(
    "UPDATE issues SET title = $1, description = $2, type = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
    [
      updatedIssue.title,
      updatedIssue.description,
      updatedIssue.type,
      updatedIssue.status,
      id,
    ],
  );

  return res.status(200).json({
    success: true,
    message: "Issue updated successfully",
    data: result.rows[0],
  });
};

export const deleteIssue = async (req: Request, res: Response) => {
  if (req.user?.role !== "maintainer") {
    return res.status(403).json({
      success: false,
      message: "Only maintainers can delete issues",
    });
  }

  const { id } = req.params;

  const result = await pool.query("DELETE FROM issues WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Issue not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Issue deleted successfully",
  });
};
