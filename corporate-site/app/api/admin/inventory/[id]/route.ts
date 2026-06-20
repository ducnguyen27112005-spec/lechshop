import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT: Cập nhật thông tin/trạng thái một item
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Lấy data hiện hành
        const existing = await prisma.inventoryItem.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Không tìm thấy tài khoản kho' }, { status: 404 });
        }

        const {
            productId,
            planId,
            supplierId,
            batchCode,
            credentialText,
            status
        } = body;

        const updated = await prisma.inventoryItem.update({
            where: { id },
            data: {
                productId: productId !== undefined ? productId : existing.productId,
                planId: planId !== undefined ? planId : existing.planId,
                supplierId: supplierId !== undefined ? supplierId : existing.supplierId,
                batchCode: batchCode !== undefined ? batchCode : existing.batchCode,
                credentialText: credentialText !== undefined ? credentialText : existing.credentialText,
                status: status !== undefined ? status : existing.status,
            }
        });

        return NextResponse.json({ success: true, item: updated });
    } catch (error) {
        console.error('Lỗi khi cập nhật kho:', error);
        return NextResponse.json(
            { error: 'Lỗi cập nhật dữ liệu' },
            { status: 500 }
        );
    }
}

// DELETE: Xóa cứng hoặc Vô hiệu hóa (Mark as DISABLED)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Ưu tiên xóa mềm bằng cách mark status DISABLED nếu nó đã được liên kết với đơn.
        // Tuy nhiên do yêu cầu CRUD cơ bản, ta cho phép xóa cứng nếu status = AVAILABLE, còn lại Mark Disabled.
        const existing = await prisma.inventoryItem.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Không tìm thấy data' }, { status: 404 });
        }

        if (existing.status === 'AVAILABLE') {
            // Xóa cứng cho sạch kho
            await prisma.inventoryItem.delete({
                where: { id }
            });
            return NextResponse.json({ success: true, message: 'Đã xóa tài khoản khỏi kho' });
        } else {
            // Đã bán hoặc đã giữ chỗ -> Mark Disabled (Xóa mềm)
            await prisma.inventoryItem.update({
                where: { id },
                data: { status: 'DISABLED' }
            });
            return NextResponse.json({ success: true, message: 'Đã vô hiệu hóa tài khoản do đã có lịch sử gắn với đơn hàng' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa tài khoản kho:', error);
        return NextResponse.json(
            { error: 'Gặp sự cố khi xóa' },
            { status: 500 }
        );
    }
}
