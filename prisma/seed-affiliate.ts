import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding affiliate data...");

    // Setup demo user IDs
    const referrerUserId = "demo-referrer-user-id";
    const referredUserId = "demo-referred-user-id";
    const orderId = "demo-order-aff-001";

    // 1. Create a Referral Code
    const referralCode = await prisma.referralCode.upsert({
        where: { userId: referrerUserId },
        update: {},
        create: {
            userId: referrerUserId,
            code: "DEMOREF",
            status: "ACTIVE"
        }
    });
    console.log("Created ReferralCode:", referralCode.code);

    // 2. Add some Clicks
    await prisma.referralClick.create({
        data: {
            codeId: referralCode.id,
            ipHash: "127.0.0.1",
            userAgent: "Mozilla/5.0 Demo Browser"
        }
    });
    console.log("Added ReferralClick");

    // 3. Create Attribution
    await prisma.referralAttribution.upsert({
        where: { referredUserId: referredUserId },
        update: {},
        create: {
            referrerUserId: referrerUserId,
            referredUserId: referredUserId
        }
    });
    console.log("Created Attribution for user:", referredUserId);

    // 4. Create a Commission
    await prisma.commission.upsert({
        where: { orderId: orderId },
        update: {},
        create: {
            referrerUserId: referrerUserId,
            referredUserId: referredUserId,
            orderId: orderId,
            baseAmount: 1000000, // 1 million VND order
            ratePercent: 10,     // 10%
            commissionAmount: 100000, // 100,000 VND commission
            status: "PENDING",    // Starts as pending
            holdUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days hold
        }
    });
    console.log("Created Commission linked to order:", orderId);

    // 5. Create a Wallet for the Referrer
    await prisma.wallet.upsert({
        where: { userId: referrerUserId },
        update: {},
        create: {
            userId: referrerUserId,
            balancePending: 100000,
            balanceAvailable: 500000, // Pre-seeded with 500k to test withdrawals
            balancePaidTotal: 200000
        }
    });
    console.log("Created Wallet for referrer");

    // 6. Setup some initial Global settings if they don't exist
    await prisma.setting.upsert({
        where: { id: "site-settings" },
        update: {},
        create: {
            id: "site-settings",
            affiliateConfig: {
                defaultRate: 10,
                holdDays: 7,
                minWithdraw: 50000,
                maxWithdraw: 10000000
            }
        }
    });
    console.log("Saved default Affiliate Settings in Setting model");

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
