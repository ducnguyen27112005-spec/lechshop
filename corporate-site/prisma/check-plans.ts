import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
    const cats = await p.socialCategory.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: "asc" }
    });
    console.log("=== Social Categories in DB ===");
    for (const c of cats) {
        console.log(`  [${c.slug}] ${c.name}`);
    }
}

main().then(() => p.$disconnect());
