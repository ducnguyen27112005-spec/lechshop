"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this or I'll use standard textarea
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Plan {
    id: string;
    code: string;
    name: string;
    pricePerUnit: number;
    currency: string;
    min: number;
    max: number;
    description: string | null;
    isActive?: boolean;
}

interface Service {
    title: string;
    slug: string;
    targetType: string; // 'video' | 'profile' | 'livestream' | 'uid_or_link'
    unitLabel: string;
    plans: Plan[];
}

interface SocialOrderFormProps {
    service: Service;
    onSuccess: () => void;
}

const FACEBOOK_REACTIONS = [
    { id: "like", label: "Thích", img: "/reactions/like.svg" },
    { id: "love", label: "Yêu thích", img: "/reactions/love.svg" },
    { id: "care", label: "Thương thương", img: "/reactions/care.png" },
    { id: "haha", label: "Haha", img: "/reactions/haha.png" },
    { id: "wow", label: "Wow", img: "/reactions/wow.png" },
    { id: "sad", label: "Buồn", img: "/reactions/sad.png" },
    { id: "angry", label: "Phẫn nộ", img: "/reactions/angry.png" },
];

export function SocialOrderForm({ service, onSuccess }: SocialOrderFormProps) {
    const [targetUrl, setTargetUrl] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    // Initialize with first ACTIVE plan ID if available
    const [selectedPlanId, setSelectedPlanId] = useState<string>(service.plans.find(p => p.isActive !== false)?.id || "");
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedReactions, setSelectedReactions] = useState<string[]>(["like"]);
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [scheduledTime, setScheduledTime] = useState("");
    const [multiMode, setMultiMode] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const hasPlans = service.plans.length > 0;
    // Don't fallback to first plan automatically for calculation if deselected
    const selectedPlan = service.plans.find(p => p.id === selectedPlanId) || null;

    // Show reaction selector for Facebook like services (not comment-likes)
    // ONLY if the plan name indicates it supports reactions
    const isFacebookLikeService = service.slug.includes("facebook-like") && !service.slug.includes("like-comment");
    const planSupportsReactions = selectedPlan
        ? (selectedPlan.name.toLowerCase().includes("cảm xúc") ||
            selectedPlan.name.toLowerCase().includes("cam xuc") ||
            selectedPlan.name.toLowerCase().includes("reaction"))
        : false;
    const showReactionSelector = isFacebookLikeService && planSupportsReactions;

    // Calculate generic total (for display only, real calc on server)
    const pricePerUnit = selectedPlan ? selectedPlan.pricePerUnit : 0;
    const linkCount = multiMode ? targetUrl.split('\n').filter(line => line.trim()).length : 1;
    const estimatedTotal = pricePerUnit * (quantity || 0) * linkCount;

    const toggleReaction = (reactionId: string) => {
        setSelectedReactions(prev => {
            if (prev.includes(reactionId)) {
                // Don't allow deselecting all
                if (prev.length === 1) return prev;
                return prev.filter(r => r !== reactionId);
            }
            return [...prev, reactionId];
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!targetUrl) {
            toast.error("Vui lòng nhập đường dẫn/ID.");
            return;
        }

        if (hasPlans) {
            if (!selectedPlan) {
                toast.error("Vui lòng chọn gói dịch vụ.");
                return;
            }
            if (quantity < selectedPlan.min || quantity > selectedPlan.max) {
                toast.error(`Số lượng phải từ ${selectedPlan.min} đến ${selectedPlan.max}.`);
                return;
            }
        }

        if (showReactionSelector && selectedReactions.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 cảm xúc.");
            return;
        }

        // Show confirmation modal
        setShowConfirm(true);
    };

    const confirmPayment = async () => {
        setIsSubmitting(true);

        try {
            const reactionNote = showReactionSelector
                ? `[Cảm xúc: ${selectedReactions.map(r => FACEBOOK_REACTIONS.find(fr => fr.id === r)?.label).join(", ")}]`
                : "";

            const scheduleNote = scheduleEnabled && scheduledTime
                ? `[Đặt lịch: ${new Date(scheduledTime).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}]`
                : "";

            const payload = {
                serviceSlug: service.slug,
                targetUrl,
                quantity: quantity || 0,
                selectedPlanCode: selectedPlan?.code || null,
                customerNote: [reactionNote, scheduleNote, note].filter(Boolean).join(" ").trim(),
                ...(showReactionSelector && { reactions: selectedReactions }),
                ...(scheduleEnabled && scheduledTime && { scheduledAt: scheduledTime }),
            };

            const res = await fetch("/api/social/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(errorData || "Có lỗi xảy ra.");
            }

            const data = await res.json();
            toast.success(`Đã tạo đơn hàng thành công: ${data.code}`);

            // Reset form
            setTargetUrl("");
            setQuantity(0);
            setNote("");
            setSelectedReactions(["like"]);
            setScheduleEnabled(false);
            setScheduledTime("");
            setShowConfirm(false);

            // Redirect to payment screen
            router.push(`/thanh-toan/thanh-cong?code=${data.code}&amount=${estimatedTotal}`);
        } catch (error: any) {
            toast.error(error.message || "Không thể tạo đơn hàng.");
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Target URL/ID */}
            <div className="space-y-2">
                <Label htmlFor="targetUrl" className="text-xs font-bold text-gray-700">
                    {multiMode ? "Nhập Link hoặc UID Của Bài Viết, Video:" : "Nhập Link Video:"}
                </Label>
                {multiMode ? (
                    <Textarea
                        id="targetUrl"
                        placeholder="Nhập nhiều link, mỗi link 1 dòng"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 rounded px-3 py-2 text-xs resize-y"
                        disabled={isSubmitting}
                    />
                ) : (
                    <Input
                        id="targetUrl"
                        placeholder="Nhập Link Video cần mua"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="h-10 border-gray-300 focus:border-blue-500 rounded px-3 text-xs"
                        disabled={isSubmitting}
                    />
                )}
            </div>

            {/* Toggle: Buy Multiple */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => { setMultiMode(!multiMode); setTargetUrl(""); }}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${multiMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${multiMode ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-xs font-medium text-gray-900">Mua Nhiều Đơn Cùng Lúc ~ Chọn Trước Khi Nhập Danh Sách Link</span>
            </div>

            {/* 2. PLANS SELECTION (Only if has plans) */}
            {hasPlans ? (
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-700">Chọn máy chủ:</Label>
                    <div className="space-y-3">
                        {service.plans.map((plan, index) => {
                            const isSelected = selectedPlanId === plan.id;
                            const isPlanActive = plan.isActive !== false; // Active by default if missing

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative transition-all duration-200 ${isPlanActive ? 'cursor-pointer hover:bg-gray-50' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                                    onClick={() => {
                                        if (isPlanActive) {
                                            setSelectedPlanId(isSelected ? "" : plan.id);
                                        }
                                    }}
                                >
                                    {/* Unselected State / Always visible summary */}
                                    <div className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${isSelected ? 'bg-gray-50' : ''}`}>
                                        <div className="mt-1">
                                            {/* Radio Button */}
                                            <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center bg-white`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                                            </div>
                                        </div>
                                        <div className="text-xs flex-1">
                                            <div className="font-bold text-gray-800">
                                                <span className="bg-[#dff0d8] text-[#3c763d] px-1 rounded text-[10px] py-0.5 mr-2 font-bold border border-[#d6e9c6]">MC-{index + 1}</span>
                                                {plan.name} <span className="text-orange-500">🔥🔥🔥</span>
                                                <span className="text-blue-500 ml-2 font-normal font-bold">- {plan.pricePerUnit}đ/1 {service.unitLabel}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected State (Gradient Box) */}
                                    {isSelected && (
                                        <div className="rounded-xl overflow-hidden shadow-lg transform transition-all">
                                            {/* Gradient Background */}
                                            <div className="bg-gradient-to-r from-[#e06c75] to-[#c678dd] text-white p-5 relative">
                                                <div className="pl-8">
                                                    {plan.description ? (
                                                        <div className="text-sm leading-relaxed whitespace-pre-line">
                                                            {plan.description}
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="font-bold text-lg mb-1 leading-snug">
                                                                {plan.name} <span className="ml-1">🔥🔥🔥</span>
                                                            </div>
                                                            <div className="text-center my-3 text-xs font-medium opacity-90">
                                                                MÃ GÓI: {plan.code}
                                                            </div>
                                                            <div className="text-xs mb-3 font-medium">
                                                                - Min - Max: {plan.min} - {plan.max?.toLocaleString()}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Dịch vụ này hiện chưa có bảng giá tự động.
                </div>
            )}

            {/* REACTION SELECTOR (Facebook Like services only) */}
            {showReactionSelector && (
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-700">Cảm xúc:</Label>
                    <div className="flex flex-wrap gap-2">
                        {FACEBOOK_REACTIONS.map(reaction => {
                            const isActive = selectedReactions.includes(reaction.id);
                            return (
                                <div key={reaction.id} className="flex flex-col items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleReaction(reaction.id)}
                                        className="flex flex-col items-center gap-0.5 p-1 transition-all duration-200 hover:scale-110"
                                        title={reaction.label}
                                    >
                                        <img src={reaction.img} alt={reaction.label} className="w-10 h-10" />
                                    </button>
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={() => toggleReaction(reaction.id)}
                                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-gray-400">
                        Chọn một hoặc nhiều cảm xúc. Hệ thống sẽ phân bổ ngẫu nhiên theo các cảm xúc đã chọn.
                    </p>
                </div>
            )}

            {/* 3. QUANTITY & TOTAL */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-xs font-bold text-gray-700">
                        Số lượng: ({selectedPlan?.min || 0} ~ {selectedPlan?.max || 0})
                    </Label>
                    <Input
                        id="quantity"
                        type="number"
                        min={selectedPlan?.min || 1}
                        max={selectedPlan?.max}
                        placeholder={selectedPlan?.min?.toString() || "100"}
                        value={quantity || ""}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        className="h-10 border-gray-300 focus:border-blue-500 rounded px-3 text-xs"
                        disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700">
                        Số tiền mỗi tương tác:
                    </Label>
                    <Input
                        value={`${pricePerUnit.toLocaleString('vi-VN')} đ`}
                        disabled
                        className="h-10 bg-gray-50 border-gray-300 rounded px-3 text-xs text-gray-500"
                    />
                </div>
            </div>

            {/* 4. NOTE */}
            <div className="space-y-2">
                <Label htmlFor="note" className="text-xs font-bold text-gray-700">Ghi chú:</Label>
                <Textarea
                    id="note"
                    placeholder="Nhập ghi chú nếu cần"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={isSubmitting}
                    className="h-20 border-gray-300 focus:border-blue-500 rounded px-3 text-xs resize-none"
                />
            </div>

            {/* Toggles */}
            <div className="space-y-3">
                {/* Đặt lịch chạy */}
                <div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => { setScheduleEnabled(!scheduleEnabled); if (scheduleEnabled) setScheduledTime(""); }}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${scheduleEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${scheduleEnabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                        </button>
                        <span className="text-xs font-medium text-gray-700">Đặt lịch chạy <span className="text-[10px] text-gray-500">Múi giờ: +07:00 ~ Kiểm tra quá trình ở mục tiến trình đơn hàng</span></span>
                    </div>
                    {scheduleEnabled && (
                        <div className="mt-3 space-y-1">
                            <Label className="text-xs text-gray-600">Chọn thời gian</Label>
                            <Input
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="h-10 border-gray-300 focus:border-blue-500 rounded px-3 text-xs"
                                disabled={isSubmitting}
                            />
                        </div>
                    )}
                </div>

            </div>

            {/* 5. SUMMARY & SUBMIT */}
            <div className="space-y-4 pt-2">
                <div className="bg-[#5bc0de] text-white p-4 rounded text-center">
                    <div className="text-lg font-bold">Tổng thanh toán: <span className="text-red-600">{estimatedTotal.toLocaleString('vi-VN')}₫</span></div>
                    <div className="text-xs font-bold mt-1">
                        Bạn sẽ tăng <span className="text-red-600">{quantity || 0}</span> số lượng với giá <span className="text-red-600">{pricePerUnit.toLocaleString('vi-VN')} đ</span>
                        {multiMode && linkCount > 0 && <> x <span className="text-red-600">{linkCount}</span> link</>}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-10 text-base font-bold bg-[#5bc0de] hover:bg-[#46b8da] text-white rounded"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        hasPlans ? "Tạo đơn hàng" : "Gửi yêu cầu"
                    )}
                </Button>
            </div>

            {/* CONFIRMATION MODAL */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setShowConfirm(false)}
                            disabled={isSubmitting}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className="w-20 h-20 rounded-full border-4 border-orange-200 flex items-center justify-center mb-4 text-orange-400">
                                <span className="text-5xl font-black mb-1">!</span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-700 mb-3">Xác nhận thanh toán ?</h3>
                            <p className="text-gray-600 font-medium mb-2 text-[15px]">
                                Bạn sẽ tăng <span className="text-red-500 font-bold">{quantity || 0}</span> số lượng với giá <span className="text-red-500 font-bold">{pricePerUnit.toLocaleString('vi-VN')} đ</span>
                            </p>
                            <p className="text-red-600 font-bold text-lg mb-6">
                                Tổng thanh toán: {estimatedTotal.toLocaleString('vi-VN')} VNĐ
                            </p>

                            <div className="flex gap-4 w-full justify-center">
                                <button
                                    type="button"
                                    onClick={confirmPayment}
                                    disabled={isSubmitting}
                                    className="bg-[#7b75df] hover:bg-[#6861d8] text-white rounded-full px-8 py-2.5 font-bold transition-colors disabled:opacity-70 flex items-center justify-center min-w-[140px] shadow-sm"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Thanh toán"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(false)}
                                    disabled={isSubmitting}
                                    className="bg-[#e43f3f] hover:bg-[#d43232] text-white rounded-full px-8 py-2.5 font-bold transition-colors disabled:opacity-70 shadow-sm"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}

