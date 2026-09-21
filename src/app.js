import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import itemsRouter from "./routes/items.js";
import { notFound, errorHandler } from "./middlewares/errors.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_PATH = path.join(__dirname, "..", "public");
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(
  express.static(PUBLIC_PATH, {
    setHeaders(res, filePath) {
      if (filePath.endsWith("sw.js")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    }
  })
);

app.use("/api/items", itemsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
