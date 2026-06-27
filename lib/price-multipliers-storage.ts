import prisma from "@/lib/db";

export interface PriceMultipliers {
    /** Hệ số % thay đổi giá theo từng sản phẩm (productId -> percent string) */
    productModifiers: Record<string, number>;
    /** Hệ số % thay đổi giá theo từng danh mục MXH (categoryId -> percent string) */
    categoryModifiers: Record<string, number>;
    /** Hệ số % áp dụng chung cho toàn bộ sản phẩm Thatim API */
    thatimGlobalPercent: number;
    updatedAt?: string;
}

export const defaultMultipliers: PriceMultipliers = {
    productModifiers: {},
    categoryModifiers: {},
    thatimGlobalPercent: 20, // mặc định 20% như hiện tại
};

export async function readMultipliersFromDisk(): Promise<PriceMultipliers> {
    try {
        const setting = await prisma.setting.findUnique({
            where: { id: "price-multipliers" }
        });
        
        if (setting && setting.socialLinks) {
            const parsed = setting.socialLinks as unknown as PriceMultipliers;
            return {
                ...defaultMultipliers,
                ...parsed,
            };
        }
        
        // If not exists, save default and return
        await writeMultipliersToDisk(defaultMultipliers);
        return defaultMultipliers;
    } catch {
        return defaultMultipliers;
    }
}

export async function writeMultipliersToDisk(data: PriceMultipliers): Promise<void> {
    try {
        const dataToSave = { ...data, updatedAt: new Date().toISOString() };
        await prisma.setting.upsert({
            where: { id: "price-multipliers" },
            update: { socialLinks: dataToSave as any },
            create: { id: "price-multipliers", socialLinks: dataToSave as any }
        });
    } catch (err) {
        console.error("Failed to write price multipliers:", err);
    }
}
