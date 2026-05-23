import express from "express";
import { type Router, type Request, type Response } from "express";
import auth from "@/middlewares/auth";
import { getIssues, createIssue } from "./issues.controller";

const router: Router = express.Router();

router.use(express.json());

router.get("/", getIssues);
router.post("/", auth, createIssue);

export default router;
