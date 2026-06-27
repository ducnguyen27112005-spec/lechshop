const { PrismaClient } = require('./generated/client');
const bcrypt = require('bcryptjs');

async function updatePassword() {
    const prisma = new PrismaClient();

    const hash = await bcrypt.hash('0344948165', 12);

    await prisma.adminUser.updateMany({
        where: { username: 'admin@lechshop.vn' },
        data: { password: hash }
    });

    console.log('Updated password for admin@lechshop.vn');
    await prisma.$disconnect();
}

async function main() {
    await updatePassword();
}
main();
