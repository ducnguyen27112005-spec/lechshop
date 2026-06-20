"use client";

import { useState } from "react";
import { User, Send, MessageSquare } from "lucide-react";
import { useComments } from "@/hooks/use-comments";
import { saveComment } from "@/lib/comment-config";

interface Comment {
    id: string;
    name: string;
    avatar?: string; // Keeping this as the display logic still references it, though the new saveComment doesn't provide it.
    content: string;
    date: string;
    isAdmin?: boolean;
    isApproved: boolean; // Added based on visibleComments filtering
}

interface CommentSectionProps {
    postId: string;
    postTitle: string;
    postSlug: string;
}

export default function CommentSection({ postId, postTitle, postSlug }: CommentSectionProps) {
    const comments = useComments(postId);
    const [form, setForm] = useState({
        name: "",
        email: "",
        content: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.content.trim()) return;

        saveComment({
            postId,
            postTitle,
            postSlug,
            name: form.name || "Khách ẩn danh",
            email: form.email,
            content: form.content,
            isAdmin: false,
        });

        setForm({ name: "", email: "", content: "" });
        // Optional: Show success message
        alert("Bình luận của bạn đã được gửi!");
    };

    // Filter approved comments only for public view (unless we want to show pending to author?)
    // For simplicity, let's show all for now since we auto-approve. 
    // If we change to moderation, we filter: c.isApproved
    const visibleComments = comments.filter(c => c.isApproved);

    return (
        <div className="mt-12 pt-12 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Bình luận ({visibleComments.length})
            </h3>

            {/* Comment Form */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Để lại một bình luận</h4>
                <p className="text-sm text-gray-500 mb-6">
                    Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc được đánh dấu *
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                            <input
                                required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                type="text"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Nhập tên của bạn"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                type="email"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Nhập email (không bắt buộc)"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bình luận *</label>
                        <textarea
                            required
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Viết bình luận của bạn..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
                    >
                        <Send className="h-4 w-4" />
                        Gửi bình luận
                    </button>
                </form>
            </div>

            {/* Comment List */}
            <div className="space-y-6">
                {visibleComments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                ) : (
                    visibleComments.map((comment) => (
                        <div key={comment.id} className={`flex gap-4 ${comment.isAdmin ? 'bg-blue-50/50 p-4 rounded-xl border border-blue-100' : ''}`}>
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    <User className="h-5 w-5 text-gray-500" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-bold text-gray-900">{comment.name}</h5>
                                    {comment.isAdmin && (
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full">
                                            Quản trị viên
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-500">• {comment.date}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                                    {comment.content}
                                </p>
                                <button className="text-xs font-bold text-gray-500 hover:text-blue-600 mt-2 transition-colors">
                                    Trả lời
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
