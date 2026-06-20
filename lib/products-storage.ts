import fs from "fs";
import path from "path";
import { ProductsConfig, defaultProductsConfig } from "./product-config";

const DATA_FILE = path.join(process.cwd(), "data", "products-config.json");

/**
 * Read products config from the JSON file on disk.
 * Falls back to defaultProductsConfig if file is missing or invalid.
 */
export function readProductsFromDisk(): ProductsConfig {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            // First run: write defaults to disk
            writeProductsToDisk(defaultProductsConfig);
            return defaultProductsConfig;
        }
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw) as ProductsConfig;
        if (!parsed.products || parsed.products.length === 0) {
            return defaultProductsConfig;
        }
        return parsed;
    } catch {
        return defaultProductsConfig;
    }
}

/**
 * Write products config to the JSON file on disk.
 */
export function writeProductsToDisk(config: ProductsConfig): void {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2), "utf-8");
    } catch (err) {
        console.error("Failed to write products config:", err);
    }
}
