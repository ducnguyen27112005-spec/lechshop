import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        let where: any = {};

        if (status && status !== 'ALL') {
            where.status = status.toLowerCase();
        }

        if (search) {
            where.OR = [
                { fullName: { contains: search } },
                { email: { contains: search } },
                { studentId: { contains: search } },
                { school: { contains: search } }
            ];
        }

        const requests = await prisma.studentRequest.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error("Fetch Student Requests Error:", error);
        return NextResponse.json(
            { error: "Lỗi Server" },
            { status: 500 }
        );
    }
}
