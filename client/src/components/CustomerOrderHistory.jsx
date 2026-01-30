import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Table, Tag, Typography, Button, Empty, Spin, Alert } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CustomerOrderHistory = ({ user, open, onCancel }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Reset và tải lại dữ liệu mỗi khi mở Modal
    useEffect(() => {
        if (open) {
            setOrders([]); // 1. Xóa sạch dữ liệu cũ trước
            
            if (user && user.id) {
                // 2. Nếu là Thành viên -> Tải lịch sử
                fetchMyOrders();
            } else {
                // 3. Nếu là Khách vãng lai -> Không làm gì (hoặc hiện thông báo)
                setLoading(false);
            }
        }
    }, [open, user]);

    const fetchMyOrders = async () => {
        setLoading(true);
        try {
            // Gọi API lấy đơn hàng của user.id hiện tại
            const res = await axios.get(`/api/orders/my-orders/${user.id}`);
            // Sắp xếp đơn mới nhất lên đầu
            const sortedData = res.data.sort((a, b) => b.id - a.id);
            setOrders(sortedData);
        } catch (error) {
            console.error("Lỗi tải lịch sử:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Mã Đơn',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <b>#{text}</b>,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date) => (
                <span>
                    <ClockCircleOutlined style={{ marginRight: 5, color: '#888' }} />
                    {date ? new Date(date).toLocaleString('vi-VN') : 'Vừa xong'}
                </span>
            ),
        },
        {
            title: 'Món ăn',
            key: 'items',
            render: (_, record) => (
                <ul style={{ paddingLeft: 15, margin: 0, fontSize: 13 }}>
                    {record.items && record.items.map((item, idx) => (
                        <li key={idx}>
                            <b>{item.quantity}</b> x {item.product ? item.product.name : item.name}
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => <Text type="danger" strong>{amount ? amount.toLocaleString() : 0} đ</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                let text = status;
                if (status === 'PENDING') { color = 'gold'; text = 'Chờ xác nhận'; }
                else if (status === 'PROCESSING') { color = 'blue'; text = 'Đang làm'; }
                else if (status === 'COMPLETED') { color = 'green'; text = 'Đã xong'; }
                else if (status === 'PAID') { color = 'purple'; text = 'Đã thanh toán'; }
                else if (status === 'CANCELLED') { color = 'red'; text = 'Đã hủy'; }
                return <Tag color={color}>{text}</Tag>;
            }
        }
    ];

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>📜 Lịch sử đơn hàng</span>
                    {/* Hiển thị đang xem lịch sử của ai */}
                    {user?.fullName && <Tag color="blue"><UserOutlined /> {user.fullName}</Tag>}
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={[<Button key="close" onClick={onCancel}>Đóng</Button>]}
            width={850}
            centered
        >
            {/* Trường hợp KHÁCH VÃNG LAI (Không có ID) */}
            {(!user || !user.id) ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        description={<span style={{fontSize: 16}}>Khách vãng lai không lưu lịch sử đơn hàng.</span>} 
                    />
                    <Alert 
                        message="Mẹo: Hãy đăng nhập để theo dõi đơn hàng của bạn!" 
                        type="info" 
                        showIcon 
                        style={{ maxWidth: 400, margin: '20px auto' }}
                    />
                </div>
            ) : (
                /* Trường hợp CÓ TÀI KHOẢN */
                <>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" tip="Đang tải..." /></div>
                    ) : orders.length === 0 ? (
                        <Empty description="Bạn chưa có đơn hàng nào" />
                    ) : (
                        <Table 
                            columns={columns} 
                            dataSource={orders} 
                            rowKey="id" 
                            pagination={{ pageSize: 5 }} 
                            size="small"
                        />
                    )}
                </>
            )}
        </Modal>
    );
};

export default CustomerOrderHistory;