"use client";

import { useEffect, useState, useRef } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Save,
    Loader2,
    Image as ImageIcon,
    Upload,
    Eye,
    Star,
    ArrowLeft,
    Package
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    thumbnail: string | null;
    thumbnailUrl: string | null;
    status: "DRAFT" | "PUBLISHED" | "HIDDEN";
    viewCount?: number;
    isFeatured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    categoryId?: string;
    category?: { name: string; slug: string };
    tags?: { id: string; name: string }[];
    date?: string; // For display compatibility
    createdAt: string;
    updatedAt: string;
    relatedProducts?: { id: string, name: string }[];
}

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [availableTags, setAvailableTags] = useState<{ id: string, name: string }[]>([]);
    const [availableProducts, setAvailableProducts] = useState<{ id: string, name: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<Post>>({});

    useEffect(() => {
        loadPosts();
        loadMetadata();
    }, []);

    const loadMetadata = async () => {
        try {
            const [catRes, tagRes, prodRes] = await Promise.all([
                fetch("/api/admin/categories"),
                fetch("/api/admin/tags"),
                fetch("/api/admin/premium-products")
            ]);
            if (catRes.ok) setCategories(await catRes.json());
            if (tagRes.ok) setAvailableTags(await tagRes.json());
            if (prodRes.ok) setAvailableProducts(await prodRes.json());
        } catch (error) {
            console.error("Failed to load metadata", error);
        }
    };

    const loadPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/posts");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredPosts = posts.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
    }).filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setEditingPost(null);
        setFormData({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            thumbnail: "",
            thumbnailUrl: "",
            status: "DRAFT",
            isFeatured: false,
            categoryId: categories[0]?.id || "",
            tags: [],
            relatedProductIds: []
        } as any);
        setIsModalOpen(true);
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setFormData({
            ...post,
            tags: post.tags?.map(t => t.id) as any, // Use IDs for form state tags
            relatedProductIds: post.relatedProducts?.map(p => p.id) || []
        } as any);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                const res = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
                if (res.ok) {
                    toast.success("Đã xóa bài viết");
                    loadPosts();
                } else {
                    toast.error("Xóa bài viết thất bại");
                }
            } catch (error) {
                toast.error("Có lỗi xảy ra");
            }
        }
    };

    const resizeImage = (file: File, width: number, height: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement("img");
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject(new Error("Canvas context failed"));

                    // Object fit: cover logic for canvas
                    const scale = Math.max(width / img.width, height / img.height);
                    const x = (width - img.width * scale) / 2;
                    const y = (height - img.height * scale) / 2;
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Canvas toBlob failed"));
                    }, "image/jpeg", 0.9);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Resize to 800x450
            const resizedBlob = await resizeImage(file, 800, 450);
            const resizedFile = new File([resizedBlob], "thumbnail.jpg", { type: "image/jpeg" });

            const uploadFormData = new FormData();
            uploadFormData.append("file", resizedFile);

            const res = await fetch("/api/admin/media", {
                method: "POST",
                body: uploadFormData
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    thumbnail: data.url,
                    thumbnailUrl: data.url
                }));
                toast.success("Đã tải ảnh lên và resize thành công");
            } else {
                toast.error("Tải ảnh thất bại");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi xử lý ảnh");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.slug) {
            toast.error("Vui lòng nhập tiêu đề và slug");
            return;
        }

        // REQUIRE THUMBNAIL & CATEGORY
        if (!formData.thumbnailUrl && !formData.thumbnail) {
            toast.error("BẮT BUỘC phải có ảnh thumbnail mới được lưu/publish");
            return;
        }

        if (!formData.categoryId) {
            toast.error("Vui lòng chọn danh mục cho bài viết");
            return;
        }

        setIsSaving(true);
        try {
            const method = editingPost ? "PUT" : "POST";
            const res = await fetch("/api/admin/posts", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingPost ? { ...formData, id: editingPost.id } : formData)
            });

            if (res.ok) {
                toast.success(editingPost ? "Đã cập nhật bài viết" : "Đã tạo bài viết");
                loadPosts();
                setIsModalOpen(false);
            } else {
                const err = await res.text();
                toast.error("Lỗi: " + err);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi lưu");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAutoSlug = () => {
        if (formData.title) {
            const slug = formData.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[đĐ]/g, "d")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Quản lý bài viết</h1>
                    <p className="text-gray-500 mt-1">Quản lý tin tức và bài viết blog (Yêu cầu thumbnail 800x450)</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                >
                    <Plus className="h-4 w-4" />
                    Thêm bài viết
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="flex-1 outline-none text-gray-700 font-medium"
                />
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
                            <th className="p-4 font-bold">Hình ảnh</th>
                            <th className="p-4 font-bold">Tiêu đề</th>
                            <th className="p-4 font-bold text-center">Trạng thái</th>
                            <th className="p-4 font-bold text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredPosts.map(post => (
                            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-4 w-24">
                                    <div className="w-16 h-10 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                        {(post.thumbnailUrl || post.thumbnail) ? (
                                            <Image
                                                src={post.thumbnailUrl || post.thumbnail || ""}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ImageIcon className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {post.isFeatured && (
                                            <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                                        )}
                                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors max-w-md truncate">
                                            {post.title}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 font-mono">/{post.slug}</div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                        post.status === "PUBLISHED" ? "bg-green-100 text-green-600" :
                                            post.status === "HIDDEN" ? "bg-red-100 text-red-600" :
                                                "bg-gray-100 text-gray-500"
                                    )}>
                                        {post.status === "PUBLISHED" ? "Công khai" :
                                            post.status === "HIDDEN" ? "Bị ẩn" : "Nháp"}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Sửa"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingPost ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Thumbnail Section */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700">Ảnh Thumbnail (800x450) <span className="text-red-500">*</span></label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-[16/9] w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group overflow-hidden relative"
                                    >
                                        {(formData.thumbnailUrl || formData.thumbnail) ? (
                                            <>
                                                <Image src={formData.thumbnailUrl || formData.thumbnail || ""} alt="Preview" fill className="object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                                                    Thay đổi ảnh
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-4">
                                                {isUploading ? (
                                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2 group-hover:text-blue-500" />
                                                        <p className="text-xs text-gray-500 font-bold group-hover:text-blue-600">Click để tải ảnh</p>
                                                        <p className="text-[10px] text-gray-400 mt-1 uppercase">Tự động resize về 800x450</p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                    {(!formData.thumbnail && !formData.thumbnailUrl) && (
                                        <p className="text-[10px] text-red-500 font-bold italic">* Kích thước chuẩn giúp bài viết hiển thị đẹp hơn</p>
                                    )}
                                </div>

                                {/* Title & Slug Column */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Tiêu đề bài viết <span className="text-red-500">*</span></label>
                                        <input
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            onBlur={handleAutoSlug}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                            placeholder="Nhập tiêu đề..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Đường dẫn (Slug) <span className="text-red-500">*</span></label>
                                        <div className="flex gap-2">
                                            <input
                                                value={formData.slug}
                                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                                                placeholder="tieu-de-bai-viet"
                                            />
                                            <button
                                                onClick={handleAutoSlug}
                                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-colors"
                                            >
                                                Auto
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Danh mục <span className="text-red-500">*</span></label>
                                            <select
                                                value={formData.categoryId}
                                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                            >
                                                <option value="">Chọn danh mục...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Trạng thái</label>
                                            <select
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                            >
                                                <option value="DRAFT">Nháp (Mặc định - Không hiển thị)</option>
                                                <option value="PUBLISHED">Công khai (Hiển thị ngay)</option>
                                                <option value="HIDDEN">Bị ẩn (Không hiển thị)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Nổi bật</label>
                                            <div
                                                onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${formData.isFeatured
                                                    ? "bg-amber-50 border-amber-200 text-amber-700"
                                                    : "bg-gray-50 border-gray-200 text-gray-500"
                                                    }`}
                                            >
                                                <Star className={`h-4 w-4 ${formData.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                                                <span className="text-sm font-bold">{formData.isFeatured ? "Bài viết nổi bật" : "Bài viết thường"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Thẻ (Tags)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {availableTags.map(tag => {
                                                    const isSelected = (formData.tags as any)?.includes(tag.id);
                                                    return (
                                                        <button
                                                            key={tag.id}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                const currentTags = (formData.tags as any) || [];
                                                                const nextTags = isSelected
                                                                    ? currentTags.filter((id: string) => id !== tag.id)
                                                                    : [...currentTags, tag.id];
                                                                setFormData({ ...formData, tags: nextTags });
                                                            }}
                                                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${isSelected
                                                                ? "bg-blue-600 border-blue-600 text-white"
                                                                : "bg-white border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500"
                                                                }`}
                                                        >
                                                            #{tag.name}
                                                        </button>
                                                    );
                                                })}
                                                {availableTags.length === 0 && <span className="text-xs text-gray-400 italic">Chưa có tag nào</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEO Section */}
                                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Search className="h-5 w-5 text-blue-600" />
                                            <h3 className="font-bold text-blue-900">Cấu hình SEO</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">SEO Title</label>
                                                <input
                                                    value={formData.metaTitle || ""}
                                                    onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                                    placeholder="Để trống sẽ dùng tiêu đề bài viết"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">Open Graph Image (URL)</label>
                                                <input
                                                    value={formData.ogImage || ""}
                                                    onChange={e => setFormData({ ...formData, ogImage: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                                    placeholder="URL ảnh khi share social"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">SEO Description</label>
                                            <textarea
                                                value={formData.metaDescription || ""}
                                                onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm min-h-[80px]"
                                                placeholder="Sẽ tự động lấy 160 ký tự đầu của bài viết nếu bỏ trống"
                                            />
                                        </div>
                                    </div>

                                    {/* Related Products Section */}
                                    <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package className="h-5 w-5 text-emerald-600" />
                                            <h3 className="font-bold text-emerald-900">Sản phẩm liên quan (Tối đa 3)</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {availableProducts.map(product => {
                                                const relatedIds = (formData as any).relatedProductIds || [];
                                                const isSelected = relatedIds.includes(product.id);
                                                return (
                                                    <button
                                                        key={product.id}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            let nextIds;
                                                            if (isSelected) {
                                                                nextIds = relatedIds.filter((id: string) => id !== product.id);
                                                            } else {
                                                                if (relatedIds.length >= 3) {
                                                                    toast.error("Chỉ được chọn tối đa 3 sản phẩm");
                                                                    return;
                                                                }
                                                                nextIds = [...relatedIds, product.id];
                                                            }
                                                            setFormData({ ...formData, relatedProductIds: nextIds } as any);
                                                        }}
                                                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${isSelected
                                                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                                            : "bg-white border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-500"
                                                            }`}
                                                    >
                                                        {product.name}
                                                    </button>
                                                );
                                            })}
                                            {availableProducts.length === 0 && (
                                                <div className="col-span-full py-4 text-center text-gray-400 text-sm italic">
                                                    Không có sản phẩm nào khả dụng
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Mô tả ngắn</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    placeholder="Tóm tắt nội dung bài viết..."
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Nội dung chi tiết (Markdown / HTML)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    rows={10}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                                    placeholder="# Tiêu đề..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || isUploading}
                                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {editingPost ? "Cập nhật bài viết" : "Lưu bài viết"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
