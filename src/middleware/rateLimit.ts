import rateLimit from "express-rate-limit";

export const generateLimiter = rateLimit({
    windowMs: 60 * 1000,        // 1 minute window
    max: 30,                     // max 30 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again shortly" }
});