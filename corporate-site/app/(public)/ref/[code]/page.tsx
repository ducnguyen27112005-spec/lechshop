"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ReferralRedirectPage() {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        // Luân lưu mã giới thiệu vào localStorage để dùng sau này (ví dụ khi thanh toán hoặc đăng ký)
        if (params?.code) {
            localStorage.setItem("referralCode", params.code as string);
            // Có thể cân nhắc lưu thêm vào cookie nếu cần SSR (vd: document.cookie = `referralCode=${params.code}; path=/; max-age=2592000`;)
        }

        // Chuyển hướng người dùng về trang chủ sau 1.2s để họ kịp thấy màn hình loading
        const timeout = setTimeout(() => {
            router.push("/");
        }, 1200);

        return () => clearTimeout(timeout);
    }, [params, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
            <div className="text-center flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h1 className="text-xl font-bold text-gray-900 mb-2">Đang xử lý lời mời...</h1>
                <p className="text-gray-500 text-sm">Vui lòng đợi trong giây lát, chúng tôi đang chuyển hướng bạn.</p>
            </div>
        </div>
    );
}
