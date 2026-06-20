import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { addDays, differenceInDays, format, parseISO, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { normalizePremiumOrderStatus, normalizeSocialOrderStatus, groupStatusForChart, StatusGroupConfig, StatusGroupKey } from "@/lib/order-status";

export interface DashboardSummaryResponse {
    kpi: {
        totalOrders: number;
        revenue: number;
        aov: number;
        pendingOrders: number;
        newCustomers: number;
        cancelledOrders: number;
    };
    compare: {
        totalOrders: number;
        revenue: number;
        aov: number;
        pendingOrders: number;
        newCustomers: number;
        cancelledOrders: number;
    };
    charts: {
        revenueByDay: { day: string; revenue: number }[];
        ordersByDay: { day: string; orders: number }[];
    };
    statusBreakdown: { name: string; value: number; color: string }[];
    recentOrders: {
        id: string;
        code: string;
        customerName: string;
        contact: string;
        amount: number;
        status: string;
        createdAt: string;
        type: 'product' | 'social';
        source: string;
    }[];
    alerts: {
        key: string;
        title: string;
        description: string;
        count: number;
        severity: "danger" | "warning" | "info";
        actionUrl: string;
        meta?: any;
    }[];
}

// Simple In-Memory Cache
interface CacheEntry {
    data: DashboardSummaryResponse;
    timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // 1. Lấy và parse params
        const fromStr = searchParams.get("from");
        const toStr = searchParams.get("to");
        const typeStr = searchParams.get("type") || "all";

        if (!fromStr || !toStr) {
            return NextResponse.json({ error: "Missing from/to parameters" }, { status: 400 });
        }

        const from = parseISO(fromStr);
        const to = parseISO(toStr);
        const toNextDay = addDays(to, 1);
        const duration = differenceInDays(to, from) + 1;

        // 2. Bảo vệ hệ thống: Giới hạn tối đa 90 ngày để chống quá tải DB
        if (duration > 90) {
            return NextResponse.json({ error: "Khoảng thời gian không được vượt quá 90 ngày để đảm bảo hiệu suất." }, { status: 400 });
        }

        // 3. Kiểm tra Cache
        const cacheKey = `${typeStr}_${fromStr}_${toStr}`;
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            // Return from cache directly
            return NextResponse.json(cached.data);
        }

        // 4. Tính toán kỳ trước
        const prevFrom = subDays(from, duration);
        const prevTo = subDays(toNextDay, duration); // same as subDays(to, duration) + 1 day

        // --- Hàm hỗ trợ query cho Order (Premium) và SocialOrder ---
        const fetchPremiumOrderData = async (startDate: Date, endDate: Date) => {
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lt: endDate
                    },
                    fulfillStatus: { not: "CANCELLED" }
                },
                select: {
                    id: true,
                    amount: true,
                    paymentStatus: true,
                    fulfillStatus: true,
                    createdAt: true,
                    customerName: true,
                }
            });
            return orders;
        };

        const fetchSocialOrderData = async (startDate: Date, endDate: Date) => {
            const orders = await prisma.socialOrder.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lt: endDate
                    },
                    status: { not: "cancelled" }
                },
                select: {
                    id: true,
                    totalPrice: true,
                    status: true,
                    createdAt: true,
                    userId: true,
                }
            });
            return orders;
        };

        // 5. Lấy Data cho Biểu Đồ và Breakdown (Vẫn cần array chi tiết từng Record nhưng query select cực nhẹ)
        const fetchAllData = async (startDate: Date, endDate: Date) => {
            let data: any[] = [];
            if (typeStr === 'all' || typeStr === 'product') {
                const orders = await prisma.order.findMany({
                    where: { createdAt: { gte: startDate, lt: endDate }, fulfillStatus: { not: "CANCELLED" } },
                    select: { id: true, amount: true, paymentStatus: true, fulfillStatus: true, createdAt: true, customerName: true }
                });
                data = [...data, ...orders.map(o => {
                    const normalized = normalizePremiumOrderStatus(o.paymentStatus, o.fulfillStatus);
                    return { ...o, __normalizedStatus: normalized, __group: groupStatusForChart(normalized).id, type: 'product' };
                })];
            }
            if (typeStr === 'all' || typeStr === 'social') {
                const socialData = await prisma.socialOrder.findMany({
                    where: { createdAt: { gte: startDate, lt: endDate }, status: { not: "cancelled" } },
                    select: { id: true, totalPrice: true, status: true, createdAt: true, userId: true }
                });
                data = [...data, ...socialData.map((o: any) => {
                    const normalized = normalizeSocialOrderStatus(o.status);
                    return { ...o, amount: o.totalPrice || 0, __normalizedStatus: normalized, __group: groupStatusForChart(normalized).id, type: 'social', customerName: o.userId };
                })];
            }
            return data;
        };

        const currentData = await fetchAllData(from, toNextDay);
        const previousData = await fetchAllData(prevFrom, prevTo);

        // --- Calculate KPIs ---
        const calcKPIs = (data: any[]) => {
            let totalOrders = data.length;
            let revenue = 0;
            let pendingOrders = 0;
            const uniqueCustomers = new Set();

            data.forEach(item => {
                revenue += item.amount;
                if (item.__group === 'pending' || item.__normalizedStatus === 'CHO_THANH_TOAN') {
                    pendingOrders++;
                }
                if (item.customerName) uniqueCustomers.add(item.customerName);
            });

            const aov = totalOrders > 0 ? revenue / totalOrders : 0;
            const newCustomers = uniqueCustomers.size;

            return { totalOrders, revenue, aov, pendingOrders, newCustomers };
        };

        const currentKPICalc = calcKPIs(currentData);
        const prevKPICalc = calcKPIs(previousData);

        // Fetch CANCELLED separately across the database for accurate counts avoiding in-memory array bloat of cancelled data
        let cancelledCurrent = 0, cancelledPrev = 0;
        if (typeStr === 'all' || typeStr === 'product') {
            cancelledCurrent += await prisma.order.count({ where: { createdAt: { gte: from, lt: toNextDay }, fulfillStatus: 'CANCELLED' } });
            cancelledPrev += await prisma.order.count({ where: { createdAt: { gte: prevFrom, lt: prevTo }, fulfillStatus: 'CANCELLED' } });
        }
        if (typeStr === 'all' || typeStr === 'social') {
            cancelledCurrent += await prisma.socialOrder.count({ where: { createdAt: { gte: from, lt: toNextDay }, status: 'cancelled' } });
            cancelledPrev += await prisma.socialOrder.count({ where: { createdAt: { gte: prevFrom, lt: prevTo }, status: 'cancelled' } });
        }

        const currentKPI = { ...currentKPICalc, cancelledOrders: cancelledCurrent };
        const prevKPI = { ...prevKPICalc, cancelledOrders: cancelledPrev };

        // Calculate Deltas for comparison
        const compare = {
            totalOrders: prevKPI.totalOrders ? ((currentKPI.totalOrders - prevKPI.totalOrders) / prevKPI.totalOrders) * 100 : (currentKPI.totalOrders > 0 ? 100 : 0),
            revenue: prevKPI.revenue ? ((currentKPI.revenue - prevKPI.revenue) / prevKPI.revenue) * 100 : (currentKPI.revenue > 0 ? 100 : 0),
            aov: prevKPI.aov ? ((currentKPI.aov - prevKPI.aov) / prevKPI.aov) * 100 : (currentKPI.aov > 0 ? 100 : 0),
            pendingOrders: prevKPI.pendingOrders ? ((currentKPI.pendingOrders - prevKPI.pendingOrders) / prevKPI.pendingOrders) * 100 : (currentKPI.pendingOrders > 0 ? 100 : 0),
            newCustomers: prevKPI.newCustomers ? ((currentKPI.newCustomers - prevKPI.newCustomers) / prevKPI.newCustomers) * 100 : (currentKPI.newCustomers > 0 ? 100 : 0),
            cancelledOrders: prevKPI.cancelledOrders ? ((currentKPI.cancelledOrders - prevKPI.cancelledOrders) / prevKPI.cancelledOrders) * 100 : (currentKPI.cancelledOrders > 0 ? 100 : 0),
        };

        // --- Charts Data ---
        // Create an array of all days in the current interval
        const daysInInterval = eachDayOfInterval({ start: from, end: to });

        const revenueByDay = daysInInterval.map(day => {
            const dayStr = format(day, "dd/MM");
            const rev = currentData
                .filter(item => isSameDay(new Date(item.createdAt), day))
                .reduce((acc, curr) => acc + curr.amount, 0);
            return { day: dayStr, revenue: rev };
        });

        const ordersByDay = daysInInterval.map(day => {
            const dayStr = format(day, "dd/MM");
            const ords = currentData
                .filter(item => isSameDay(new Date(item.createdAt), day))
                .length;
            return { day: dayStr, orders: ords };
        });

        // --- Status Breakdown ---
        // Nhóm lại theo chart: pending | processing | completed | cancelled | failed
        const groupCounts: Record<string, number> = {};
        const groupMap: Record<string, StatusGroupConfig> = {};

        currentData.forEach(item => {
            const gid = item.__group;
            groupCounts[gid] = (groupCounts[gid] || 0) + 1;
            if (!groupMap[gid]) {
                groupMap[gid] = groupStatusForChart(item.__normalizedStatus);
            }
        });

        const totalItems = currentData.length || 1;

        const statusBreakdown = Object.keys(groupCounts).map(gid => {
            const count = groupCounts[gid];
            const cfg = groupMap[gid];
            return {
                id: cfg.id,
                name: cfg.label,
                value: Math.round((count / totalItems) * 100),
                count: count,
                color: cfg.color
            };
        }).filter(item => item.value > 0);

        if (statusBreakdown.length === 0 && currentData.length === 0) {
            statusBreakdown.push({ id: 'empty' as StatusGroupKey, name: "Chưa có đơn hàng", value: 100, count: 0, color: "#cbd5e1" });
        }


        // --- Recent Orders ---
        // Lấy từ DB trực tiếp để có format đẹp hơn và limit
        let recentOrdersRaw: any[] = [];
        if (typeStr === 'all' || typeStr === 'product') {
            const ro = await prisma.order.findMany({
                where: { createdAt: { gte: from, lt: toNextDay } },
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: { id: true, code: true, customerName: true, customerEmail: true, amount: true, paymentStatus: true, fulfillStatus: true, createdAt: true }
            });
            recentOrdersRaw = [...recentOrdersRaw, ...ro.map((r: any) => ({ ...r, __type: 'product' }))];
        }
        if (typeStr === 'all' || typeStr === 'social') {
            const rs = await prisma.socialOrder.findMany({
                where: { createdAt: { gte: from, lt: toNextDay } },
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: { id: true, code: true, userId: true, totalPrice: true, status: true, platformSlug: true, createdAt: true }
            });
            recentOrdersRaw = [...recentOrdersRaw, ...rs.map((r: any) => ({ ...r, __type: 'social' }))];
        }

        // Sort combined
        recentOrdersRaw.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const recentOrders = recentOrdersRaw.slice(0, 10).map((o: any) => {
            if (o.__type === 'product') {
                const normalized = normalizePremiumOrderStatus(o.paymentStatus, o.fulfillStatus);
                const grouped = groupStatusForChart(normalized);
                return {
                    id: o.id,
                    code: o.code,
                    customerName: o.customerName,
                    contact: o.customerEmail, // Using email as contact
                    amount: o.amount,
                    status: normalized,
                    statusGroup: grouped.id,
                    createdAt: o.createdAt.toISOString(),
                    type: 'product' as const,
                    source: 'Web', // Mặc định là Web cho dạng order này (chưa tracking affiliate kỹ)
                };
            } else {
                const normalized = normalizeSocialOrderStatus(o.status);
                const grouped = groupStatusForChart(normalized);
                return {
                    id: o.id,
                    code: o.code,
                    customerName: o.platformSlug.toUpperCase(), // Best guess for customer ident without User join
                    contact: o.userId || "Khách vãng lai",
                    amount: o.totalPrice || 0,
                    status: normalized,
                    statusGroup: grouped.id,
                    createdAt: o.createdAt.toISOString(),
                    type: 'social' as const,
                    source: 'Social', // Placeholder nguồn social
                };
            }
        });

        // --- Alerts System ---
        const alertsRaw: any[] = [];
        const now = new Date();
        const yesterday = subDays(now, 1);
        const startOfTodayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Rule 1: Danger - Đơn quá SLA > 24h
        let overduePaidCount = 0;
        let overdueUnpaidCount = 0;

        if (typeStr === 'all' || typeStr === 'product') {
            const productOverdue = await prisma.order.findMany({
                where: { createdAt: { lte: yesterday }, fulfillStatus: { in: ['NEW', 'PROCESSING'] } },
                select: { paymentStatus: true }
            });
            productOverdue.forEach(o => {
                if (o.paymentStatus === 'PAID') overduePaidCount++;
                else if (o.paymentStatus === 'PENDING') overdueUnpaidCount++;
            });
        }

        if (typeStr === 'all' || typeStr === 'social') {
            const socialOverdue = await prisma.socialOrder.findMany({
                where: { createdAt: { lte: yesterday }, status: { in: ['received', 'preparing', 'running', 'need_info', 'new'] } },
                select: { status: true }
            });
            socialOverdue.forEach(o => {
                // Tạm coi received/preparing/running là đã paid (thường service chạy sau khi paid)
                // need_info có thể hiểu là đang cần user cung cấp thêm => có thể unpaid hoặc pending rắc rối. Giả định đưa hết vào unpaid để chia nhánh
                if (['received', 'preparing', 'running'].includes(o.status)) overduePaidCount++;
                else overdueUnpaidCount++;
            });
        }

        if (overduePaidCount > 0) {
            alertsRaw.push({
                key: "overdue-paid",
                title: "Đơn chờ xử lý quá hạn",
                description: `Có ${overduePaidCount} đơn đã thanh toán nhưng chưa hoàn tất trên 24 giờ.`,
                count: overduePaidCount,
                severity: "danger",
                actionUrl: "/admin/orders?statusGroup=pending", // Có thể cần filter custom hơn trên UI sau
            });
        }
        if (overdueUnpaidCount > 0) {
            alertsRaw.push({
                key: "overdue-unpaid",
                title: "Đơn chưa thanh toán quá hạn",
                description: `Có ${overdueUnpaidCount} đơn chưa thanh toán quá 24h.`,
                count: overdueUnpaidCount,
                severity: "danger", // Hoặc warning tuỳ quy trình
                actionUrl: "/admin/orders?statusGroup=pending",
            });
        }

        // Rule 2: Warning - Đơn Social có lời nhắn
        let notesCount = 0;
        let recentNoteIds: string[] = [];
        if (typeStr === 'all' || typeStr === 'social') {
            const sevenDaysAgo = subDays(now, 7);
            const notesOrders = await prisma.socialOrder.findMany({
                where: {
                    createdAt: { gte: sevenDaysAgo },
                    status: { notIn: ['completed', 'cancelled'] },
                    customerNote: { not: null, gt: '' } // Prisma sqlite might need just not null, but let's filter in JS to be safe with trim
                },
                select: { id: true, customerNote: true },
                orderBy: { createdAt: 'desc' }
            });

            // Filter empty notes safely
            const validNotes = notesOrders.filter(o => o.customerNote && o.customerNote.trim().length > 0);
            notesCount = validNotes.length;
            recentNoteIds = validNotes.slice(0, 5).map(o => o.id);
        }

        if (notesCount > 0) {
            alertsRaw.push({
                key: "social-notes",
                title: "Khách hàng để lại lời nhắn",
                description: `Có ${notesCount} đơn dịch vụ Social mới mang kèm ghi chú cần kiểm tra.`,
                count: notesCount,
                severity: "warning",
                actionUrl: "/admin/social", // Có thể thêm ?hasNote=true nếu trang list hỗ trợ filter này
                meta: { recentIds: recentNoteIds }
            });
        }

        // Rule 3: Info - Đơn huỷ hôm nay
        let cancelledTodayCount = 0;
        if (typeStr === 'all' || typeStr === 'product') {
            cancelledTodayCount += await prisma.order.count({
                where: { fulfillStatus: 'CANCELLED', updatedAt: { gte: startOfTodayDate } }
            });
        }
        if (typeStr === 'all' || typeStr === 'social') {
            cancelledTodayCount += await prisma.socialOrder.count({
                where: { status: 'cancelled', updatedAt: { gte: startOfTodayDate } }
            });
        }

        if (cancelledTodayCount > 0) {
            alertsRaw.push({
                key: "cancelled-today",
                title: "Đơn huỷ hôm nay",
                description: `Có ${cancelledTodayCount} đơn hàng bị huỷ trong ngày.`,
                count: cancelledTodayCount,
                severity: "info",
                actionUrl: "/admin/orders?statusGroup=cancelled",
            });
        }

        // Response
        const response: DashboardSummaryResponse = {
            kpi: currentKPI,
            compare,
            charts: { revenueByDay, ordersByDay },
            statusBreakdown,
            recentOrders,
            alerts: alertsRaw
        };

        // Update Cache First
        cache.set(cacheKey, { data: response, timestamp: Date.now() });

        return NextResponse.json(response);

    } catch (error: any) {
        console.error("Dashboard Summary Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
