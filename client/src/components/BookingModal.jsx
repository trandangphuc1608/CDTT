import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, InputNumber, Button, message, Typography } from 'antd';
import { CalendarOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const BookingModal = ({ open, onCancel, user }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Tự động điền thông tin nếu khách đã đăng nhập
    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                customerName: user.fullName,
                email: user.email || '',
                // phoneNumber: user.phone || '' // Nếu trong User có trường phone
            });
        }
    }, [open, user, form]);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            // Gộp Date và Time thành chuỗi ISO
            const date = values.date.format('YYYY-MM-DD');
            const time = values.time.format('HH:mm:ss');
            const bookingTime = `${date}T${time}`;

            const payload = {
                customerName: values.customerName,
                phoneNumber: values.phoneNumber,
                email: values.email,
                guestCount: values.guestCount,
                note: values.note,
                bookingTime: bookingTime
            };

            // Gọi API (có kèm userId nếu đã login)
            const url = user 
                ? `http://localhost:8081/api/reservations?userId=${user.id}`
                : 'http://localhost:8081/api/reservations';

            await axios.post(url, payload);

            message.success('Đặt bàn thành công! Chúng tôi sẽ liên hệ sớm.');
            onCancel();
            form.resetFields();
        } catch (error) {
            message.error('Lỗi đặt bàn, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={<Title level={3} style={{ textAlign: 'center', color: '#cf1322', margin: 0 }}>ĐẶT BÀN ONLINE</Title>}
            width={500}
        >
            <p style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>
                Điền thông tin để giữ chỗ ngay lập tức!
            </p>

            <Form form={form} layout="vertical" onFinish={handleFinish} size="large">
                <Form.Item name="customerName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Họ và tên của bạn" />
                </Form.Item>

                <div style={{ display: 'flex', gap: 10 }}>
                    <Form.Item name="phoneNumber" style={{ flex: 1 }} rules={[{ required: true, message: 'Nhập SĐT!' }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                    </Form.Item>
                    <Form.Item name="email" style={{ flex: 1 }}>
                        <Input prefix={<MailOutlined />} placeholder="Email (Tùy chọn)" />
                    </Form.Item>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <Form.Item name="date" style={{ flex: 1 }} rules={[{ required: true, message: 'Chọn ngày!' }]}>
                        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" format="DD/MM/YYYY" disabledDate={(current) => current && current < dayjs().startOf('day')} />
                    </Form.Item>
                    <Form.Item name="time" style={{ flex: 1 }} rules={[{ required: true, message: 'Chọn giờ!' }]}>
                        <TimePicker style={{ width: '100%' }} placeholder="Chọn giờ" format="HH:mm" minuteStep={15} />
                    </Form.Item>
                </div>

                <Form.Item name="guestCount" label="Số lượng khách" initialValue={2} rules={[{ required: true }]}>
                    <InputNumber min={1} max={50} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="note">
                    <Input.TextArea rows={2} placeholder="Ghi chú (Ví dụ: Cần ghế trẻ em, bàn gần cửa sổ...)" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block style={{ background: '#cf1322', borderColor: '#cf1322', fontWeight: 'bold', height: 45 }}>
                        XÁC NHẬN ĐẶT BÀN
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookingModal;