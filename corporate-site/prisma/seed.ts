import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const username = "admin@lechshop.vn";
    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.adminUser.upsert({
        where: { username },
        update: {
            password: hashedPassword,
        },
        create: {
            username,
            password: hashedPassword,
            name: "Administrator",
            role: "ADMIN",
        },
    });

    console.log("Admin account created/updated:", admin.username);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
