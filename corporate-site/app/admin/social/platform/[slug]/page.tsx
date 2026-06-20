"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Plus, Edit, Trash, X, Save, ChevronDown, ChevronRight,
    Package, Settings2, Loader2, ArrowLeft, GripVertical
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Plan {
    id: string;
    serviceId: string;
    code: string;
    name: string;
    pricePerUnit: number;
    currency: string;
    min: number;
    max: number;
    tags: string | null;
    description: string | null;
    isActive: boolean;
}

interface Service {
    id: string;
    categoryId: string;
    title: string;
    slug: string;
    shortDescription: string;
    targetType: string;
    unitLabel: string;
    coverImageUrl: string;
    sortOrder: number;
    isActive: boolean;
    plans: Plan[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function PlatformDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

    // Service form state
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [serviceForm, setServiceForm] = useState({
        title: "", slug: "", shortDescription: "", targetType: "video",
        unitLabel: "lượt", sortOrder: 0, isActive: true
    });

    // Plan form state
    const [showPlanForm, setShowPlanForm] = useState<string | null>(null); // serviceId
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [planForm, setPlanForm] = useState({
        code: "", name: "", pricePerUnit: 0, currency: "VND",
        min: 50, max: 50000, description: "", isActive: true
    });

    useEffect(() => {
        fetchData();
    }, [slug]);

    async function fetchData() {
        setLoading(true);
        try {
            // Fetch categories to find the one matching our slug
            const catRes = await fetch("/api/admin/social/categories");
            const categories: Category[] = await catRes.json();
            const cat = categories.find(c => c.slug === slug);
            if (!cat) {
                toast.error("Không tìm thấy danh mục");
                return;
            }
            setCategory(cat);

            // Fetch services for this category (with plans)
            const svcRes = await fetch('/api/admin/social/services?categoryId=' + cat.id);
            const svcs = await svcRes.json();

            // Fetch plans for each service
            const servicesWithPlans = await Promise.all(
                svcs.map(async (svc: Service) => {
                    const planRes = await fetch('/api/admin/social/plans?serviceId=' + svc.id);
                    const plans = await planRes.json();
                    return { ...svc, plans: Array.isArray(plans) ? plans : [] };
                })
            );

            setServices(servicesWithPlans);
        } catch {
            toast.error("Lỗi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }

    // ---- SERVICE CRUD ----
    function openAddService() {
        setEditingService(null);
        setServiceForm({
            title: "", slug: "", shortDescription: "", targetType: "video",
            unitLabel: "lượt", sortOrder: services.length, isActive: true
        });
        setShowServiceForm(true);
    }

    function openEditService(svc: Service) {
        setEditingService(svc);
        setServiceForm({
            title: svc.title, slug: svc.slug, shortDescription: svc.shortDescription,
            targetType: svc.targetType, unitLabel: svc.unitLabel,
            sortOrder: svc.sortOrder, isActive: svc.isActive
        });
        setShowServiceForm(true);
    }

    async function handleSaveService(e: React.FormEvent) {
        e.preventDefault();
        if (!category) return;

        try {
            if (editingService) {
                await fetch('/api/admin/social/services/' + editingService.id, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...serviceForm, categoryId: category.id })
                });
                toast.success("Đã cập nhật dịch vụ");
            } else {
                await fetch("/api/admin/social/services", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...serviceForm, categoryId: category.id })
                });
                toast.success("Đã thêm dịch vụ mới");
            }
            setShowServiceForm(false);
            fetchData();
        } catch {
            toast.error("Lỗi lưu dịch vụ");
        }
    }

    async function handleDeleteService(id: string) {
        if (!confirm("Bạn có chắc muốn xóa dịch vụ này? Tất cả gói dịch vụ bên trong cũng sẽ bị xóa.")) return;
        try {
            await fetch('/api/admin/social/services/' + id, { method: "DELETE" });
            toast.success("Đã xóa dịch vụ");
            fetchData();
        } catch {
            toast.error("Lỗi xóa dịch vụ");
        }
    }

    // ---- PLAN CRUD ----
    function openAddPlan(serviceId: string) {
        setEditingPlan(null);
        setPlanForm({
            code: "", name: "", pricePerUnit: 0, currency: "VND",
            min: 1, max: 1000, description: "", isActive: true
        });
        setShowPlanForm(serviceId);
    }

    function openEditPlan(plan: Plan) {
        setEditingPlan(plan);
        setPlanForm({
            code: plan.code, name: plan.name, pricePerUnit: plan.pricePerUnit,
            currency: plan.currency, min: plan.min, max: plan.max,
            description: plan.description || "", isActive: plan.isActive
        });
        setShowPlanForm(plan.serviceId);
    }

    async function handleSavePlan(e: React.FormEvent, serviceId: string) {
        e.preventDefault();
        try {
            if (editingPlan) {
                await fetch('/api/admin/social/plans/' + editingPlan.id, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(planForm)
                });
                toast.success("Đã cập nhật gói dịch vụ");
            } else {
                await fetch("/api/admin/social/plans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...planForm, serviceId })
                });
                toast.success("Đã thêm gói dịch vụ mới");
            }
            setShowPlanForm(null);
            setEditingPlan(null);
            fetchData();
        } catch {
            toast.error("Lỗi lưu gói dịch vụ");
        }
    }

    async function handleDeletePlan(id: string) {
        if (!confirm("Bạn có chắc muốn xóa gói dịch vụ này?")) return;
        try {
            await fetch('/api/admin/social/plans/' + id, { method: "DELETE" });
            toast.success("Đã xóa gói dịch vụ");
            fetchData();
        } catch {
            toast.error("Lỗi xóa gói dịch vụ");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const renderPlanForm = (serviceId: string) => (
        <div className="bg-gray-800 rounded-xl p-4 my-3 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all">
            <form onSubmit={(e) => handleSavePlan(e, serviceId)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Mã gói</label>
                        <input
                            value={planForm.code}
                            onChange={e => setPlanForm(f => ({ ...f, code: e.target.value }))}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-xs border border-gray-600 focus:border-blue-500 outline-none"
                            required placeholder="VD: sv1"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Giá/đơn vị</label>
                        <input
                            type="number" step="0.01"
                            value={planForm.pricePerUnit}
                            onChange={e => setPlanForm(f => ({ ...f, pricePerUnit: e.target.value as any }))}
                            onFocus={e => e.target.select()}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-xs border border-gray-600 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Tên gói (hiển thị)</label>
                    <input
                        value={planForm.name}
                        onChange={e => setPlanForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-xs border border-gray-600 focus:border-blue-500 outline-none"
                        required placeholder="Tên đầy đủ của gói dịch vụ"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Min</label>
                        <input
                            type="number"
                            value={planForm.min}
                            onChange={e => setPlanForm(f => ({ ...f, min: e.target.value as any }))}
                            onFocus={e => e.target.select()}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-xs border border-gray-600 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Max</label>
                        <input
                            type="number"
                            value={planForm.max}
                            onChange={e => setPlanForm(f => ({ ...f, max: e.target.value as any }))}
                            onFocus={e => e.target.select()}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-xs border border-gray-600 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Mô tả chi tiết</label>
                    <textarea
                        rows={3}
                        value={planForm.description}
                        onChange={e => setPlanForm(f => ({ ...f, description: e.target.value }))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-xs border border-gray-600 focus:border-blue-500 outline-none resize-none"
                        placeholder="Thông tin máy chủ, mô tả chi tiết..."
                    />
                </div>
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-gray-300">
                        <input
                            type="checkbox"
                            checked={planForm.isActive}
                            onChange={e => setPlanForm(f => ({ ...f, isActive: e.target.checked }))}
                            className="rounded"
                        />
                        Kích hoạt
                    </label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => { setShowPlanForm(null); setEditingPlan(null); }}
                            className="px-4 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg border border-gray-600 transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                            <Save className="h-3 w-3" />
                            {editingPlan ? "Cập nhật" : "Thêm"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{category?.name}</h1>
                        <p className="text-sm text-gray-400">{services.length} dịch vụ</p>
                    </div>
                </div>
                <button
                    onClick={openAddService}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Thêm dịch vụ
                </button>
            </div>

            {/* Service Form Modal */}
            {showServiceForm && (
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">
                            {editingService ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}
                        </h3>
                        <button onClick={() => setShowServiceForm(false)} className="text-gray-400 hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSaveService} className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">Tên dịch vụ</label>
                            <input
                                value={serviceForm.title}
                                onChange={e => setServiceForm(f => ({ ...f, title: e.target.value }))}
                                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-blue-500 outline-none"
                                required
                                placeholder="VD: Tăng Lượt Xem Video"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">Slug (URL)</label>
                            <input
                                value={serviceForm.slug}
                                onChange={e => setServiceForm(f => ({ ...f, slug: e.target.value }))}
                                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-blue-500 outline-none"
                                required
                                placeholder="VD: tiktok-view"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-400 mb-1">Mô tả ngắn</label>
                            <input
                                value={serviceForm.shortDescription || ""}
                                onChange={e => setServiceForm(f => ({ ...f, shortDescription: e.target.value }))}
                                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-blue-500 outline-none"
                                placeholder="Mô tả ngắn về dịch vụ"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">Loại mục tiêu</label>
                            <select
                                value={serviceForm.targetType}
                                onChange={e => setServiceForm(f => ({ ...f, targetType: e.target.value }))}
                                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 outline-none"
                            >
                                <option value="video">Video</option>
                                <option value="profile">Profile</option>
                                <option value="livestream">Livestream</option>
                                <option value="uid_or_link">UID/Link</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">Thứ tự</label>
                            <input
                                type="number"
                                value={serviceForm.sortOrder}
                                onChange={e => setServiceForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="col-span-2 flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={serviceForm.isActive}
                                    onChange={e => setServiceForm(f => ({ ...f, isActive: e.target.checked }))}
                                    className="rounded"
                                />
                                Kích hoạt
                            </label>
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
                            >
                                <Save className="h-4 w-4" />
                                {editingService ? "Cập nhật" : "Thêm mới"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Services List */}
            {services.length === 0 ? (
                <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700">
                    <Package className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">Chưa có dịch vụ nào trong danh mục này.</p>
                    <button onClick={openAddService} className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-bold">
                        + Thêm dịch vụ đầu tiên
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {services.map((svc) => {
                        const isExpanded = expandedServiceId === svc.id;
                        return (
                            <div key={svc.id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                                {/* Service Header */}
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                                    onClick={() => setExpandedServiceId(isExpanded ? null : svc.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            svc.isActive ? "bg-green-400" : "bg-red-400"
                                        )} />
                                        <div>
                                            <h3 className="font-bold text-white text-sm">{svc.title}</h3>
                                            <p className="text-xs text-gray-400">
                                                /{svc.slug} · {svc.plans.length} gói dịch vụ
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditService(svc); }}
                                            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteService(svc.id); }}
                                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                        {isExpanded
                                            ? <ChevronDown className="h-4 w-4 text-gray-400" />
                                            : <ChevronRight className="h-4 w-4 text-gray-400" />
                                        }
                                    </div>
                                </div>

                                {/* Expanded Plans Section */}
                                {isExpanded && (
                                    <div className="border-t border-gray-700 bg-gray-900/50">
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                                    Gói dịch vụ (Máy chủ)
                                                </h4>
                                                <button
                                                    onClick={() => openAddPlan(svc.id)}
                                                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold"
                                                >
                                                    <Plus className="h-3 w-3" /> Thêm gói
                                                </button>
                                            </div>

                                            {/* Plan Form - Adds New */}
                                            {showPlanForm === svc.id && !editingPlan && renderPlanForm(svc.id)}

                                            {/* Plans List */}
                                            {svc.plans.length === 0 ? (
                                                <p className="text-xs text-gray-500 text-center py-4">
                                                    Chưa có gói dịch vụ nào.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {svc.plans.map((plan, idx) => (
                                                        <React.Fragment key={plan.id}>
                                                            {editingPlan?.id === plan.id ? renderPlanForm(svc.id) : (
                                                                <div
                                                                    className="flex items-start justify-between gap-3 bg-gray-800 rounded-xl p-3 border border-gray-700 hover:border-gray-600 transition-all"
                                                                >
                                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md whitespace-nowrap mt-0.5">
                                                                            MC-{idx + 1}
                                                                        </span>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-medium text-white truncate">{plan.name}</p>
                                                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                                                                <span className="text-red-400 font-bold">{plan.pricePerUnit}đ</span>
                                                                                <span>Min: {plan.min.toLocaleString()}</span>
                                                                                <span>Max: {plan.max.toLocaleString()}</span>
                                                                                <span className="text-gray-500">Mã: {plan.code}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 shrink-0">
                                                                        <div className={cn(
                                                                            "w-2 h-2 rounded-full mr-1",
                                                                            plan.isActive ? "bg-green-400" : "bg-red-400"
                                                                        )} />
                                                                        <button
                                                                            onClick={() => openEditPlan(plan)}
                                                                            className="p-1 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-all"
                                                                        >
                                                                            <Edit className="h-3.5 w-3.5" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeletePlan(plan.id)}
                                                                            className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-all"
                                                                        >
                                                                            <Trash className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
