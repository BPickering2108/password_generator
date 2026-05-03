import { Router, Request, Response } from "express";
import path from "path";
import { requireAuth, requireRole } from "../middleware/auth";
import { getCount, setCount } from "../utils/counter";
import { getSettings, saveSettings } from "../utils/settings";

const router = Router();

router.use(requireAuth);
router.use(requireRole("admin"));

// Serve admin page
router.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "views", "admin.html"));
});

// Stats
router.get("/api/stats", (req: Request, res: Response) => {
    res.json({
        count:       getCount(),
        uptime:      Math.floor(process.uptime()),
        maintenance: getSettings().maintenance,
    });
});

// Reset counter
router.post("/api/counter/reset", (req: Request, res: Response) => {
    const target = typeof req.body.value === "number" ? req.body.value : 0;
    if (target < 0) {
        res.status(400).json({ error: "Counter value cannot be negative" });
        return;
    }
    setCount(target);
    res.json({ count: target });
});

// Maintenance toggle
router.post("/api/maintenance", (req: Request, res: Response) => {
    console.log("Session account:", req.session?.account);
    console.log("Session ID:", req.sessionID);
    const settings = getSettings();
    settings.maintenance = !settings.maintenance;
    saveSettings(settings);
    res.json({ maintenance: settings.maintenance });
});

// Invalidate all sessions
router.post("/api/sessions/invalidate", (req: Request, res: Response) => {
    const sessionStore = req.sessionStore;

    if (!sessionStore.clear) {
        res.status(501).json({ error: "Session store does not support clearing" });
        return;
    }

    sessionStore.clear((err) => {
        if (err) {
            res.status(500).json({ error: "Failed to invalidate sessions" });
            return;
        }
        res.json({ message: "All sessions invalidated" });
    });
});

export default router;