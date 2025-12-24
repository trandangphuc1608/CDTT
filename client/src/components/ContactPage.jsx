import React from 'react';
import { Row, Col, Typography, Form, Input, Button, Card, Divider } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ContactPage = () => {
    const onFinish = (values) => {
        // Xử lý gửi form (có thể gọi API sau)
        console.log('Success:', values);
        alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
    };

    return (
        <div style={{ padding: '40px 20px', background: '#f0f2f5', minHeight: '80vh' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={2}>LIÊN HỆ VỚI CHÚNG TÔI</Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>Chúng tôi luôn lắng nghe ý kiến đóng góp của bạn</Text>
                </div>

                <Row gutter={[32, 32]}>
                    {/* CỘT TRÁI: THÔNG TIN */}
                    <Col xs={24} md={10}>
                        <Card style={{ height: '100%', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Title level={4}>Thông tin liên lạc</Title>
                            <Divider />
                            
                            <div style={{ display: 'flex', gap: 15, marginBottom: 25 }}>
                                <EnvironmentOutlined style={{ fontSize: 24, color: '#cf1322', marginTop: 5 }} />
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>Địa chỉ</Text>
                                    <div style={{ color: '#555' }}>KTX KHU B, Đ. Mạc Đĩnh Chi, Khu phố Tân Hòa, Dĩ An, Bình Dương</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 15, marginBottom: 25 }}>
                                <PhoneOutlined style={{ fontSize: 24, color: '#cf1322', marginTop: 5 }} />
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>Hotline</Text>
                                    <div style={{ color: '#555', fontSize: 18, fontWeight: 'bold' }}>0981255021</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 15, marginBottom: 25 }}>
                                <MailOutlined style={{ fontSize: 24, color: '#cf1322', marginTop: 5 }} />
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>Email</Text>
                                    <div style={{ color: '#555' }}>support@tdpfood.com</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 15, marginBottom: 25 }}>
                                <ClockCircleOutlined style={{ fontSize: 24, color: '#cf1322', marginTop: 5 }} />
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>Giờ mở cửa</Text>
                                    <div style={{ color: '#555' }}>Thứ 2 - Chủ Nhật: 07:00 - 22:00</div>
                                </div>
                            </div>

                            {/* Bản đồ nhỏ */}
                            <div style={{ marginTop: 20, height: 200, borderRadius: 8, overflow: 'hidden' }}>
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.263595478864!2d105.6936663751944!3d18.65217698246712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139ce673323a6b5%3A0x7a30366d4e92b81b!2zMTgyIEzDqiBEdeG6qW4sIELhur9uIFRo4bOqyLCBUcC4gVmluaCwgTmdo4buHIEFuLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1709221234567!5m2!1sen!2s"
                                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                                ></iframe>
                            </div>
                        </Card>
                    </Col>

                    {/* CỘT PHẢI: FORM GỬI TIN */}
                    <Col xs={24} md={14}>
                        <Card style={{ height: '100%', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Title level={4}>Gửi tin nhắn cho chúng tôi</Title>
                            <Paragraph type="secondary">Nếu bạn có thắc mắc hoặc muốn hợp tác, vui lòng điền vào form bên dưới.</Paragraph>
                            <Divider />

                            <Form layout="vertical" size="large" onFinish={onFinish}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                                            <Input placeholder="Nguyễn Văn A" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
                                            <Input placeholder="09xxxx..." />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item name="email" label="Email (Tùy chọn)">
                                    <Input placeholder="example@gmail.com" />
                                </Form.Item>

                                <Form.Item name="subject" label="Chủ đề">
                                    <Input placeholder="Đặt tiệc, Phản hồi, ..." />
                                </Form.Item>

                                <Form.Item name="message" label="Nội dung tin nhắn" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                                    <Input.TextArea rows={6} placeholder="Nhập nội dung cần hỗ trợ..." />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" icon={<SendOutlined />} style={{ background: '#cf1322', borderColor: '#cf1322', width: 150 }}>
                                        Gửi ngay
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ContactPage;