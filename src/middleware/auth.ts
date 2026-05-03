import "express-session";
import { Store } from "express-session";

declare module "express-session" {
    interface SessionData {
        account?: {
            username: string;
            idTokenClaims?: {
                roles?: string[];
                [key: string]: unknown;
            };
        };
    }
}

declare module "express-serve-static-core" {
    interface Request {
        sessionStore: Store;
    }
}

import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.session.account) {
        res.redirect("/auth/login");
        return;
    }
    next();
}

export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const roles: string[] = req.session.account?.idTokenClaims?.roles ?? [];
        if (!roles.includes(role)) {
            res.status(403).send("Forbidden");
            return;
        }
        next();
    };
}