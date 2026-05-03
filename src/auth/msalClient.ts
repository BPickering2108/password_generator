import { ConfidentialClientApplication } from "@azure/msal-node";
import dotenv from "dotenv";

dotenv.config();

const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID!,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET!,
    }
};

export const msalClient = new ConfidentialClientApplication(msalConfig);