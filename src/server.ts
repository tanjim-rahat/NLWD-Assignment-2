import express, { type Application } from "express";

import AuthRouter from "./modules/auth/auth.route";
import IssuesRouter from "./modules/issues/issues.route";

import { initDB } from "./database/connection";

initDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use("/api/auth", AuthRouter);
app.use("/api/issues", IssuesRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
