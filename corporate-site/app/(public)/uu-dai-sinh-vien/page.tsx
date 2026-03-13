"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "@/components/shared/Container";
import { GraduationCap, CheckCircle, Gift, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Form, Input, Button, Card, Typography, Checkbox, message, Space, Result, Alert } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function StudentDiscountPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await fetch("/api/student/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: values.fullName,
                    email: values.email,
                    studentId: values.studentId,
                    school: values.school
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                // Return 409 means email exists
                if (res.status === 409) {
                    message.warning(data.error || "Email này đã gửi yêu cầu. Vui lòng kiểm tra lại hòm thư.");
                    return;
                }
                throw new Error(data.error || "Có lỗi xảy ra khi gửi yêu cầu.");
            }

            setIsSuccess(true);
            form.resetFields();
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-16 pt-8">
            <Container>
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-8 md:p-12 text-white mb-10 overflow-hidden relative shadow-lg">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                        <svg width="400" height="400" viewBox="0 0 100 100">
                            <path fill="currentColor" d="M0 0 L50 100 L100 0 Z"></path>
                        </svg>
                    </div>

                    <div className="max-w-2xl relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold mb-6 border border-white/20">
                            <GraduationCap className="h-4 w-4" />
                            <span>Chương trình Hỗ trợ Giáo dục</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
                            Ưu Đãi Đặc Quyền <br className="hidden md:block" /> Dành Cho Sinh Viên
                        </h1>
                        <p className="text-blue-100 text-lg md:text-xl font-medium mb-8 max-w-xl">
                            Khám phá tiềm năng số và rèn luyện kỹ năng thực chiến. Giảm ngay 15% cho tất cả các gói dịch vụ phần mềm.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-start">
                    {/* Left: Info */}
                    <div className="md:col-span-5 space-y-6">
                        <Card className="rounded-2xl border-none shadow-sm h-full" styles={{ body: { padding: '2rem' } }}>
                            <Title level={4} style={{ marginTop: 0, fontWeight: 800 }}>Làm sao để nhận ưu đãi?</Title>
                            <Paragraph className="text-gray-600 mb-6">
                                Hệ thống tự động xét duyệt và cấp mã giảm giá cá nhân thông qua Form xác nhận thông tin thẻ sinh viên hợp lệ.
                            </Paragraph>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">1. Điền thông tin</h4>
                                        <p className="text-sm text-gray-500 mt-1">Sử dụng Email trường cấp (.edu.vn) hoặc Email cá nhân kèm Mã số Sinh viên chính xác.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">2. Xét duyệt siêu tốc</h4>
                                        <p className="text-sm text-gray-500 mt-1">Đội ngũ hoặc hệ thống sẽ xem xét Yêu cầu trong tối đa 24h làm việc.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                        <Gift className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">3. Nhận Code 15%</h4>
                                        <p className="text-sm text-gray-500 mt-1">Mã khuyên mãi sẽ được gửi vào Email. Bạn áp dụng ở trang Giỏ hàng/Thanh toán.</p>
                                    </div>
                                </div>
                            </div>

                                <Alert
                                    title="Điều khoản sử dụng:"
                                description={
                                    <ul className="list-disc pl-4 mt-2 space-y-1 text-sm text-gray-600">
                                        <li>Mỗi Email/MSSV chỉ nhận được 1 mã giảm giá.</li>
                                        <li>Mã bị vô hiệu hóa khi mua nhiều gói cùng lúc (Tránh đầu cơ).</li>
                                        <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác.</li>
                                    </ul>
                                }
                                type="info"
                                showIcon
                                className="mt-8 rounded-xl bg-gray-50 border-gray-200"
                            />
                        </Card>
                    </div>

                    {/* Right: Form */}
                    <div className="md:col-span-7">
                        <Card className="rounded-2xl border border-gray-100 shadow-xl overflow-hidden" styles={{ body: { padding: 0 } }}>
                            <div className="bg-gray-900 px-6 py-5 text-white flex items-center gap-3">
                                <GraduationCap className="h-6 w-6 text-blue-400" />
                                <h3 className="text-lg font-bold m-0">Đăng ký Xác nhận Sinh Viên</h3>
                            </div>

                            <div className="p-6 md:p-8 bg-white">
                                {isSuccess ? (
                                    <Result
                                        status="success"
                                        title={<span className="font-black text-2xl">Yêu cầu đã được gửi!</span>}
                                        subTitle={<span className="text-gray-500">Chúng tôi đã nhận được thông tin. Mã giảm giá sẽ được gửi qua email sau khi yêu cầu được duyệt. Vui lòng kiểm tra email của bạn (bao gồm cả thư mục Spam/Quảng cáo).</span>}
                                        extra={[
                                            <Button type="primary" size="large" key="home" href="/" className="font-bold rounded-lg px-8">
                                                Về Trang Chủ
                                            </Button>,
                                            <Button size="large" key="buy" href="/dich-vu" className="font-bold rounded-lg px-8">
                                                Xem Dịch Vụ
                                            </Button>,
                                        ]}
                                    />
                                ) : (
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={onFinish}
                                        requiredMark={false}
                                        size="large"
                                    >
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <Form.Item
                                                name="fullName"
                                                label={<span className="font-bold text-gray-700">Họ và tên</span>}
                                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                            >
                                                <Input placeholder="Nguyễn Văn A" className="rounded-lg" />
                                            </Form.Item>

                                            <Form.Item
                                                name="email"
                                                label={<span className="font-bold text-gray-700">Địa chỉ Email</span>}
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập email' },
                                                    { type: 'email', message: 'Email không hợp lệ' }
                                                ]}
                                            >
                                                <Input placeholder="SV_abc@student.edu.vn" className="rounded-lg" />
                                            </Form.Item>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <Form.Item
                                                name="studentId"
                                                label={<span className="font-bold text-gray-700">Mã Số Sinh Viên (MSSV)</span>}
                                                rules={[{ required: true, message: 'Vui lòng nhập Mã số sinh viên' }]}
                                            >
                                                <Input placeholder="VD: 20210001" className="rounded-lg" />
                                            </Form.Item>
                                        </div>

                                        <Form.Item
                                            name="school"
                                            label={<span className="font-bold text-gray-700">Trường Đại học/Cao đẳng</span>}
                                            rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
                                        >
                                            <Input placeholder="VD: Đại học Bách Khoa Hà Nội" className="rounded-lg" />
                                        </Form.Item>

                                        <Form.Item
                                            name="agreement"
                                            valuePropName="checked"
                                            rules={[
                                                { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Vui lòng đồng ý với điều khoản') }
                                            ]}
                                            className="mt-2"
                                        >
                                            <Checkbox>
                                                <span className="text-gray-500 text-sm">
                                                    Tôi cam kết các thông tin khai báo trên là chính xác và đồng ý với các quy định sử dụng mã ưu đãi của hệ thống.
                                                </span>
                                            </Checkbox>
                                        </Form.Item>

                                        <Form.Item className="mb-0 mt-6">
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                                className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all"
                                                icon={!loading && <ArrowRight className="h-4 w-4" />}
                                            >
                                                {loading ? 'Đang gửi Hệ thống...' : 'Gửi Yêu Cầu Nhận Mã'}
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
}
