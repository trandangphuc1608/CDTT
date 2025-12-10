import React, { useEffect, useState, useRef } from 'react';
import { Modal, Table, Tag, Button, Tooltip, message } from 'antd';
import { EyeOutlined, PrinterOutlined, HistoryOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { Invoice } from './Invoice'; // Import hóa đơn vừa tạo

const CustomerOrderHistory = ({ user, open, onCancel }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    
    // Ref cho in ấn
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    useEffect(() => {
        if (user && open) {
            fetchMyOrders();
        }
    }, [user, open]);

    const fetchMyOrders = async () => {
        try {
            // Lưu ý: Đảm bảo user.id tồn tại
            const res = await axios.get(`http://localhost:8081/api/orders/my-orders/${user.id}`);
            setOrders(res.data);
        } catch (error) {
            message.error("Không thể tải lịch sử đơn hàng");
        }
    };

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    };

    const columns = [
        { title: 'Mã Đơn', dataIndex: 'id', render: t => <b>#{t}</b> },
        { title: 'Ngày đặt', dataIndex: 'createdAt', render: t => new Date(t).toLocaleDateString() },
        { title: 'Tổng tiền', dataIndex: 'totalAmount', render: t => <span style={{color:'red', fontWeight:'bold'}}>{t?.toLocaleString()} đ</span> },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            render: t => {
                let color = t === 'COMPLETED' ? 'green' : (t === 'PENDING' ? 'orange' : 'blue');
                return <Tag color={color}>{t}</Tag>
            }
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Tooltip title="Xem chi tiết & In">
                        <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <>
            {/* Modal Danh sách đơn hàng */}
            <Modal 
                title={<span><HistoryOutlined /> Lịch sử đơn hàng của bạn</span>}
                open={open} 
                onCancel={onCancel}
                width={800}
                footer={null}
            >
                <Table 
                    dataSource={orders} 
                    columns={columns} 
                    rowKey="id" 
                    pagination={{ pageSize: 5 }} 
                />
            </Modal>

            {/* Modal Chi tiết đơn hàng & In */}
            <Modal
                title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailOpen(false)}>Đóng</Button>,
                    <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                        In Hóa Đơn Lại
                    </Button>
                ]}
                width={400}
            >
                <div style={{ border: '1px solid #eee', background: '#f9f9f9' }}>
                    {/* Render hóa đơn nhưng ẩn đi hoặc hiển thị trực quan */}
                    <Invoice ref={printRef} order={selectedOrder} userName={user?.fullName} />
                </div>
            </Modal>
        </>
    );
};

export default CustomerOrderHistory;