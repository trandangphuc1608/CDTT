import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Avatar, Typography, Row, Col, message, Upload } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const ProfilePage = ({ user, onUserUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(''); 
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                password: '',
            });
            if (user.avatar) {
                setAvatarUrl(user.avatar);
            }
        }
    }, [user, form]);

    // --- SỬA LOGIC UPLOAD Ở ĐÂY ---
    const handleUploadRequest = async (options) => {
        const { file, onSuccess, onError } = options;
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Gọi API upload file riêng biệt
            const res = await axios.post('http://localhost:8081/api/users/upload-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Server trả về đường dẫn ảnh (ví dụ: http://localhost:8081/images/abc.jpg)
            const newImageUrl = res.data;
            
            setAvatarUrl(newImageUrl); // Hiển thị ảnh ngay
            onSuccess("Ok");
            message.success("Tải ảnh lên thành công!");
        } catch (err) {
            console.error(err);
            onError({ err });
            message.error("Lỗi tải ảnh lên server");
        }
    };

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const updatedData = {
                ...user,
                fullName: values.fullName,
                email: values.email,
                password: values.password || null,
                avatar: avatarUrl // Giờ đây avatar là một đường dẫn ngắn (URL), không phải Base64 dài
            };

            const res = await axios.put(`http://localhost:8081/api/users/${user.id}`, updatedData);

            message.success("Cập nhật hồ sơ thành công!");
            onUserUpdated(res.data);
            form.setFieldValue('password', '');
        } catch (error) {
            message.error("Lỗi cập nhật!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px 20px', background: '#f5f5f5', minHeight: '80vh', display: 'flex', justifyContent: 'center' }}>
            <Card 
                style={{ width: '100%', maxWidth: 600, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                title={<Title level={4} style={{ margin: 0, textAlign: 'center' }}>HỒ SƠ CỦA TÔI</Title>}
            >
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar 
                            size={100} 
                            src={avatarUrl} 
                            icon={!avatarUrl && <UserOutlined />} 
                            style={{ backgroundColor: '#f56a00', marginBottom: 10, border: '2px solid #fff' }} 
                        />
                        
                        {/* Component Upload dùng customRequest */}
                        <Upload 
                            showUploadList={false}
                            customRequest={handleUploadRequest} // Dùng hàm upload riêng
                            accept="image/*"
                        >
                            <Button 
                                type="primary" 
                                shape="circle" 
                                icon={<UploadOutlined />} 
                                size="small"
                                style={{ position: 'absolute', bottom: 15, right: 0 }}
                                title="Đổi ảnh đại diện"
                            />
                        </Upload>
                    </div>

                    <div>
                        <Title level={3} style={{ margin: 0 }}>{user?.fullName}</Title>
                        <TagRole role={user?.role} />
                    </div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleFinish} size="large">
                    {/* ... (Các trường input giữ nguyên như cũ) ... */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Tên đăng nhập" name="username">
                                <Input disabled prefix={<UserOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true }]}>
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Email" name="email">
                                <Input prefix={<MailOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Đổi mật khẩu" name="password">
                                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 20 }}>
                        <Button type="primary" htmlType="submit" block loading={loading} icon={<SaveOutlined />} style={{ height: 45, fontWeight: 'bold' }}>
                            LƯU THAY ĐỔI
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

const TagRole = ({ role }) => {
    let color = '#87d068';
    if(role === 'ADMIN') color = '#f50';
    return <span style={{ background: color, color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{role}</span>
}

export default ProfilePage;