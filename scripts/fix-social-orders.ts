import prisma from "../lib/db";

async function main() {
  const result = await prisma.socialOrder.updateMany({
    where: { status: 'received' },
    data: { status: 'new' }
  });
  console.log(`Updated ${result.count} existing test social orders to "new" (unpaid).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
