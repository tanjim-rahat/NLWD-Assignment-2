import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: [path.join(process.cwd(), ".env.local")],
});

const config = {
  JWT_SECRET: process.env.JWT_SECRET as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
};

export default config;
