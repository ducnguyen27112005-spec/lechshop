import fs from "fs";
import path from "path";

export interface PriceMultipliers {
    /** Hệ số % thay đổi giá theo từng sản phẩm (productId -> percent string) */
    productModifiers: Record<string, number>;
    /** Hệ số % thay đổi giá theo từng danh mục MXH (categoryId -> percent string) */
    categoryModifiers: Record<string, number>;
    /** Hệ số % áp dụng chung cho toàn bộ sản phẩm Thatim API */
    thatimGlobalPercent: number;
    updatedAt?: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "price-multipliers.json");

export const defaultMultipliers: PriceMultipliers = {
    productModifiers: {},
    categoryModifiers: {},
    thatimGlobalPercent: 20, // mặc định 20% như hiện tại
};

export function readMultipliersFromDisk(): PriceMultipliers {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            writeMultipliersToDisk(defaultMultipliers);
            return defaultMultipliers;
        }
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw) as PriceMultipliers;
        return {
            ...defaultMultipliers,
            ...parsed,
        };
    } catch {
        return defaultMultipliers;
    }
}

export function writeMultipliersToDisk(data: PriceMultipliers): void {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
            "utf-8"
        );
    } catch (err) {
        console.error("Failed to write price multipliers:", err);
    }
}
