import session from "express-session";
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import publicRouter from "./routes/public";
import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";
import path from "path";
import { maintenanceMode } from "./middleware/maintenance";
import { warmCache } from "./utils/generator";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static", {
    maxAge: process.env.NODE_ENV === "production" ? "1d" : 0,
    etag: true,
    lastModified: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 5
    } 
}));

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use(maintenanceMode);
app.use("/", publicRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).sendFile(path.join(process.cwd(), "views", "404.html"));
});

warmCache();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});