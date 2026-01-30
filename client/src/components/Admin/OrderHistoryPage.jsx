import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, Card, Typography, Button, Space, DatePicker, Input } from 'antd';
import { SyncOutlined, SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/orders');
            let data = Array.isArray(res.data) ? res.data : (res.data.content || []);
            // Sắp xếp mới nhất lên đầu
            setOrders(data.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Lỗi tải lịch sử đơn:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xuất Excel
    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(orders.map(o => ({
            "Mã đơn": o.id,
            "Khách hàng": o.customerName,
            "Ngày tạo": o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : '',
            "Tổng tiền": o.totalPrice,
            "Trạng thái": o.status
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        XLSX.writeFile(workbook, "LichSuDonHang.xlsx");
    };

    // Lọc đơn hàng theo tên khách hoặc mã đơn
    const filteredOrders = orders.filter(o => 
        o.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
        o.id.toString().includes(searchText)
    );

    const columns = [
        {
            title: 'Mã Đơn',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <b>#{text}</b>,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text || 'Khách vãng lai'}</div>
                    {record.user && <Tag color="blue">Thành viên</Tag>}
                </div>
            )
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt', // 👉 SỬA LẠI CHO KHỚP BACKEND
            key: 'createdAt',
            render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '---',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice', // 👉 SỬA LẠI CHO KHỚP BACKEND
            key: 'totalPrice',
            render: (price) => <span style={{ color: '#d4380d', fontWeight: 'bold' }}>{Number(price || 0).toLocaleString()} đ</span>,
            sorter: (a, b) => a.totalPrice - b.totalPrice,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                let text = status;
                if (status === 'PENDING') { color = 'gold'; text = 'Chờ xác nhận'; }
                else if (status === 'PROCESSING') { color = 'blue'; text = 'Đang nấu'; }
                else if (status === 'COMPLETED') { color = 'cyan'; text = 'Xong món'; }
                else if (status === 'PAID') { color = 'green'; text = 'Thành công'; }
                else if (status === 'CANCELLED') { color = 'red'; text = 'Đã hủy'; }
                return <Tag color={color}>{text.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Chi tiết món',
            key: 'items',
            render: (_, record) => {
                // 👉 LẤY DỮ LIỆU LINH HOẠT (orderDetails hoặc items)
                const items = record.orderDetails || record.items || [];
                return (
                    <div style={{ maxHeight: 100, overflowY: 'auto' }}>
                        {items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: 12 }}>
                                • <b>{item.product?.name || item.name}</b> x{item.quantity}
                            </div>
                        ))}
                    </div>
                );
            }
        }
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Title level={3} style={{ margin: 0 }}>Lịch Sử Đơn Hàng</Title>
                <Space>
                    <Button icon={<SyncOutlined spin={loading} />} onClick={fetchOrders}>Làm mới</Button>
                    <Button type="primary" icon={<FileExcelOutlined />} onClick={exportExcel}>Xuất Excel</Button>
                </Space>
            </div>

            <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
                <Input 
                    placeholder="Tìm theo tên khách hoặc mã đơn..." 
                    prefix={<SearchOutlined />} 
                    style={{ width: 300 }}
                    onChange={e => setSearchText(e.target.value)}
                />
                <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
            </div>

            <Table 
                columns={columns} 
                dataSource={filteredOrders} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default OrderHistoryPage;