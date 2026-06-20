import { OrderType, PaymentStatus, FulfillStatus, FulfillmentAction } from '@prisma/client';
import prisma from "../lib/db";

async function main() {
    const testOrderCode = "LS-TEST-9999";
    
    // Check if test order already exists
    const existing = await prisma.order.findUnique({
        where: { code: testOrderCode }
    });

    if (existing) {
        // Delete it so we can recreate
        await prisma.orderFulfillment.deleteMany({
            where: { orderId: existing.id }
        });
        await prisma.order.delete({
            where: { id: existing.id }
        });
    }

    const testOrder = await prisma.order.create({
        data: {
            code: testOrderCode,
            customerName: "Khách Hàng Test",
            customerEmail: "khachhangtest@gmail.com",
            type: "PREMIUM",
            amount: 150000,
            paymentStatus: "PAID",
            fulfillStatus: "DONE",
            deliveredAt: new Date(),
            fulfillments: {
                create: [
                    {
                        action: "DELIVER",
                        credentialText: "Tài khoản: test_account@gmail.com\nMật khẩu: matkhau_test123\nGhi chú: Tài khoản đã được kích hoạt VIP 1 tháng.",
                        note: "Giao hàng qua hệ thống tự động."
                    }
                ]
            }
        }
    });

    console.log(`Successfully created test order!`);
    console.log(`Tracking Code: ${testOrderCode}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
