import express from "express";
import { type Router, type Request, type Response } from "express";
import auth from "@/middlewares/auth";
import { createIssue } from "./issues.controller";

const router: Router = express.Router();

router.use(express.json());
router.use(auth);

router.post("/", createIssue);

export default router;
