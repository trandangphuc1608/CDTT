import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, InputNumber, Button, message, Typography, Row, Col, Card, Tag } from 'antd';
import { CalendarOutlined, UserOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const BookingModal = ({ open, onCancel, user }) => {
    const [loading, setLoading] = useState(false);
    const [tables, setTables] = useState([]); // Danh sách bàn
    const [selectedTable, setSelectedTable] = useState(null); // Bàn đang chọn
    const [form] = Form.useForm();

    // 1. Tự động điền thông tin user
    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                customerName: user.fullName,
                email: user.email || '',
                // phoneNumber: user.phone || '' 
            });
        }
    }, [open, user, form]);

    // 2. Load danh sách bàn khi mở Modal
    useEffect(() => {
        if (open) {
            fetchTables();
        }
    }, [open]);

    const fetchTables = async () => {
        try {
            const res = await axios.get('/api/tables');
            setTables(res.data);
        } catch (error) {
            console.error("Lỗi tải danh sách bàn");
        }
    };

    // 3. Xử lý đặt bàn
    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const date = values.date.format('YYYY-MM-DD');
            const time = values.time.format('HH:mm:ss');
            const bookingTime = `${date}T${time}`;

            // Ghi chú bàn đã chọn vào note (Do backend chưa có trường tableId trong Reservation)
            let finalNote = values.note || '';
            if (selectedTable) {
                finalNote = `[Khách chọn: ${selectedTable.name}] - ` + finalNote;
            }

            const payload = {
                customerName: values.customerName,
                phoneNumber: values.phoneNumber,
                email: values.email,
                guestCount: values.guestCount,
                note: finalNote,
                bookingTime: bookingTime
            };

            const url = user ? `/api/reservations?userId=${user.id}` : '/api/reservations';
            await axios.post(url, payload);

            message.success('Gửi yêu cầu thành công! Chúng tôi sẽ gọi xác nhận.');
            
            // Reset form & state
            onCancel();
            form.resetFields();
            setSelectedTable(null);
        } catch (error) {
            message.error('Lỗi đặt bàn, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    // Hàm render màu sắc trạng thái bàn
    const getTableColor = (status, isSelected) => {
        if (isSelected) return '#1890ff'; // Màu xanh dương khi đang chọn
        if (status === 'AVAILABLE') return '#52c41a'; // Màu xanh lá (Trống)
        return '#ff4d4f'; // Màu đỏ (Đã đặt/Có khách)
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={<Title level={3} style={{ textAlign: 'center', color: '#cf1322', margin: 0 }}>ĐẶT BÀN ONLINE</Title>}
            width={800} // Tăng chiều rộng để hiển thị sơ đồ bàn
        >
            <Row gutter={24}>
                {/* CỘT TRÁI: FORM NHẬP LIỆU */}
                <Col span={12} xs={24} md={10}>
                    <p style={{ color: '#666', marginBottom: 20 }}>Thông tin liên hệ:</p>
                    <Form form={form} layout="vertical" onFinish={handleFinish} size="large">
                        <Form.Item name="customerName" rules={[{ required: true, message: 'Nhập họ tên!' }]}>
                            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                        </Form.Item>
                        
                        <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Nhập SĐT!' }]}>
                            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                        </Form.Item>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <Form.Item name="date" style={{ flex: 1 }} rules={[{ required: true, message: 'Chọn ngày!' }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Ngày" disabledDate={(c) => c && c < dayjs().startOf('day')} />
                            </Form.Item>
                            <Form.Item name="time" style={{ flex: 1 }} rules={[{ required: true, message: 'Chọn giờ!' }]}>
                                <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} placeholder="Giờ" />
                            </Form.Item>
                        </div>

                        <Form.Item name="guestCount" label="Số khách" initialValue={2} rules={[{ required: true }]}>
                            <InputNumber min={1} max={50} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item name="note">
                            <Input.TextArea rows={2} placeholder="Ghi chú thêm..." />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block 
                                style={{ background: '#cf1322', borderColor: '#cf1322', fontWeight: 'bold', height: 45 }}>
                                {selectedTable ? `ĐẶT ${selectedTable.name.toUpperCase()}` : 'XÁC NHẬN ĐẶT BÀN'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>

                {/* CỘT PHẢI: SƠ ĐỒ BÀN */}
                <Col span={12} xs={24} md={14} style={{ borderLeft: '1px dashed #ddd', paddingLeft: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                        <Text strong>Chọn vị trí bàn (Tùy chọn):</Text>
                        <Button size="small" onClick={fetchTables}>Làm mới</Button>
                    </div>
                    
                    {/* Chú thích màu */}
                    <div style={{ marginBottom: 15, display: 'flex', gap: 10, fontSize: 12 }}>
                        <Tag color="#52c41a">Trống</Tag>
                        <Tag color="#ff4d4f">Đã đặt</Tag>
                        <Tag color="#1890ff">Đang chọn</Tag>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, maxHeight: '400px', overflowY: 'auto' }}>
                        {tables.length > 0 ? tables.map(table => {
                            const isAvailable = table.status === 'AVAILABLE';
                            const isSelected = selectedTable?.id === table.id;
                            
                            return (
                                <Card 
                                    key={table.id}
                                    hoverable={isAvailable}
                                    onClick={() => {
                                        if (isAvailable) setSelectedTable(isSelected ? null : table);
                                        else message.warning('Bàn này đã có người đặt!');
                                    }}
                                    style={{ 
                                        width: 80, height: 80, 
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                        backgroundColor: getTableColor(table.status, isSelected),
                                        color: '#fff',
                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                        opacity: (!isAvailable) ? 0.6 : 1,
                                        border: isSelected ? '3px solid #003a8c' : 'none',
                                        transition: '0.3s'
                                    }}
                                    bodyStyle={{ padding: 5, textAlign: 'center' }}
                                >
                                    <div style={{ fontWeight: 'bold', fontSize: 12 }}>{table.name}</div>
                                    <div style={{ fontSize: 10 }}>{table.capacity} ghế</div>
                                    {isSelected && <CheckCircleOutlined style={{ fontSize: 16, marginTop: 5 }} />}
                                </Card>
                            );
                        }) : <Text type="secondary">Đang tải danh sách bàn...</Text>}
                    </div>
                    
                    {selectedTable && (
                        <div style={{ marginTop: 20, padding: 10, background: '#e6f7ff', borderRadius: 6, border: '1px solid #91d5ff' }}>
                            <Text strong style={{ color: '#0050b3' }}>
                                Bạn đang chọn: {selectedTable.name} ({selectedTable.capacity} chỗ)
                            </Text>
                        </div>
                    )}
                </Col>
            </Row>
        </Modal>
    );
};

export default BookingModal;