import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const RegisterPage = ({ onSwitchToLogin }) => {
    const onFinish = async (values) => {
        try {
            await axios.post('/api/auth/register', values);
            message.success("Đăng ký thành công! Hãy đăng nhập.");
            onSwitchToLogin(); // Chuyển về trang login
        } catch (error) {
            message.error(error.response?.data || "Đăng ký thất bại!");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={2} style={{ color: '#cf1322' }}>Đăng Ký</Title>
                    <Text type="secondary">Trở thành thành viên của TDP Food</Text>
                </div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="fullName" rules={[{ required: true, message: 'Nhập họ tên!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Họ và tên" size="large" />
                    </Form.Item>
                    <Form.Item name="username" rules={[{ required: true, message: 'Nhập tên đăng nhập!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" size="large" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                    </Form.Item>
                    <Form.Item name="email">
                        <Input prefix={<MailOutlined />} placeholder="Email (Tùy chọn)" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" style={{ background: '#cf1322', borderColor: '#cf1322' }}>
                            Đăng Ký Ngay
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        Đã có tài khoản? <a onClick={onSwitchToLogin} style={{ color: '#cf1322' }}>Đăng nhập</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;