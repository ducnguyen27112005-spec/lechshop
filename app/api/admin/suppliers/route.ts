import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: "asc" }
        });
        return NextResponse.json(suppliers);
    } catch (error) {
        return NextResponse.json(
            { error: "Lỗi tải dữ liệu nguồn hàng" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, contact, note } = body;

        if (!name?.trim()) {
            return NextResponse.json(
                { error: "Tên nguồn hàng không được để trống" },
                { status: 400 }
            );
        }

        const newSupplier = await prisma.supplier.create({
            data: {
                name: name.trim(),
                contact: contact?.trim() || null,
                note: note?.trim() || null
            }
        });

        return NextResponse.json(newSupplier);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Tên nguồn hàng này đã tồn tại" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Lỗi tạo nguồn hàng mới" },
            { status: 500 }
        );
    }
}
