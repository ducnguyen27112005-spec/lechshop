"use client";

import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Row, Col, Badge, Progress, Button, message, Space, Spin, Typography } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { formatCurrency } from "@/lib/utils";

const { Title, Text } = Typography;

interface SocialOrder {
    id: string;
    code: string;
    customerName: string;
    targetUrl: string;
    serviceName: string;
    quantity: number;
    totalAmount: number;
    system_status: "pending" | "running" | "completed" | "failed";
    start_time?: string;
    completed_time?: string;
    expected_duration?: number;
    createdAt: string;
}

export default function SocialOrdersPage() {
    const [orders, setOrders] = useState<SocialOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/social-orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                message.error("Không thể tải danh sách đơn hàng");
            }
        } catch (error) {
            message.error("Lỗi kết nối khi tải đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/admin/social-orders/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ system_status: newStatus }),
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                setOrders(orders.map(o => o.id === id ? { ...o, ...updatedOrder } : o));
                message.success("Cập nhật trạng thái thành công");
            } else {
                message.error("Không thể cập nhật trạng thái");
            }
        } catch (error) {
            message.error("Lỗi kết nối khi cập nhật");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusTag = (status: string) => {
        switch (status) {
            case "pending": return <Tag color="gold" icon={<ClockCircleOutlined />}>Đang xử lý</Tag>;
            case "running": return <Tag color="blue" icon={<SyncOutlined spin />}>Đang chạy</Tag>;
            case "completed": return <Tag color="green" icon={<CheckCircleOutlined />}>Đã hoàn tất</Tag>;
            case "failed": return <Tag color="red" icon={<ExclamationCircleOutlined />}>Lỗi</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    const calculateProgress = (order: SocialOrder) => {
        if (order.system_status === "completed") return 100;
        if (order.system_status !== "running" || !order.start_time || !order.expected_duration) return 0;

        const start = new Date(order.start_time).getTime();
        const now = new Date().getTime();
        const elapsedMinutes = (now - start) / (1000 * 60);

        const percent = Math.min(Math.floor((elapsedMinutes / order.expected_duration) * 100), 99);
        return percent > 0 ? percent : 1;
    };

    const columns = [
        {
            title: "Mã Đơn",
            dataIndex: "code",
            key: "code",
            render: (text: string) => <Text strong code>{text}</Text>,
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customerName",
        },
        {
            title: "Dịch vụ",
            dataIndex: "serviceName",
            key: "serviceName",
            render: (text: string, record: SocialOrder) => (
                <div>
                    <div>{text}</div>
                    <Text type="secondary" className="text-xs">SL: {record.quantity}</Text>
                </div>
            )
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (val: number) => formatCurrency(val || 0),
        },
        {
            title: "Trạng thái",
            dataIndex: "system_status",
            key: "system_status",
            render: (status: string) => getStatusTag(status),
            filters: [
                { text: 'Đang xử lý', value: 'pending' },
                { text: 'Đang chạy', value: 'running' },
                { text: 'Đã hoàn tất', value: 'completed' },
                { text: 'Lỗi', value: 'failed' },
            ],
            onFilter: (value: any, record: SocialOrder) => record.system_status === value,
        },
    ];

    const expandedRowRender = (record: SocialOrder) => {
        const isUpdating = updatingId === record.id;

        return (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ margin: "-16px", padding: "24px" }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card title="Tiến độ đơn hàng" size="small" variant="borderless" className="shadow-sm">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <Badge
                                        status={
                                            record.system_status === 'completed' ? 'success' :
                                                record.system_status === 'running' ? 'processing' :
                                                    record.system_status === 'failed' ? 'error' : 'warning'
                                        }
                                    />
                                    <Text strong className="text-lg uppercase">
                                        {record.system_status === 'pending' && "Đang xử lý"}
                                        {record.system_status === 'running' && "Đang chạy"}
                                        {record.system_status === 'completed' && "Đã hoàn tất"}
                                        {record.system_status === 'failed' && "Lỗi"}
                                    </Text>
                                </div>

                                {record.system_status === "pending" && (
                                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <Spin size="small" />
                                        <span>Đang tạo đơn bên nhà cung cấp...</span>
                                    </div>
                                )}

                                {record.system_status === "running" && (
                                    <div>
                                        <div className="flex justify-between mb-1 text-xs text-gray-500">
                                            <span>Bắt đầu chạy</span>
                                            <span>Dự kiến {record.expected_duration} phút</span>
                                        </div>
                                        <Progress percent={calculateProgress(record)} status="active" />
                                    </div>
                                )}

                                {record.system_status === "completed" && (
                                    <Progress percent={100} />
                                )}

                                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                    {record.start_time && (
                                        <div>
                                            <Text type="secondary" className="block text-xs uppercase mb-1">Thời gian bắt đầu</Text>
                                            <Text strong>{new Date(record.start_time).toLocaleString()}</Text>
                                        </div>
                                    )}
                                    {record.completed_time && (
                                        <div>
                                            <Text type="secondary" className="block text-xs uppercase mb-1">Thời gian hoàn tất</Text>
                                            <Text strong>{new Date(record.completed_time).toLocaleString()}</Text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Thao tác Admin" size="small" variant="borderless" className="shadow-sm border-t-4 border-t-blue-500 h-full">
                            <div className="flex flex-col gap-3">
                                <div className="mb-2">
                                    <Text type="secondary" className="block text-xs uppercase mb-1">Link nhiệm vụ</Text>
                                    <a href={record.targetUrl.startsWith('http') ? record.targetUrl : `https://${record.targetUrl}`} target="_blank" rel="noreferrer" className="font-bold block truncate text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
                                        {record.targetUrl}
                                    </a>
                                </div>
                                <Space direction="vertical" className="w-full">
                                    <Button
                                        block
                                        type="primary"
                                        ghost
                                        disabled={record.system_status === 'running' || isUpdating}
                                        loading={isUpdating && record.system_status !== 'running'}
                                        onClick={() => handleUpdateStatus(record.id, "running")}
                                        icon={<SyncOutlined />}
                                    >
                                        Chuyển sang Đang chạy
                                    </Button>
                                    <Button
                                        block
                                        type="primary"
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={record.system_status === 'completed' || isUpdating}
                                        loading={isUpdating && record.system_status !== 'completed'}
                                        onClick={() => handleUpdateStatus(record.id, "completed")}
                                        icon={<CheckCircleOutlined />}
                                    >
                                        Đánh dấu hoàn tất
                                    </Button>
                                    <Button
                                        block
                                        danger
                                        disabled={record.system_status === 'failed' || isUpdating}
                                        loading={isUpdating && record.system_status !== 'failed'}
                                        onClick={() => handleUpdateStatus(record.id, "failed")}
                                        icon={<ExclamationCircleOutlined />}
                                    >
                                        Báo lỗi
                                    </Button>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <Title level={2} className="!mb-1">Đơn hàng Social (Ant Design)</Title>
                <Text type="secondary">Hệ thống quản lý trạng thái đơn hàng chuyên nghiệp cho dịch vụ Social</Text>
            </div>

            <Card variant="borderless" className="shadow-sm rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    expandable={{ expandedRowRender }}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                />
            </Card>
        </div>
    );
}
