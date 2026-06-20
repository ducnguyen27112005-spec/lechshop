"use client";

import { useState } from "react";
import { useComments } from "@/hooks/use-comments";
import { deleteComment, toggleApproval, getComments } from "@/lib/comment-config";
import { Search, Trash2, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function AdminCommentsPage() {
    const comments = useComments();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredComments = comments.filter(comment =>
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comment.postTitle && comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
            deleteComment(id);
        }
    };

    const handleToggleApproval = (id: string) => {
        toggleApproval(id);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý bình luận</h1>
                    <p className="text-gray-500 text-sm mt-1">Duyệt và quản lý bình luận từ khách hàng</p>
                </div>
            </div>

            {/* Config / Actions */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bình luận..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    Tổng số: <span className="font-bold text-gray-900">{comments.length}</span> bình luận
                </div>
            </div>

            {/* Comments List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
                                <th className="p-4 font-bold w-1/4">Người gửi</th>
                                <th className="p-4 font-bold w-1/3">Nội dung</th>
                                <th className="p-4 font-bold w-1/6">Bài viết</th>
                                <th className="p-4 font-bold text-center w-24">Trạng thái</th>
                                <th className="p-4 font-bold text-right w-24">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredComments.map(comment => (
                                <tr key={comment.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-gray-900">{comment.name}</div>
                                        <div className="text-gray-500 text-xs mt-0.5">{comment.email || "Không có email"}</div>
                                        <div className="text-gray-400 text-xs mt-1">{comment.date}</div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <Link
                                            href={`${routes.news}/${comment.postSlug}`}
                                            target="_blank"
                                            className="text-blue-600 hover:underline font-medium line-clamp-2"
                                        >
                                            {comment.postTitle || "Xem bài viết"}
                                        </Link>
                                    </td>
                                    <td className="p-4 align-top text-center">
                                        <button
                                            onClick={() => handleToggleApproval(comment.id)}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${comment.isApproved
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                                }`}
                                        >
                                            {comment.isApproved ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3" />
                                                    Đã duyệt
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3" />
                                                    Chờ duyệt
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4 align-top text-right">
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Xóa bình luận"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredComments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                <MessageSquare className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p>Không tìm thấy bình luận nào</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
