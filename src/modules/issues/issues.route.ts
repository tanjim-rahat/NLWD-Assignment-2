import express, { type Router } from "express";
import auth from "../../middlewares/auth";
import {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
} from "./issues.controller";

const router: Router = express.Router();

router.use(express.json());

router.get("/", getIssues);
router.get("/:id", getIssue);

router.post("/", auth, createIssue);
router.patch("/:id", auth, updateIssue);
router.delete("/:id", auth, deleteIssue);

export default router;
