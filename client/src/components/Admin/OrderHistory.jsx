import React, { useEffect, useState } from 'react';
import { Table, Tag, Card } from 'antd';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Tận dụng API pending, thực tế nên viết thêm API findAllOrders ở backend nếu muốn lấy cả đơn đã xong
        // Tạm thời mình dùng API stats để demo, bạn nên thêm API: @GetMapping("/all") trong OrderController
        // Ở đây mình giả lập gọi API lấy toàn bộ
        axios.get('http://localhost:8081/api/orders/all')
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));
    }, []);

    // Cột cho bảng chính
    const columns = [
        { title: 'Mã Đơn', dataIndex: 'id', render: t => <b>#{t}</b> },
        { title: 'Thời gian', dataIndex: 'createdAt', render: t => new Date(t).toLocaleString() },
        { title: 'Tổng tiền', dataIndex: 'totalAmount', render: t => <span className="text-red-600 font-bold">{t?.toLocaleString()} đ</span> },
        { title: 'Trạng thái', dataIndex: 'status', render: t => {
            let color = t === 'COMPLETED' ? 'green' : (t === 'PENDING' ? 'orange' : 'blue');
            return <Tag color={color}>{t}</Tag>
        }}
    ];

    // Bảng phụ (Nested Table) hiển thị chi tiết món ăn
    const expandedRowRender = (record) => {
        const subColumns = [
            { title: 'Món ăn', dataIndex: ['product', 'name'] },
            { title: 'Hình ảnh', dataIndex: ['product', 'imageUrl'], render: u => <img src={u} width={40} /> },
            { title: 'Số lượng', dataIndex: 'quantity', render: q => <b className="text-blue-600">x{q}</b> },
            { title: 'Đơn giá', dataIndex: ['product', 'price'], render: p => p?.toLocaleString() }
        ];
        return <Table columns={subColumns} dataSource={record.items} pagination={false} rowKey="id" />;
    };

    return (
        <div className="p-4 bg-white rounded shadow-sm">
            <h3 className="font-bold text-xl mb-4">Lịch Sử Đơn Hàng</h3>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                expandable={{ expandedRowRender }}
            />
        </div>
    );
};
export default OrderHistory;