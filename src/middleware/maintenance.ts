import { Request, Response, NextFunction } from "express";
import { getSettings } from "../utils/settings";
import path from "path";

export function maintenanceMode(req: Request, res: Response, next: NextFunction) {
    if (getSettings().maintenance &&
        !req.path.startsWith('/api') &&
        !req.path.startsWith('/admin') &&
        !req.path.startsWith('/auth')) {

        // POST/non-GET requests are API calls - return JSON error
        if (req.method !== 'GET') {
            res.status(503).json({ error: 'Service temporarily unavailable for maintenance' });
            return;
        }

        // GET requests get the maintenance page
        res.status(503).sendFile(path.join(process.cwd(), "views", "maintenance.html"));
        return;
    }
    next();
}