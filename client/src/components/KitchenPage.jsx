import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Card, Row, Col, Button, Tag, Typography, message, Spin, Empty, Badge } from "antd";
import { FireOutlined, CheckCircleOutlined, SyncOutlined, LogoutOutlined, UserOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const KitchenPage = ({ onLogout }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
        // Tự động làm mới mỗi 10 giây
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/orders");
            let data = [];
            if (Array.isArray(res.data)) data = res.data;
            else if (res.data && Array.isArray(res.data.content)) data = res.data.content;

            // Chỉ lấy các đơn hàng Bếp cần làm: ĐÃ THANH TOÁN (PAID) hoặc ĐANG NẤU (PROCESSING)
            const kitchenOrders = data.filter(order => 
                order.status === 'PAID' || order.status === 'PROCESSING'
            );

            // Sắp xếp: Đơn cũ nhất lên đầu (FIFO - Vào trước nấu trước)
            const sortedOrders = kitchenOrders.sort((a, b) => a.id - b.id);
            
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Lỗi tải đơn bếp:", error);
            // Không show message lỗi liên tục tránh phiền
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            message.success(newStatus === 'PROCESSING' ? "Đã nhận đơn nấu!" : "Đã báo xong món!");
            fetchOrders(); // Làm mới ngay
        } catch (error) {
            message.error("Lỗi cập nhật trạng thái!");
        }
    };

    // Hàm tính thời gian chờ (Ví dụ: 10 phút trước)
    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        const now = new Date();
        const created = new Date(dateString);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins} phút trước`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours} giờ trước`;
    };

    return (
        <Layout style={{ minHeight: "100vh", background: "#1f1f1f" }}>
            {/* Header tối màu cho Bếp */}
            <Header style={{ background: "#000", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <FireOutlined style={{ fontSize: 24, color: '#f5222d' }} />
                    <Title level={3} style={{ margin: 0, color: "#fff" }}>BẾP & CHẾ BIẾN</Title>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <Tag color="gold" style={{ padding: '5px 10px', fontSize: 14 }}>
                        Chờ nấu: {orders.filter(o => o.status === 'PAID').length}
                    </Tag>
                    <Tag color="blue" style={{ padding: '5px 10px', fontSize: 14 }}>
                        Đang nấu: {orders.filter(o => o.status === 'PROCESSING').length}
                    </Tag>
                    <Button icon={<SyncOutlined spin={loading} />} onClick={fetchOrders}>Làm mới</Button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <UserOutlined /> Đầu Bếp
                        </div>
                        <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogout}>Đăng xuất</Button>
                    </div>
                </div>
            </Header>

            <Content style={{ padding: "24px", overflowY: "auto" }}>
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: 100 }}>
                        <Empty description={<span style={{ color: '#fff' }}>Hiện không có đơn hàng nào cần nấu</span>} />
                    </div>
                ) : (
                    <Row gutter={[16, 16]}>
                        {orders.map((order) => {
                            // 👇 QUAN TRỌNG: Lấy đúng biến orderDetails từ Backend
                            // Nếu backend trả về orderDetails thì dùng nó, nếu không thử items, nếu không thì mảng rỗng
                            const items = order.orderDetails || order.items || [];

                            return (
                                <Col xs={24} sm={12} md={8} lg={6} key={order.id}>
                                    <Badge.Ribbon 
                                        text={order.status === 'PAID' ? 'MỚI' : 'ĐANG NẤU'} 
                                        color={order.status === 'PAID' ? 'red' : 'blue'}
                                    >
                                        <Card 
                                            title={<span style={{ fontSize: 18 }}>#{order.id} - {order.customerName}</span>}
                                            extra={<span style={{ fontSize: 12, color: '#888' }}><ClockCircleOutlined /> {getTimeAgo(order.createdAt)}</span>}
                                            style={{ 
                                                borderRadius: 8, 
                                                border: order.status === 'PAID' ? '2px solid #ffa39e' : '2px solid #91caff',
                                                background: '#fff'
                                            }}
                                            headStyle={{ background: order.status === 'PAID' ? '#fff1f0' : '#e6f7ff' }}
                                            bodyStyle={{ padding: 12 }}
                                        >
                                            {/* Danh sách món ăn */}
                                            <div style={{ minHeight: 150, marginBottom: 15 }}>
                                                {items.length > 0 ? (
                                                    items.map((item, idx) => {
                                                        // Xử lý tên món và số lượng từ OrderDetail
                                                        const productName = item.product ? item.product.name : item.name;
                                                        const qty = item.quantity || item.qty;
                                                        return (
                                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '1px dashed #eee', fontSize: 16 }}>
                                                                <Text strong>{productName}</Text>
                                                                <Tag color="orange" style={{ fontSize: 16, fontWeight: 'bold' }}>x{qty}</Tag>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div style={{ textAlign: 'center', color: 'red', padding: 20 }}>
                                                        Lỗi: Không tìm thấy chi tiết món (orderDetails trống)
                                                    </div>
                                                )}
                                            </div>

                                            {/* Nút hành động */}
                                            {order.status === 'PAID' && (
                                                <Button 
                                                    type="primary" block size="large" 
                                                    icon={<FireOutlined />} 
                                                    onClick={() => updateStatus(order.id, 'PROCESSING')}
                                                >
                                                    NHẬN ĐƠN & NẤU
                                                </Button>
                                            )}

                                            {order.status === 'PROCESSING' && (
                                                <Button 
                                                    type="primary" block size="large" 
                                                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                                    icon={<CheckCircleOutlined />} 
                                                    onClick={() => updateStatus(order.id, 'COMPLETED')}
                                                >
                                                    XONG MÓN
                                                </Button>
                                            )}
                                        </Card>
                                    </Badge.Ribbon>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Content>
        </Layout>
    );
};

export default KitchenPage;