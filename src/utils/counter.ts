import fs from "fs";
import path from "path";

const counterPath = path.join(process.cwd(), "data", "counter.json");

function ensureDataDir() {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

export function getCount(): number {
    ensureDataDir();
    if (!fs.existsSync(counterPath)) return 0;
    const data = JSON.parse(fs.readFileSync(counterPath, "utf-8"));
    return data.count ?? 0;
}

export function incrementCount(): number {
    ensureDataDir();
    const count = getCount() + 1;
    fs.writeFileSync(counterPath, JSON.stringify({ count }));
    return count;
}

export function setCount(value: number): void {
    ensureDataDir();
    fs.writeFileSync(counterPath, JSON.stringify({ count: value }));
}