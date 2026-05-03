import { Router, Request, Response } from "express";
import { msalClient } from "../auth/msalClient";
import path from "path";

const router = Router();

router.get("/login", async (req: Request, res: Response) => {
    const authUrl = await msalClient.getAuthCodeUrl({
        scopes: ["openid", "profile", "email"],
        redirectUri: process.env.REDIRECT_URI!,
    });

    res.redirect(authUrl);
});

router.get("/callback", async (req: Request, res: Response) => {
    console.log("Callback hit - session ID:", req.sessionID);
    console.log("Session:", req.session);
    try {
        const tokenResponse = await msalClient.acquireTokenByCode({
            code: req.query.code as string,
            scopes: ["openid", "profile", "email"],
            redirectUri: process.env.REDIRECT_URI!,
        });

        req.session.account = {
            username: tokenResponse.account?.username ?? "",
            idTokenClaims: {
                roles: (tokenResponse.idTokenClaims as any)?.roles ?? [],
            }
        };

        req.session.save((err) => {
            if (err) console.error("Session save error:", err);
            res.send(`
                <html>
                    <head>
                        <meta http-equiv="refresh" content="0;url=/admin">
                    </head>
                    <body>Redirecting...</body>
                </html>
            `);
        });

    } catch (err) {
        console.error("MSAL callback error:", err);
        res.status(401).sendFile(path.join(process.cwd(), "views", "401.html"));
    }
});

router.get("/logout", (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "views", "logout.html"));
});

router.post("/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

export default router;