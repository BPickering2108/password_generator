import fs from "fs";
import path from "path";

const settingsPath = path.join(process.cwd(), "data", "settings.json");

export interface Settings {
    maintenance: boolean;
}

const baseSettings: Settings = {
    maintenance: false,
};

export function getSettings(): Settings {
    if (!fs.existsSync(settingsPath)) return baseSettings;
    try {
        return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    } catch {
        return baseSettings;
    }
}

export function saveSettings(settings: Settings): void {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}