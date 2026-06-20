"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import Link from "next/link";

import { CheckCircle2, ArrowRight, Clock, Copy } from "lucide-react";

import { Suspense } from "react";

function SuccessPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderCode = searchParams.get("code");
    const amount = searchParams.get("amount");

    // QR Code generation
    const BANK_ID = "TCB"; // Techcombank
    const ACCOUNT_NO = "467116771167";
    const TEMPLATE = "compact2"; // Standard compact template

    // Safer unique content:
    // User requested "STK + Mã đơn", example: STK7296
    const transferContent = orderCode ? `STK${orderCode.replace(/[^a-zA-Z0-9]/g, '').replace('ORD', '')}` : "";

    // Construct URL with encodeURIComponent for safety
    // Uses img.vietqr.io with standard template
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?addInfo=${encodeURIComponent(transferContent)}&amount=${amount}`;

    // Countdown Timer State (15 minutes in seconds)
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(transferContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        // Exit early if timer is finished
        if (timeLeft <= 0) {
            router.push("/thanh-toan");
            return;
        }

        // Set up the interval
        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        // Clean up
        return () => clearInterval(timerId);
    }, [timeLeft, router]);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className="py-12 bg-gray-50 min-h-screen flex items-center justify-center">
            <Container>
                <div className="max-w-md mx-auto bg-white rounded-[24px] shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-6 sm:p-8 text-center">
                        {/* Success Icon */}
                        <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-7 w-7 text-green-600" />
                        </div>
                        
                        <h1 className="text-xl font-bold text-gray-900 mb-1">Đặt hàng thành công!</h1>
                        <p className="text-gray-500 text-sm mb-6">Mã đơn hàng: <span className="font-bold text-gray-900">#{orderCode}</span></p>

                        {/* Timer */}
                        <div className="bg-red-50/80 rounded-xl p-3 inline-flex flex-col items-center gap-1 mb-6 border border-red-100 min-w-[160px]">
                            <p className="text-xs text-red-600 font-medium">Vui lòng thanh toán trong</p>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-red-600" />
                                <span className="text-red-600 font-bold text-xl tracking-widest">{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        {/* QR Code Area */}
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent rounded-3xl -z-10"></div>
                            <p className="text-sm text-gray-500 mb-1">Quét mã để chuyển tiền đến</p>
                            <h2 className="text-lg font-bold text-gray-900">NGUYỄN MINH ĐỨC</h2>
                            <div className="flex items-center justify-center gap-2 mb-5 mt-1">
                                <span className="font-bold text-gray-600 tracking-wider">4671 1677 1167</span>
                            </div>

                            <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 inline-block mx-auto relative group">
                                <div className="absolute inset-0 bg-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img
                                    src={qrUrl}
                                    alt="VietQR Payment"
                                    width={320}
                                    height={320}
                                    className="block mx-auto"
                                    style={{ width: '100%', maxWidth: '260px', height: 'auto' }}
                                />
                            </div>
                        </div>

                        {/* Amount & Content */}
                        <div className="space-y-3 bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6 text-left">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200/60 border-dashed">
                                <span className="text-sm text-gray-500">Số tiền</span>
                                <span className="font-bold text-red-600 text-lg">{parseInt(amount || '0').toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Nội dung CK</span>
                                <button
                                    onClick={handleCopy}
                                    title="Sao chép nội dung"
                                    className="flex items-center gap-2 font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors active:scale-95"
                                >
                                    <span>{transferContent}</span>
                                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 mb-6">
                            <p className="text-[13px] text-gray-600 font-medium">
                                *Mã <span className="font-bold text-blue-600">{transferContent}</span> cũng là mã dùng để <Link href="/tra-cuu-don-hang" className="text-blue-600 underline hover:text-blue-800">tra cứu đơn hàng</Link>.
                            </p>
                            <p className="text-[13px] text-gray-400 italic">
                                *Hệ thống tự động xác nhận trong 1-5 phút.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href="/"
                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3.5 px-4 rounded-xl text-sm text-center transition-colors border border-gray-200"
                            >
                                Về trang chủ
                            </Link>
                            <Link
                                href="/tra-cuu-don-hang"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                Xem đơn hàng
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SuccessPageContent />
        </Suspense>
    );
}
