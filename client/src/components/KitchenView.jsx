import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button, Tag, Typography, message, Badge } from 'antd';
// Thêm icon LogoutOutlined vào dòng import
import { FireOutlined, CheckOutlined, ReloadOutlined, LogoutOutlined } from '@ant-design/icons';

const { Title } = Typography;

// 1. Nhận prop onLogout ở đây
const KitchenView = ({ onLogout }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8081/api/orders/pending');
            setOrders(res.data);
        } catch (error) {
            console.error("Lỗi kết nối bếp:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); 
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:8081/api/orders/${orderId}/status?status=${newStatus}`);
            message.success(`Đơn #${orderId} chuyển sang: ${newStatus}`);
            fetchOrders();
        } catch (error) {
            message.error("Lỗi cập nhật trạng thái!");
        }
    };

    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const preparingOrders = orders.filter(o => o.status === 'PREPARING');

    const OrderCard = ({ order, type }) => (
        <Badge.Ribbon text={`#${order.id}`} color={type === 'PENDING' ? 'red' : 'orange'}>
            <Card 
                style={{ marginBottom: 16, border: type === 'PENDING' ? '1px solid #ffa39e' : '1px solid #ffd591' }}
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                        {order.user ? <Tag color="blue">{order.user.fullName}</Tag> : <Tag>Khách lẻ</Tag>}
                    </div>
                }
                actions={[
                    type === 'PENDING' ? (
                        <Button type="primary" block icon={<FireOutlined />} onClick={() => updateStatus(order.id, 'PREPARING')}>
                            BẮT ĐẦU NẤU
                        </Button>
                    ) : (
                        <Button type="primary" block style={{ background: '#52c41a', borderColor: '#52c41a' }} icon={<CheckOutlined />} onClick={() => updateStatus(order.id, 'COMPLETED')}>
                            HOÀN TẤT
                        </Button>
                    )
                ]}
            >
                <div style={{ minHeight: '100px' }}>
                    {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '16px', borderBottom: '1px dashed #eee', paddingBottom: 4 }}>
                            <span style={{ fontWeight: 500 }}>{item.product.name}</span>
                            <span style={{ fontWeight: 'bold', color: '#cf1322' }}>x{item.quantity}</span>
                        </div>
                    ))}
                </div>
                {type === 'PREPARING' && <div style={{ marginTop: 10, textAlign: 'center', color: '#fa8c16' }}><FireOutlined spin /> Đang chế biến...</div>}
            </Card>
        </Badge.Ribbon>
    );

    return (
        <div style={{ padding: 20, background: '#141414', minHeight: '100vh', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>👨‍🍳 BẾP TRUNG TÂM</Title>
                
                {/* 2. Thêm khu vực nút bấm bên phải */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading}>Làm mới</Button>
                    
                    {/* Nút Đăng xuất mới */}
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogout}>
                        Đăng xuất
                    </Button>
                </div>
            </div>

            <Row gutter={24}>
                <Col span={12} style={{ borderRight: '1px dashed #444' }}>
                    <div style={{ textAlign: 'center', marginBottom: 20, padding: 10, background: '#434343', borderRadius: 8 }}>
                        <Title level={3} style={{ color: '#ff7875', margin: 0 }}>CHỜ CHẾ BIẾN ({pendingOrders.length})</Title>
                    </div>
                    {pendingOrders.map(order => (
                        <OrderCard key={order.id} order={order} type="PENDING" />
                    ))}
                    {pendingOrders.length === 0 && <div style={{ textAlign: 'center', color: '#666', marginTop: 50 }}>Không có đơn mới</div>}
                </Col>

                <Col span={12}>
                    <div style={{ textAlign: 'center', marginBottom: 20, padding: 10, background: '#434343', borderRadius: 8 }}>
                        <Title level={3} style={{ color: '#faad14', margin: 0 }}>ĐANG THỰC HIỆN ({preparingOrders.length})</Title>
                    </div>
                    {preparingOrders.map(order => (
                        <OrderCard key={order.id} order={order} type="PREPARING" />
                    ))}
                    {preparingOrders.length === 0 && <div style={{ textAlign: 'center', color: '#666', marginTop: 50 }}>Bếp đang rảnh tay</div>}
                </Col>
            </Row>
        </div>
    );
};

export default KitchenView;