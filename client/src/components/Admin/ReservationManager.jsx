import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Tag, message, Popconfirm, Tooltip, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, PhoneOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const ReservationManager = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load danh sách đặt bàn
    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/reservations');
            // Sắp xếp đơn mới nhất lên đầu
            const sortedData = res.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
            setReservations(sortedData);
        } catch (error) {
            message.error("Lỗi tải dữ liệu!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    // Xử lý đổi trạng thái
    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`/api/reservations/${id}/status?status=${status}`);
            message.success(status === 'CONFIRMED' ? 'Đã xác nhận!' : 'Đã hủy đơn!');
            fetchReservations(); // Load lại bảng
        } catch (error) {
            message.error("Lỗi cập nhật!");
        }
    };

    const columns = [
        { 
            title: 'ID', dataIndex: 'id', width: 60, align: 'center' 
        },
        { 
            title: 'Khách hàng', dataIndex: 'customerName',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        <PhoneOutlined /> {record.phoneNumber}
                    </div>
                </div>
            )
        },
        { 
            title: 'Thời gian đến', dataIndex: 'bookingTime',
            render: (time) => (
                <div style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    {dayjs(time).format('HH:mm - DD/MM/YYYY')}
                </div>
            )
        },
        { 
            title: 'Số khách', dataIndex: 'guestCount', align: 'center',
            render: (count) => <b>{count} người</b>
        },
        { 
            title: 'Ghi chú', dataIndex: 'note', ellipsis: true 
        },
        { 
            title: 'Trạng thái', dataIndex: 'status', align: 'center',
            render: (status) => {
                let color = 'default';
                let text = 'Chờ duyệt';
                if (status === 'CONFIRMED') { color = 'success'; text = 'Đã xác nhận'; }
                if (status === 'CANCELLED') { color = 'error'; text = 'Đã hủy'; }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Hành động',
            align: 'center',
            render: (_, record) => (
                <Space>
                    {record.status === 'PENDING' && (
                        <>
                            <Tooltip title="Xác nhận">
                                <Button 
                                    type="primary" 
                                    size="small" 
                                    icon={<CheckCircleOutlined />} 
                                    onClick={() => handleUpdateStatus(record.id, 'CONFIRMED')} 
                                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                />
                            </Tooltip>
                            
                            <Popconfirm title="Bạn muốn hủy đơn này?" onConfirm={() => handleUpdateStatus(record.id, 'CANCELLED')}>
                                <Button type="primary" danger size="small" icon={<CloseCircleOutlined />} />
                            </Popconfirm>
                        </>
                    )}
                    {record.status !== 'PENDING' && <span style={{ color: '#ccc' }}>Hoàn tất</span>}
                </Space>
            )
        },
    ];

    return (
        <div className="p-4 bg-white rounded shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold m-0">📅 Quản Lý Đặt Bàn</h3>
                <Button icon={<ReloadOutlined />} onClick={fetchReservations}>Làm mới</Button>
            </div>
            
            <Table 
                dataSource={reservations} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                bordered
                pagination={{ pageSize: 8 }}
            />
        </div>
    );
};

export default ReservationManager;