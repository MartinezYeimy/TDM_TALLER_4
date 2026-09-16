import path from "node:path";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import itemsRouter from "./routes/items.js";
import { notFound, errorHandler } from "./middlewares/errors.js";

const PUBLIC_PATH = path.join(import.meta.dirname, "..", "public");

const app = express();

// Middlewares 
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

//Rutas de la API 
app.use("/api/items", itemsRouter);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

export default app;
