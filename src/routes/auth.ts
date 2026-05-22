import Router, { type Application, type Request, type Response } from "express";

const router: Application = Router();

router.post("/signup", (req: Request, res: Response) => {
  // Handle user signup logic here
  res.send("User signed up successfully!");
});

router.post("/login", (req: Request, res: Response) => {
  // Handle user login logic here
  res.send("User logged in successfully!");
});

export default router;
