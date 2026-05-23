import express from "express";
import { type Router, type Request, type Response } from "express";
import auth from "@/middlewares/auth";
import { getIssues, getIssue, createIssue } from "./issues.controller";

const router: Router = express.Router();

router.use(express.json());

router.get("/", getIssues);
router.get("/:id", getIssue);
router.post("/", auth, createIssue);

export default router;
