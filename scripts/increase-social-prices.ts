import prisma from "../lib/db";

async function main() {
    const plans = await prisma.socialPlan.findMany();
    let updated = 0;
    
    for (const plan of plans) {
        const newPrice = Math.round(plan.pricePerUnit * 1.2);
        
        await prisma.socialPlan.update({
            where: { id: plan.id },
            data: { 
                pricePerUnit: newPrice
            }
        });
        updated++;
    }
    
    console.log(`Updated ${updated} social plans with 20% price increase.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
