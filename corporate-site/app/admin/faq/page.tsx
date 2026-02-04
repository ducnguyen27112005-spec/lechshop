"use client";

import { useEffect, useState } from "react";
import { Plus, Search, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { DataTable } from "@/components/admin/shared/DataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";

export default function FAQPage() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const res = await fetch("/api/admin/faq");
            const data = await res.json();
            setFaqs(data);
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: "STT", accessor: "order", className: "w-16" },
        {
            header: "Câu hỏi", accessor: (item: any) => (
                <p className="font-bold max-w-lg">{item.question}</p>
            )
        },
        {
            header: "Trạng thái", accessor: (item: any) => (
                <StatusBadge status={String(item.isActive)} />
            )
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Câu hỏi thường gặp"
                description="Quản lý các câu hỏi và câu trả lời hỗ trợ khách hàng."
            >
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all">
                    <Plus className="h-5 w-5" /> Thêm câu hỏi
                </button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={faqs}
                isLoading={loading}
                onEdit={(item) => console.log("Edit FAQ", item)}
                onDelete={(item) => console.log("Delete FAQ", item)}
            />
        </div>
    );
}
