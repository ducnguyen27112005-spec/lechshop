"use client";

import { useEffect, useState, useRef } from "react";
import {
    Upload,
    Image as ImageIcon,
    Copy,
    CheckCircle2,
    Trash2,
    Search,
    Film,
    X,
    Loader2,
    HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaFile {
    filename: string;
    url: string;
    size: number;
    uploadedAt: string;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function MediaPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = async () => {
        try {
            const res = await fetch("/api/admin/media");
            const data = await res.json();
            setFiles(data);
        } catch {
            console.error("Failed to fetch media");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        setUploading(true);

        for (const file of Array.from(fileList)) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("/api/admin/media", {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) {
                    const err = await res.json();
                    alert(`Lỗi tải "${file.name}": ${err.error}`);
                }
            } catch {
                alert(`Lỗi tải "${file.name}"`);
            }
        }

        setUploading(false);
        fetchFiles();
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDelete = async (filename: string) => {
        if (!confirm(`Xóa file "${filename}"?`)) return;
        try {
            await fetch(`/api/admin/media?filename=${encodeURIComponent(filename)}`, {
                method: "DELETE",
            });
            fetchFiles();
        } catch {
            alert("Xóa thất bại");
        }
    };

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleUpload(e.dataTransfer.files);
    };

    const filtered = files.filter((f) =>
        f.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isVideo = (url: string) => url.endsWith(".mp4");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-50">
                        <HardDrive className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Kho hình ảnh</h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Tải ảnh lên rồi copy link để dán vào trang Quản lý Banner
                        </p>
                    </div>
                </div>
                <div className="text-xs text-gray-400 font-bold">
                    {files.length} file • {formatFileSize(files.reduce((s, f) => s + f.size, 0))}
                </div>
            </div>

            {/* Upload zone */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all",
                    dragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/mp4"
                    multiple
                    onChange={(e) => handleUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                />
                {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="text-sm font-bold text-blue-600">Đang tải lên...</p>
                    </div>
                ) : (
                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center gap-3 cursor-pointer"
                    >
                        <div className="p-4 rounded-2xl bg-blue-100">
                            <Upload className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                Kéo thả file vào đây hoặc{" "}
                                <span className="text-blue-600 underline">bấm để chọn</span>
                            </p>
                            <p className="text-xs text-gray-400 font-medium mt-1">
                                PNG, JPG, GIF, WEBP, SVG, MP4 — tối đa 10MB
                            </p>
                        </div>
                    </label>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm file..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Files grid */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-400">
                        {searchQuery ? "Không tìm thấy file nào" : "Chưa có file nào. Hãy tải ảnh lên!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filtered.map((file) => (
                        <div
                            key={file.filename}
                            className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                        >
                            {/* Preview */}
                            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                {isVideo(file.url) ? (
                                    <video
                                        src={file.url}
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                        playsInline
                                        onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                                        onMouseOut={(e) => {
                                            const v = e.target as HTMLVideoElement;
                                            v.pause();
                                            v.currentTime = 0;
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={file.url}
                                        alt={file.filename}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                )}

                                {/* Type badge */}
                                {isVideo(file.url) && (
                                    <span className="absolute top-2 left-2 bg-violet-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                        <Film className="h-2.5 w-2.5" /> MP4
                                    </span>
                                )}

                                {/* Hover overlay with actions */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => handleCopy(file.url)}
                                        className={cn(
                                            "p-2.5 rounded-xl text-white transition-all shadow-lg",
                                            copiedUrl === file.url
                                                ? "bg-emerald-500"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        )}
                                        title="Copy link"
                                    >
                                        {copiedUrl === file.url ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.filename)}
                                        className="p-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg"
                                        title="Xóa"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <p className="text-[11px] font-bold text-gray-800 truncate" title={file.filename}>
                                    {file.filename}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {formatFileSize(file.size)}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {formatDate(file.uploadedAt)}
                                    </span>
                                </div>
                                {/* Copy URL button */}
                                <button
                                    onClick={() => handleCopy(file.url)}
                                    className={cn(
                                        "mt-2 w-full px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all",
                                        copiedUrl === file.url
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                    )}
                                >
                                    {copiedUrl === file.url ? (
                                        <>
                                            <CheckCircle2 className="h-3 w-3" />
                                            Đã copy!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3 w-3" />
                                            Copy link ảnh
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
