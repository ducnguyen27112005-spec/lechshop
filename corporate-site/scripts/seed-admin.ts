// Script to create/reset the admin user with a hashed password.
// Usage: npx ts-node scripts/seed-admin.ts
// Or:    npx tsx scripts/seed-admin.ts

import { PrismaClient } from "../generated/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_USERNAME = "admin@lechshop.vn";
const ADMIN_PASSWORD = "Lecshop@2026"; // Change this!
const ADMIN_NAME = "Administrator";

async function main() {
    console.log("🔐 Seeding admin user...");

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const user = await prisma.adminUser.upsert({
        where: { username: ADMIN_USERNAME },
        update: {
            password: hashedPassword,
            name: ADMIN_NAME,
        },
        create: {
            username: ADMIN_USERNAME,
            password: hashedPassword,
            name: ADMIN_NAME,
            role: "ADMIN",
        },
    });

    console.log(`✅ Admin user created/updated:`);
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   ID:       ${user.id}`);
    console.log("");
    console.log("⚠️  Remember to change the password after first login!");
}

main()
    .catch((e) => {
        console.error("❌ Failed to seed admin:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
