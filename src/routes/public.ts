import { Router, Request, Response } from "express";
import { generate, GeneratorOptions, DEFAULTS } from "../utils/generator";
import { getCount, incrementCount } from "../utils/counter";
import path from "path";
import { generateLimiter } from "../middleware/rateLimit";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "views", "index.html"));
});

router.get("/defaults", (req: Request, res: Response) => {
    res.json({ ...DEFAULTS, count: getCount() });
});

router.post("/generate", generateLimiter, (req: Request, res: Response) => {
    try {
        const options: GeneratorOptions = req.body;

        // Server-side length validation
        if (options.type === "random" || options.type === "pin") {
            const length = options.length ?? 16;
            const min = 4;
            const max = options.type === "pin" ? 12 : 128;

            if (!Number.isInteger(length) || length < min || length > max) {
                res.status(400).json({
                    error: `Length must be a whole number between ${min} and ${max}`
                });
                return;
            }
        }

        if (options.type === "passphrase") {
            const wordCount = options.wordCount ?? 4;
            if (!Number.isInteger(wordCount) || wordCount < 3 || wordCount > 8) {
                res.status(400).json({
                    error: "Word count must be between 3 and 8"
                });
                return;
            }
        }

        const result = generate(options);
        const count  = incrementCount();
        res.json({ result, count });

    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/api/me", (req: Request, res: Response) => {
    if (!req.session.account) {
        res.json({ loggedIn: false });
        return;
    }
    res.json({
        loggedIn: true,
        username: req.session.account.username,
    });
});

router.get("/health", (req: Request, res: Response) => {
    res.json({
        status:  "ok",
        uptime:  Math.floor(process.uptime()),
        version: process.env.npm_package_version ?? "unknown",
    });
});

export default router;