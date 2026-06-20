"use client";

import { useEffect, useState } from "react";
import {
    Save,
    Image as ImageIcon,
    LayoutGrid,
    PanelRight,
    Ruler,
    FileText,
    CheckCircle2,
    RefreshCw,
    Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    BannerConfig,
    BannerItem,
    getBannerConfig,
    saveBannerConfig,
    defaultBannerConfig,
} from "@/lib/banner-config";

function BannerCard({
    banner,
    index,
    label,
    onChange,
}: {
    banner: BannerItem;
    index: number;
    label: string;
    onChange: (field: keyof BannerItem, value: string) => void;
}) {
    const isVideo = banner.image.endsWith(".mp4");

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            {/* Preview */}
            <div className="relative aspect-[16/7] bg-gray-100 overflow-hidden group">
                {isVideo ? (
                    <video
                        src={banner.image}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                        playsInline
                    />
                ) : (
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${banner.image})` }}
                    />
                )}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">
                        {label}
                    </span>
                    {isVideo && (
                        <span className="bg-violet-600/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                            <Play className="h-3 w-3" /> Video
                        </span>
                    )}
                </div>
            </div>

            {/* Fields */}
            <div className="p-4 space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Tiêu đề
                    </label>
                    <input
                        value={banner.title}
                        onChange={(e) => onChange("title", e.target.value)}
                        placeholder="Tên banner"
                        className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-800"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Đường dẫn hình ảnh / Video
                    </label>
                    <input
                        value={banner.image}
                        onChange={(e) => onChange("image", e.target.value)}
                        placeholder="/images/banner.png hoặc /images/video.mp4"
                        className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-sm text-gray-700 font-mono"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Ruler className="h-3 w-3" /> Kích cỡ đề nghị
                    </label>
                    <div className="w-full px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm font-bold text-blue-700">
                        1456 × 816 px
                    </div>
                </div>
            </div>
        </div>
    );
}

function SideBannerCard({
    banner,
    index,
    label,
    onChange,
}: {
    banner: BannerItem;
    index: number;
    label: string;
    onChange: (field: keyof BannerItem, value: string) => void;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            {/* Preview */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden group">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${banner.image})` }}
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">
                    {label}
                </span>
            </div>

            {/* Fields */}
            <div className="p-4 space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Tiêu đề
                    </label>
                    <input
                        value={banner.title}
                        onChange={(e) => onChange("title", e.target.value)}
                        placeholder="Tên banner"
                        className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-800"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Đường dẫn hình ảnh
                    </label>
                    <input
                        value={banner.image}
                        onChange={(e) => onChange("image", e.target.value)}
                        placeholder="/images/sidebar-banner.png"
                        className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-sm text-gray-700 font-mono"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Ruler className="h-3 w-3" /> Kích cỡ đề nghị
                    </label>
                    <div className="w-full px-3 py-2 bg-pink-50 border border-pink-100 rounded-xl text-sm font-bold text-pink-700">
                        400 × 300 px
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BannersPage() {
    const [config, setConfig] = useState<BannerConfig>(defaultBannerConfig);
    const [saved, setSaved] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setConfig(getBannerConfig());
        setLoaded(true);
    }, []);

    const handleMainChange = (index: number, field: keyof BannerItem, value: string) => {
        setConfig((prev) => {
            const updated = { ...prev };
            updated.mainBanners = [...prev.mainBanners];
            updated.mainBanners[index] = { ...updated.mainBanners[index], [field]: value };
            return updated;
        });
        setSaved(false);
    };

    const handleSideChange = (index: number, field: keyof BannerItem, value: string) => {
        setConfig((prev) => {
            const updated = { ...prev };
            updated.sideBanners = [...prev.sideBanners];
            updated.sideBanners[index] = { ...updated.sideBanners[index], [field]: value };
            return updated;
        });
        setSaved(false);
    };

    const handleSave = () => {
        saveBannerConfig(config);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        if (confirm("Khôi phục lại banner mặc định?")) {
            setConfig(defaultBannerConfig);
            saveBannerConfig(defaultBannerConfig);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    if (!loaded) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-violet-50">
                        <ImageIcon className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Quản lý Banner</h1>
                        <p className="text-sm text-gray-500 font-medium">Thay đổi hình ảnh banner trên trang chủ — 3 banner chính + 2 banner bên cạnh</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Mặc định
                    </button>
                    <button
                        onClick={handleSave}
                        className={cn(
                            "px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm",
                            saved
                                ? "bg-emerald-600 text-white shadow-emerald-200"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                        )}
                    >
                        {saved ? (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                Đã lưu!
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ============ SECTION 1: MAIN BANNERS ============ */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <LayoutGrid className="h-4 w-4 text-blue-600" />
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                        Banner chính (Slider)
                    </h2>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {config.mainBanners.length} banner
                    </span>
                </div>
                <p className="text-xs text-gray-400 font-medium mb-4">
                    Các banner sẽ tự động chuyển đổi trên trang chủ. Hỗ trợ hình ảnh (.png, .jpg) và video (.mp4).
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {config.mainBanners.map((banner, i) => (
                        <BannerCard
                            key={i}
                            banner={banner}
                            index={i}
                            label={`Banner ${i + 1}`}
                            onChange={(field, value) => handleMainChange(i, field, value)}
                        />
                    ))}
                </div>
            </div>

            {/* ============ SECTION 2: SIDE BANNERS ============ */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <PanelRight className="h-4 w-4 text-pink-600" />
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                        Banner bên cạnh
                    </h2>
                    <span className="bg-pink-100 text-pink-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {config.sideBanners.length} banner
                    </span>
                </div>
                <p className="text-xs text-gray-400 font-medium mb-4">
                    2 banner nhỏ hiển thị bên phải của slider chính trên trang chủ.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                    {config.sideBanners.map((banner, i) => (
                        <SideBannerCard
                            key={i}
                            banner={banner}
                            index={i}
                            label={`Bên cạnh ${i + 1}`}
                            onChange={(field, value) => handleSideChange(i, field, value)}
                        />
                    ))}
                </div>
            </div>

            {/* Save bar at bottom */}
            <div className="sticky bottom-4 flex justify-end">
                <button
                    onClick={handleSave}
                    className={cn(
                        "px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg",
                        saved
                            ? "bg-emerald-600 text-white shadow-emerald-200"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                    )}
                >
                    {saved ? (
                        <>
                            <CheckCircle2 className="h-4 w-4" />
                            Đã lưu thành công!
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Lưu tất cả thay đổi
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
