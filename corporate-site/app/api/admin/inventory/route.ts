import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Lấy danh sách tài khoản trong kho (Có filter)
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const planId = searchParams.get('planId');
        const supplierId = searchParams.get('supplierId');
        const status = searchParams.get('status');

        const whereClause: any = {};
        if (productId) whereClause.productId = productId;
        if (planId) whereClause.planId = planId;
        if (supplierId) whereClause.supplierId = supplierId;
        if (status && status !== 'ALL') whereClause.status = status;

        const items = await prisma.inventoryItem.findMany({
            where: whereClause,
            include: {
                supplier: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error('Lỗi khi tải kho tài khoản:', error);
        return NextResponse.json(
            { error: 'Không thể tải kho tài khoản' },
            { status: 500 }
        );
    }
}

// POST: Nhập kho (Bulk Import từ TextArea)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { productId, planId, supplierId, batchCode, credentialsText } = body;

        // Validation
        if (!productId || !planId || !credentialsText) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc (productId, planId, credentials)' },
                { status: 400 }
            );
        }

        // Tự động phân tách credential text thành mảng dựa trên Line Breaks (mỗi dòng là 1 Acc)
        // Lọc bỏ dòng trống
        const lines = credentialsText
            .split(/\r?\n/)
            .map((l: string) => l.trim())
            .filter((l: string) => l.length > 0);

        if (lines.length === 0) {
            return NextResponse.json(
                { error: 'Nội dung trống, không tìm thấy tài khoản nào.' },
                { status: 400 }
            );
        }

        const dataToInsert = lines.map((line: string) => ({
            productId,
            planId,
            supplierId: supplierId || null,
            batchCode: batchCode || null,
            credentialText: line,
            status: 'AVAILABLE'
        }));

        // Insert vào DB
        const result = await prisma.inventoryItem.createMany({
            data: dataToInsert
        });

        return NextResponse.json(
            {
                success: true,
                message: `Đã nhập thành công ${result.count} tài khoản vào kho!`,
                count: result.count
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Lỗi nhập kho tài khoản:', error);
        return NextResponse.json(
            { error: 'Gặp lỗi trong quá trình xử lý nhập kho.' },
            { status: 500 }
        );
    }
}
