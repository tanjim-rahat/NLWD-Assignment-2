import express, { type Router } from "express";
import { signup, login } from "./auth.controller";

const router: Router = express.Router();

router.use(express.json());

router.post("/signup", signup);

router.post("/login", login);

export default router;
