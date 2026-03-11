import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    // Check current state
    const plans = await prisma.socialPlan.findMany({
        where: { service: { category: { slug: "facebook" } } },
        select: { id: true, code: true, min: true }
    });
    console.log("Before update:");
    plans.forEach(p => console.log(`  ${p.code}: min=${p.min}`));

    // Update ALL plans to min=50
    for (const plan of plans) {
        await prisma.socialPlan.update({
            where: { id: plan.id },
            data: { min: 50 }
        });
    }

    // Verify
    const after = await prisma.socialPlan.findMany({
        where: { service: { category: { slug: "facebook" } } },
        select: { code: true, min: true }
    });
    console.log("\nAfter update:");
    after.forEach(p => console.log(`  ${p.code}: min=${p.min}`));
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
