"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Clock } from "lucide-react";

import { Suspense } from "react";

function SuccessPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderCode = searchParams.get("code");
    const amount = searchParams.get("amount");

    // QR Code generation
    const BANK_ID = "TCB"; // Techcombank
    const ACCOUNT_NO = "111666777868";
    const TEMPLATE = "compact"; // Standard compact template

    // Safer unique content:
    // User requested "STK + Mã đơn", example: STK7296
    const transferContent = orderCode ? `STK${orderCode.replace(/[^a-zA-Z0-9]/g, '').replace('ORD', '')}` : "";

    // Construct URL with encodeURIComponent for safety
    // Uses img.vietqr.io with standard template
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?addInfo=${encodeURIComponent(transferContent)}&amount=${amount}`;

    // Countdown Timer State (15 minutes in seconds)
    const [timeLeft, setTimeLeft] = useState(15 * 60);

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
        <section className="py-12 bg-gray-50 min-h-screen">
            <Container>
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-green-600 p-8 text-center text-white">
                        <CheckCircle2 className="h-20 w-20 mx-auto mb-4 text-green-100" />
                        <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
                        <p className="text-green-100">Cảm ơn bạn đã mua sắm tại LechShop</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Order Info */}
                        <div className="text-center">
                            <p className="text-gray-500 mb-1">Mã đơn hàng của bạn</p>
                            <div className="text-2xl font-bold text-gray-900 bg-gray-100 py-2 px-4 rounded-lg inline-block">
                                #{orderCode}
                            </div>
                        </div>

                        {/* Payment Instruction */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-blue-900 mb-6 text-center uppercase">Thanh toán chuyển khoản</h3>

                            <div className="flex flex-col items-center gap-8">
                                {/* Countdown Timer Display */}
                                <div className="text-center space-y-1">
                                    <p className="text-sm text-red-600 font-medium animate-pulse">
                                        Vui lòng thanh toán trong
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-red-600">
                                        <Clock className="h-6 w-6" />
                                        <span>{formatTime(timeLeft)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Đơn hàng sẽ tự động hủy nếu không thanh toán
                                    </p>
                                </div>

                                {/* QR Code Section - Centered and Large */}
                                {/* White background padding is critical for scanning */}
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 inline-block mx-auto">
                                    <Image
                                        src={qrUrl}
                                        alt="VietQR Payment"
                                        width={400}
                                        height={400}
                                        className="block mx-auto"
                                        style={{ width: '100%', maxWidth: '350px', height: 'auto' }}
                                        unoptimized // Critical for external standard quality
                                        priority
                                    />
                                </div>

                                <div className="space-y-3 w-full max-w-md">
                                    <div className="flex justify-between border-b border-blue-200 border-dashed pb-2">
                                        <span className="text-gray-600">Ngân hàng</span>
                                        <span className="font-bold text-gray-900">Techcombank</span>
                                    </div>
                                    <div className="flex justify-between border-b border-blue-200 border-dashed pb-2">
                                        <span className="text-gray-600">Số tài khoản</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-gray-900 tracking-wider">1116 6677 7868</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between border-b border-blue-200 border-dashed pb-2">
                                        <span className="text-gray-600">Chủ tài khoản</span>
                                        <span className="font-bold text-gray-900 uppercase">ĐẶNG GIA PHÚ</span>
                                    </div>
                                    <div className="flex justify-between border-b border-blue-200 border-dashed pb-2">
                                        <span className="text-gray-600">Số tiền</span>
                                        <span className="font-bold text-red-600 text-xl">{parseInt(amount || '0').toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between border-b border-blue-200 border-dashed pb-2">
                                        <span className="text-gray-600">Nội dung CK</span>
                                        <span className="font-bold text-blue-600">{transferContent}</span>
                                    </div>

                                    <p className="text-sm text-center text-blue-800 italic mt-4">
                                        *Vui lòng nhập đúng Nội dung chuyển khoản để hệ thống tự động kích hoạt
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0 mt-0.5">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p className="font-bold text-gray-900 mb-1">Lưu ý quan trọng:</p>
                                    <p>Sau khi bạn chuyển khoản thành công, hệ thống sẽ tự động xác nhận và gửi thông tin dịch vụ qua email bạn đã đăng ký. Quá trình này thường mất từ 1-5 phút.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/"
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg text-center transition-colors"
                            >
                                Về trang chủ
                            </Link>
                            <Link
                                href="/search/order"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                            >
                                Xem lại đơn hàng
                                <ArrowRight className="h-5 w-5" />
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
