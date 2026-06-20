import prisma from '../lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const hash = await bcrypt.hash('123456', 10);
  await prisma.affiliateUser.upsert({
    where: { phone: '0868000000' },
    update: { password: hash },
    create: {
      phone: '0868000000',
      password: hash,
      fullName: 'Đối Tác Thử Nghiệm',
      referralCode: 'LECH39568'
    }
  });
  console.log('Tạo thành công tài khoản test: 0868000000 / 123456');
}

main().catch(console.error).finally(() => prisma.$disconnect());
