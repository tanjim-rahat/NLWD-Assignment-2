import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { initDB } from "./database/connection";
import AuthRouter from "./routes/auth";

initDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use("/api/auth", AuthRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
