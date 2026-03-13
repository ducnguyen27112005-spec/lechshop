"use client";

import { useEffect, useState } from "react";
import {
    Save,
    Plus,
    Layers,
    Trash2,
    CheckCircle2,
    RefreshCw,
    Image as ImageIcon,
    FileText,
    Package,
    ChevronDown,
    ChevronUp,
    ToggleLeft,
    ToggleRight,
    Loader2,
    ShoppingBag,
    Percent,
    DollarSign,
    Sparkles,
    Bold,
    Italic,
    List,
    Heading2,
    Heading3,
    Link,
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import {
    ProductConfig,
    PlanConfig,
    ProductsConfig,
    getProductsConfig,
    saveProductsConfigToServer,
    fetchProductsConfig,
    defaultProductsConfig,
    createEmptyProduct,
    createEmptyPlan,
} from "@/lib/product-config";

// ─── Plan Row ──────────────────────────────────────────────
function PlanRow({
    plan,
    onChange,
    onDelete,
}: {
    plan: PlanConfig;
    onChange: (field: keyof PlanConfig, value: any) => void;
    onDelete: () => void;
}) {
    return (
        <div className={cn(
            "p-3 rounded-xl border transition-all space-y-2",
            plan.inStock
                ? "bg-white border-gray-100"
                : "bg-red-50/50 border-red-100"
        )}>
            {/* Row 1: Label, Price, Original Price, Discount, Buttons */}
            <div className="grid grid-cols-[1fr_1fr_1fr_0.7fr_auto_auto] gap-2 items-center">
                <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase">Tên gói</label>
                    <input
                        value={plan.label}
                        onChange={(e) => onChange("label", e.target.value)}
                        className="w-full px-2 py-1.5 bg-gray-50 rounded-lg text-sm font-bold border-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase">Giá bán (đ)</label>
                    <input
                        type="number"
                        value={plan.price || ""}
                        placeholder="0"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => onChange("price", e.target.value === "" ? 0 : Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-gray-50 rounded-lg text-sm font-bold text-red-600 border-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase">Giá gốc (đ)</label>
                    <input
                        type="number"
                        value={plan.originalPrice || ""}
                        placeholder="0"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => onChange("originalPrice", e.target.value === "" ? 0 : Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-gray-50 rounded-lg text-sm font-medium text-gray-500 border-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase">Giảm %</label>
                    <input
                        type="number"
                        value={plan.discount || ""}
                        placeholder="0"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => onChange("discount", e.target.value === "" ? 0 : Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-gray-50 rounded-lg text-sm font-bold text-orange-600 border-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => onChange("inStock", !plan.inStock)}
                    className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all mt-4",
                        plan.inStock
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                    )}
                    title={plan.inStock ? "Còn hàng" : "Hết hàng"}
                >
                    {plan.inStock ? (
                        <><ToggleRight className="h-4 w-4" /> Còn</>
                    ) : (
                        <><ToggleLeft className="h-4 w-4" /> Hết</>
                    )}
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all mt-4"
                    title="Xóa gói"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
            {/* Row 2: Description */}
            <div>
                <label className="text-[9px] font-black text-gray-400 uppercase">Mô tả gói (chi tiết nội dung gói)</label>
                <textarea
                    value={plan.description || ""}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="VD: Tài khoản Premium không giới hạn + Bảo hành 14 ngày + Tặng kèm Gemini Pro..."
                    rows={2}
                    className="w-full px-2 py-1.5 bg-gray-50 rounded-lg text-sm font-normal border-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>
        </div>
    );
}

// ─── Product Card ──────────────────────────────────────────
function ProductCard({
    product,
    onChange,
    onDelete,
}: {
    product: ProductConfig;
    onChange: (updated: ProductConfig) => void;
    onDelete: () => void;
}) {
    const [expanded, setExpanded] = useState(false);

    const updateField = (field: keyof ProductConfig, value: any) => {
        onChange({ ...product, [field]: value });
    };

    const updatePlan = (index: number, field: keyof PlanConfig, value: any) => {
        const newPlans = [...product.plans];
        const updatedPlan = { ...newPlans[index], [field]: value };

        // Auto calculate discount if price or originalPrice changes
        if (field === "price" || field === "originalPrice") {
            const price = field === "price" ? value : updatedPlan.price;
            const original = field === "originalPrice" ? value : (updatedPlan.originalPrice || 0);
            if (original > 0 && price >= 0) {
                updatedPlan.discount = Math.round(100 - (price / original * 100));
            }
        }

        newPlans[index] = updatedPlan;
        onChange({ ...product, plans: newPlans });
    };

    const deletePlan = (index: number) => {
        if (product.plans.length <= 1) {
            alert("Phải có ít nhất 1 gói!");
            return;
        }
        const newPlans = product.plans.filter((_, i) => i !== index);
        onChange({ ...product, plans: newPlans });
    };

    const addPlan = () => {
        onChange({ ...product, plans: [...product.plans, createEmptyPlan()] });
    };





    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50/50 transition-all"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-300" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{product.shortDesc}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {product.plans.length} gói
                        </span>
                        {product.plans.some((p) => !p.inStock) && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                                Có gói hết hàng
                            </span>
                        )}

                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Xóa sản phẩm"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    {expanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="border-t border-gray-100 p-5 space-y-5">
                    {/* Row 1: Image + Basic Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left: Image */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" /> Hình ảnh sản phẩm
                            </h4>
                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-10 w-10 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <input
                                value={product.image}
                                onChange={(e) => updateField("image", e.target.value)}
                                placeholder="/uploads/product.png"
                                className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm font-mono font-medium border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Right: Basic Info */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <FileText className="h-3 w-3" /> Tên sản phẩm
                                </label>
                                <input
                                    value={product.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" /> Tiêu đề lớn (SEO)
                                </label>
                                <input
                                    value={product.seoTitle}
                                    onChange={(e) => updateField("seoTitle", e.target.value)}
                                    placeholder="Mua Tài Khoản ... Chính Hãng – Giá Tốt Nhất 2025"
                                    className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <FileText className="h-3 w-3" /> Slug (đường dẫn)
                                </label>
                                <input
                                    value={product.slug}
                                    onChange={(e) => updateField("slug", e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm font-mono font-medium border-none focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <Layers className="h-3 w-3" /> Danh mục
                                </label>
                                <select
                                    value={product.category || ""}
                                    onChange={(e) => updateField("category", e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-blue-500 mt-1"
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {CATEGORIES.map((c) => (
                                        <option key={c.slug} value={c.slug}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> Giá gốc hiển thị
                                </label>
                                <input
                                    value={product.originalPrice}
                                    onChange={(e) => updateField("originalPrice", e.target.value)}
                                    placeholder="520.000 VNĐ"
                                    className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm font-medium border-none focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Mô tả ngắn
                        </label>
                        <input
                            value={product.shortDesc}
                            onChange={(e) => updateField("shortDesc", e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-blue-500 mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Mô tả chi tiết
                        </label>
                        <textarea
                            value={product.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm font-normal border-none focus:ring-2 focus:ring-blue-500 resize-none mt-1"
                        />
                    </div>

                    {/* Plans */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <Package className="h-3 w-3" /> Gói dịch vụ ({product.plans.length} gói)
                            </h4>
                            <button
                                onClick={addPlan}
                                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                            >
                                <Plus className="h-3.5 w-3.5" /> Thêm gói
                            </button>
                        </div>
                        <div className="space-y-2">
                            {product.plans.map((plan, i) => (
                                <PlanRow
                                    key={plan.id}
                                    plan={plan}
                                    onChange={(field, value) => updatePlan(i, field, value)}
                                    onDelete={() => deletePlan(i)}
                                />
                            ))}
                        </div>
                    </div>



                    {/* Product Article Editor */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                            <FileText className="h-3 w-3" /> Bài viết chi tiết (HTML)
                        </label>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            {/* Toolbar */}
                            <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                                <button
                                    onClick={() => updateField("productArticle", (product.productArticle || "") + "<h2>Tiêu đề mục</h2>\n")}
                                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Tiêu đề H2"
                                >
                                    <Heading2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => updateField("productArticle", (product.productArticle || "") + "<h3>Tiêu đề nhỏ</h3>\n")}
                                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Tiêu đề H3"
                                >
                                    <Heading3 className="h-4 w-4" />
                                </button>
                                <div className="w-px h-4 bg-gray-300 mx-1" />
                                <button
                                    onClick={() => updateField("productArticle", (product.productArticle || "") + "<strong>In đậm</strong>")}
                                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="In đậm"
                                >
                                    <Bold className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => updateField("productArticle", (product.productArticle || "") + "<em>In nghiêng</em>")}
                                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="In nghiêng"
                                >
                                    <Italic className="h-4 w-4" />
                                </button>
                                <div className="w-px h-4 bg-gray-300 mx-1" />
                                <button
                                    onClick={() => updateField("productArticle", (product.productArticle || "") + "<ul>\n  <li>Mục 1</li>\n  <li>Mục 2</li>\n</ul>\n")}
                                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Danh sách"
                                >
                                    <List className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => updateField("productArticle", (product.productArticle || "") + '<img src="/images/ten-anh.png" alt="Mô tả" class="w-full rounded-xl my-4" />\n')}
                                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Chèn ảnh"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <textarea
                                value={product.productArticle || ""}
                                onChange={(e) => updateField("productArticle", e.target.value)}
                                rows={10}
                                placeholder="Nhập nội dung bài viết dạng HTML..."
                                className="w-full px-4 py-3 text-sm font-mono text-gray-800 border-none focus:ring-0 resize-y"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                            Hỗ trợ HTML tags: h2, h3, p, ul, li, strong, em, img...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────
export default function ProductsAdminPage() {
    const [config, setConfig] = useState<ProductsConfig>(defaultProductsConfig);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProductsConfig().then((data) => {
            setConfig(data);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const success = await saveProductsConfigToServer(config);
        setSaving(false);
        if (success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } else {
            alert("Lưu thất bại! Vui lòng thử lại.");
        }
    };

    const handleReset = async () => {
        if (!confirm("Khôi phục tất cả sản phẩm về mặc định?")) return;
        setConfig({ ...defaultProductsConfig });
        await saveProductsConfigToServer(defaultProductsConfig);
    };

    const updateProduct = (index: number, updated: ProductConfig) => {
        const newProducts = [...config.products];
        newProducts[index] = updated;
        setConfig({ ...config, products: newProducts });
    };

    const deleteProduct = (index: number) => {
        if (!confirm(`Xóa sản phẩm "${config.products[index].name}"?`)) return;
        const newProducts = config.products.filter((_, i) => i !== index);
        setConfig({ ...config, products: newProducts });
    };

    const addProduct = () => {
        setConfig({
            ...config,
            products: [...config.products, createEmptyProduct()],
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-50">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Quản lý sản phẩm</h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Thêm, sửa, xóa sản phẩm và quản lý gói dịch vụ
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Mặc định
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={cn(
                            "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm",
                            saved
                                ? "bg-emerald-600 text-white"
                                : saving
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                        )}
                    >
                        {saved ? (
                            <><CheckCircle2 className="h-4 w-4" /> Đã lưu!</>
                        ) : saving ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...</>
                        ) : (
                            <><Save className="h-4 w-4" /> Lưu thay đổi</>
                        )}
                    </button>
                </div>
            </div>

            {/* Products list */}
            <div className="space-y-3">
                {config.products.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onChange={(updated) => updateProduct(index, updated)}
                        onDelete={() => deleteProduct(index)}
                    />
                ))}
            </div>

            {/* Add product button */}
            <button
                onClick={addProduct}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/50 text-gray-500 hover:text-blue-600 font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
                <Plus className="h-5 w-5" />
                Thêm sản phẩm mới
            </button>
        </div>
    );
}
