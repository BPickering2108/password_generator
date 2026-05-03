import fs from "fs";
import path from "path";
import crypto from "crypto";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const AMBIGUOUS = new Set("0O1lI");

let cachedWordList: string[] | null = null;
let cachedSymbols: string | null = null;

function loadWordList(): string[] {
    if (cachedWordList) return cachedWordList;

    const scowlPath = path.join(process.cwd(), "dictionaries", "en_GB-ise.txt");

    let words: string[];

    if (fs.existsSync(scowlPath)) {
        words = fs.readFileSync(scowlPath, "utf-8")
            .split("\n")
            .map(w => w.trim().toLowerCase());
    } else {
        throw new Error("No wordlist available");
    }

    cachedWordList = words.filter(w =>
        w.length >= 3 &&
        w.length <= 10 &&
        /^[a-z]+$/.test(w)
    );

    return cachedWordList;
}

function loadSymbols(): string {
    if (cachedSymbols) return cachedSymbols;

    const dictPath = path.join(process.cwd(), "dictionaries", "symbol_dictionary.json");
    const dict = JSON.parse(fs.readFileSync(dictPath, "utf-8"));
    cachedSymbols = dict.symbols.join("");
    
    return cachedSymbols!;
}

export interface GeneratorOptions {
    type: "random" | "passphrase" | "pin";
    uppercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
    includeAmbiguous?: boolean;
    length?: number;
    wordCount?: number;
    delimiter?: string;
    additionalExclusions?: string;
}

// Cryptographically secure random integer
function randomInt(max: number): number {
    return crypto.randomInt(0, max);
}

// Random character password
function generateRandom(options: GeneratorOptions): string {
    const {
        uppercase = true,
        numbers = true,
        symbols = true,
        includeAmbiguous = false,
        length = 16,
        additionalExclusions = ""
    } = options;

    let charset = LOWERCASE;
    if (uppercase) charset += UPPERCASE;
    if (numbers) charset += NUMBERS;
    if (symbols) charset += loadSymbols();

    // Remove ambiguous characters unless explicitly included
    if (!includeAmbiguous) {
        charset = charset.split("").filter(c => !AMBIGUOUS.has(c)).join("");
    }

    // Remove any additional user-specified exclusions
    if (additionalExclusions) {
        const exclusionSet = new Set(additionalExclusions.split(""));
        charset = charset.split("").filter(c => !exclusionSet.has(c)).join("");
    }

    if (charset.length === 0) {
        throw new Error("No characters available after applying exclusions");
    }

    return Array.from({ length }, () => charset[randomInt(charset.length)]).join("");
}

// Passphrase
function generatePassphrase(options: GeneratorOptions): string {
    const {
        wordCount = 3,
        delimiter = "-",
        uppercase = true,
        numbers = true,
        symbols = true
    } = options;

    const wordList = loadWordList();

    if (wordList.length === 0) {
        throw new Error("Word list is empty or could not be loaded");
    }

    const words = Array.from({ length: wordCount }, () => {
        let word = wordList[randomInt(wordList.length)];
        if (uppercase) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
    });

    const suffix: string[] = [];
    if (numbers) suffix.push(String(randomInt(100)).padStart(2, "0"));
    if (symbols) {
        const symbolList = loadSymbols();
        suffix.push(symbolList[randomInt(symbolList.length)]);
    }

    return words.join(delimiter) + suffix.join("");
}

// PIN
function generatePin(options: GeneratorOptions): string {
    const { length = 6 } = options;
    return Array.from({ length }, () => randomInt(10).toString()).join("");
}

// Main export
export function generate(options: GeneratorOptions): string {
    switch (options.type) {
        case "random": return generateRandom(options);
        case "passphrase": return generatePassphrase(options);
        case "pin": return generatePin(options);
        default: throw new Error("Unknown generation type");
    }
}

export const DEFAULTS = {
    type: "passphrase" as const,
    uppercase: true,
    numbers: true,
    symbols: true,
    includeAmbiguous: false,
    length: 16,
    wordCount: 4,
    delimiter: "-"
};

export function warmCache(): void {
    const wordCount = loadWordList().length;
    const symbolCount = loadSymbols().length;
    console.log(`Cache warmed - ${wordCount} words, ${symbolCount} symbols loaded`);
}