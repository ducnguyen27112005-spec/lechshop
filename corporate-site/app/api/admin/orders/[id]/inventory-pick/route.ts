import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST: "Chọn từ Kho (Auto-Pick)" 
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: orderId } = await params;

        // 1. Phân tích Order hiện tại xem Khách hàng mua cái gì
        const rawOrder = await prisma.order.findUnique({
            where: { id: orderId }
        });

        const order = rawOrder as any;

        if (!order || !order.products || order.products.length === 0) {
            // Fallback: nếu schema chưa có order.products, ta cố gắng tìm item đầu tiên available
            // (Tuỳ thuộc vào dự án lưu product info ở đâu, tạm thời fallback)
            const fallbackItem = await prisma.inventoryItem.findFirst({
                where: { status: 'AVAILABLE' }
            });

            if (fallbackItem) {
                // ... fallback logic
            }

            return NextResponse.json({ error: 'Không tìm thấy thông tin sản phẩm của đơn hàng để chọn từ Kho.' }, { status: 404 });
        }

        // Ưu tiên dòng SP đầu tiên (Thường đơn hàng premium chỉ mua 1 SP 1 lúc)
        const product = order.products[0];

        // Vì trong hệ thống OrderProduct hiện tại không lưu slug tĩnh (chỉ có name và planLabel)
        // Nên phải dùng contains name hoặc exact match. (Tạm thời tìm tương đối bằng từ khóa)
        // Trong trường hợp chuẩn nhất, productId/planId trên thẻ kho chính là slug của CMS Product.
        const productName = product.name.toLowerCase();

        // Dựa vào keyword map với các Service (Netflix, ChatGPT...) 
        // Trong tương lai, chuẩn hóa bằng trường metadata { productId: 'netflix' } ở order.products
        let targetProductKeyword = "";
        if (productName.includes("netflix")) targetProductKeyword = "netflix";
        else if (productName.includes("chatgpt")) targetProductKeyword = "chatgpt";
        else if (productName.includes("youtube")) targetProductKeyword = "youtube";
        else if (productName.includes("capcut")) targetProductKeyword = "capcut";
        else if (productName.includes("canva")) targetProductKeyword = "canva";
        else if (productName.includes("gemini")) targetProductKeyword = "gemini";
        else targetProductKeyword = productName; // Fallback to raw

        // Tìm trong Kho một Item KHỚP và đang AVAILABLE
        // Về lý tưởng, planId cũng phải khớp, nhưng để mock demo/tương thích mình lọc ưu tiên productId chứa keyword trước.
        const inventoryItem = await prisma.inventoryItem.findFirst({
            where: {
                status: 'AVAILABLE',
                productId: { contains: targetProductKeyword }
                // planId: product.planLabel -> Nếu muốn matching chính xác 100% plan
            },
            orderBy: { createdAt: 'asc' }, // FIFO: Lấy cái cũ xuất trước
            include: { supplier: true }
        });

        if (!inventoryItem) {
            return NextResponse.json(
                { error: `Kho hiện tại đã HẾT tài khoản trống cho loại dịch vụ liên quan đến '${targetProductKeyword}'. Vui lòng Import thêm!` },
                { status: 400 }
            );
        }

        // ============================================
        // TÌM THẤY -> APPLY 
        // ============================================

        // 1. Mark InventoryItem là RESERVED cho đơn hàng này
        const updatedInventory = await prisma.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: {
                status: 'RESERVED',
                reservedOrderId: orderId
            }
        });

        // 2. Chuyển thông tin credential này ra frontend để tự đắp vào Textarea
        // Bỏ việc tạo Fulfillment dạng NOTE để tránh dư thừa log khi nhân viên chưa bấm "Hoàn tất".

        return NextResponse.json({
            success: true,
            message: 'Đã tự động lấy tài khoản từ kho thành công!',
            inventoryItem: updatedInventory
        });

    } catch (error) {
        console.error('Lỗi khi auto-pick kho:', error);
        return NextResponse.json({ error: 'Gặp sự cố kết nối tới Kho Cấp Phát' }, { status: 500 });
    }
}
