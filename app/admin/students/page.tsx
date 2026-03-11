"use client";

import { useState, useEffect } from "react";
import {
    Table,
    Card,
    Typography,
    Tag,
    Button,
    Input,
    Select,
    Modal,
    Form,
    message,
    Space,
    Tooltip
} from "antd";
import {
    SearchOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    MailOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { fetchProductsConfig, ProductConfig } from "@/lib/product-config";

const { Title, Text } = Typography;

interface StudentRequest {
    id: string;
    fullName: string;
    email: string;
    studentId: string;
    school: string;
    status: string;
    adminNote: string | null;
    createdAt: string;
}

export default function AdminStudentRequestsPage() {
    const [requests, setRequests] = useState<StudentRequest[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Modal Approve
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null);
    const [approveForm] = Form.useForm();
    const [isSubmittingApprove, setIsSubmittingApprove] = useState(false);

    // Modal Reject
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectForm] = Form.useForm();
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    // Products List for Approve Modal
    const [products, setProducts] = useState<ProductConfig[]>([]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "ALL") params.append("status", statusFilter);
            if (searchText) params.append("search", searchText);

            const res = await fetch(`/api/admin/students?${params.toString()}`);
            if (!res.ok) throw new Error("Lỗi tải dữ liệu");
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            message.error("Lỗi khi tải danh sách sinh viên");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // debounce calls mapping to typing
        const handler = setTimeout(() => {
            fetchRequests();
        }, 300);
        return () => clearTimeout(handler);
    }, [searchText, statusFilter]);

    useEffect(() => {
        // Load products once for selection
        fetchProductsConfig().then(config => {
            if (config && config.products) {
                setProducts(config.products);
            }
        });
    }, []);

    // Handle Approve
    const handleApprove = async () => {
        try {
            const values = await approveForm.validateFields();
            setIsSubmittingApprove(true);

            const res = await fetch(`/api/admin/students/${selectedRequest?.id}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminNote: values.adminNote
                })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Lỗi phê duyệt");

            message.success(data.message || "Đã duyệt và tự động gửi mã");
            setIsApproveModalOpen(false);
            approveForm.resetFields();
            fetchRequests();
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setIsSubmittingApprove(false);
        }
    };

    // Handle Reject
    const handleReject = async () => {
        try {
            const values = await rejectForm.validateFields();
            setIsSubmittingReject(true);

            const res = await fetch(`/api/admin/students/${selectedRequest?.id}/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminNote: values.adminNote })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Lỗi từ chối");

            message.success(data.message || "Đã từ chối đơn");
            setIsRejectModalOpen(false);
            rejectForm.resetFields();
            fetchRequests();
        } catch (error: any) {
            if (error.name === 'ValidationError') return; // form empty block
            message.error(error.message);
        } finally {
            setIsSubmittingReject(false);
        }
    };

    // Handle Resend Email
    const handleResend = async (request: StudentRequest) => {
        try {
            message.loading({ content: 'Đang gửi lại email...', key: 'resendMessage' });
            const res = await fetch(`/api/admin/students/${request.id}/resend`, {
                method: "POST"
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            message.success({ content: data.message, key: 'resendMessage', duration: 3 });
        } catch (error: any) {
            message.error({ content: error.message, key: 'resendMessage', duration: 4 });
        }
    };

    const columns = [
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: string) => {
                const colors: Record<string, string> = {
                    pending: "gold",
                    approved: "green",
                    rejected: "red"
                };
                const labels: Record<string, string> = {
                    pending: "Chờ duyệt",
                    approved: "Đã cấp mã",
                    rejected: "Từ chối"
                };
                return <Tag color={colors[status] || "default"}>{labels[status] || status.toUpperCase()}</Tag>;
            }
        },
        {
            title: "Sinh viên",
            key: "student",
            render: (record: StudentRequest) => (
                <div>
                    <div className="font-bold text-gray-800">{record.fullName}</div>
                    <div className="text-gray-500 text-xs">{record.email}</div>
                </div>
            )
        },
        {
            title: "Thông tin thẻ",
            key: "school",
            render: (record: StudentRequest) => (
                <div>
                    <div><Text strong>Trường:</Text> {record.school}</div>
                    <div><Text strong>MSSV:</Text> {record.studentId}</div>
                </div>
            )
        },
        {
            title: "Ngày gửi",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => new Date(date).toLocaleString('vi-VN')
        },
        {
            title: "Ghi chú",
            dataIndex: "adminNote",
            key: "adminNote",
            render: (note: string) => note || <Text type="secondary" italic>Không có</Text>
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center" as const,
            render: (record: StudentRequest) => (
                <Space size="small">
                    {record.status === "pending" && (
                        <>
                            <Tooltip title="Duyệt & Tạo Mã">
                                <Button
                                    type="primary"
                                    icon={<CheckCircleOutlined />}
                                    size="small"
                                    onClick={() => {
                                        setSelectedRequest(record);
                                        setIsApproveModalOpen(true);
                                    }}
                                >
                                    Duyệt
                                </Button>
                            </Tooltip>
                            <Tooltip title="Từ chối">
                                <Button
                                    danger
                                    icon={<CloseCircleOutlined />}
                                    size="small"
                                    onClick={() => {
                                        setSelectedRequest(record);
                                        setIsRejectModalOpen(true);
                                    }}
                                >
                                    Từ chối
                                </Button>
                            </Tooltip>
                        </>
                    )}
                    {record.status === "approved" && (
                        <Tooltip title="Gửi lại Email mã Code">
                            <Button
                                icon={<MailOutlined />}
                                size="small"
                                onClick={() => handleResend(record)}
                            >
                                Gửi lại Code
                            </Button>
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Title level={4} style={{ margin: 0 }}>Quản lý Xác nhận Sinh viên</Title>
                <Button icon={<ReloadOutlined />} onClick={fetchRequests} loading={loading}>
                    Làm mới
                </Button>
            </div>

            <Card className="shadow-sm">
                <div className="flex flex-wrap gap-4 mb-6">
                    <Input
                        placeholder="Tìm kiếm Email, MSSV, Tên..."
                        className="w-full md:w-64"
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        allowClear
                    />
                    <Select
                        className="w-full md:w-40"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { value: "ALL", label: "Tất cả trạng thái" },
                            { value: "pending", label: "Chờ duyệt" },
                            { value: "approved", label: "Đã duyệt" },
                            { value: "rejected", label: "Từ chối" },
                        ]}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={requests}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 15 }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            {/* Modal Approve */}
            <Modal
                title="Phê duyệt Xác nhận Sinh viên"
                open={isApproveModalOpen}
                onOk={handleApprove}
                confirmLoading={isSubmittingApprove}
                onCancel={() => {
                    setIsApproveModalOpen(false);
                    approveForm.resetFields();
                }}
                okText="Duyệt & Gửi Mã"
                cancelText="Hủy"
            >
                <div className="mb-4 text-gray-600 bg-blue-50 p-3 rounded-md">
                    Hệ thống sẽ tự động tạo một mã ưu đãi áp dụng toàn bộ sản phẩm ngẫu nhiên (VD: SV-X8FGH) và gửi email hướng dẫn cho <b>{selectedRequest?.email}</b>.
                </div>
                <Form form={approveForm} layout="vertical">
                    <Form.Item name="adminNote" label="Ghi chú nội bộ (Không gửi cho KH)">
                        <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Reject */}
            <Modal
                title={<span className="text-red-600">Từ chối Đơn đăng ký</span>}
                open={isRejectModalOpen}
                onOk={handleReject}
                confirmLoading={isSubmittingReject}
                onCancel={() => {
                    setIsRejectModalOpen(false);
                    rejectForm.resetFields();
                }}
                okText="Xác nhận Từ chối"
                okButtonProps={{ danger: true }}
                cancelText="Hủy"
            >
                <Form form={rejectForm} layout="vertical">
                    <Form.Item
                        name="adminNote"
                        label="Lý do từ chối (Bắt buộc)"
                        rules={[{ required: true, message: "Vui lòng nhập lý do từ chối để sinh viên biết lý do." }]}
                    >
                        <Input.TextArea rows={3} placeholder="VD: Hình ảnh thẻ mờ, Thẻ đã hết hạn..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
