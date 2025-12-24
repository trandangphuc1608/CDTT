import React from 'react';
import { Row, Col, Typography, Space } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CustomerFooter = () => {
    return (
        <div style={{ background: '#1a1a1a', color: '#999', padding: '60px 50px 20px 50px' }}>
            <Row gutter={[40, 40]}>
                <Col xs={24} md={8}>
                    <Title level={3} style={{ color: '#fff', marginBottom: '20px' }}>TDP RESTAURANT.</Title>
                    <p>KTX KHU B, Đ. Mạc Đĩnh Chi, Khu phố Tân Hòa, Dĩ An, Bình Dương</p>
                    <p><b>Hotline:</b> 0981255021</p>
                    <p><b>Email:</b> trandangphuc1608@gmail.com</p>
                </Col>
                <Col xs={12} md={8}>
                    <Title level={5} style={{ color: '#fff', marginBottom: '20px', textTransform: 'uppercase' }}>Liên kết</Title>
                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                        <li><a href="#" style={{ color: '#999' }}>Trang chủ</a></li>
                        <li><a href="#" style={{ color: '#999' }}>Thực đơn</a></li>
                        <li><a href="#" style={{ color: '#999' }}>Đặt bàn</a></li>
                        <li><a href="#" style={{ color: '#999' }}>Chính sách bảo mật</a></li>
                    </ul>
                </Col>
                <Col xs={12} md={8} style={{ textAlign: 'right' }}>
                    <Title level={5} style={{ color: '#fff', marginBottom: '20px', textTransform: 'uppercase' }}>Kết nối</Title>
                    <Space size="large" style={{ fontSize: '24px' }}>
                        <FacebookOutlined style={{ cursor: 'pointer', color: '#fff' }} /> 
                        <InstagramOutlined style={{ cursor: 'pointer', color: '#fff' }} /> 
                        <TwitterOutlined style={{ cursor: 'pointer', color: '#fff' }} />
                    </Space>
                </Col>
            </Row>
            <div style={{ borderTop: '1px solid #333', marginTop: '50px', paddingTop: '20px', textAlign: 'center', fontSize: '13px' }}>
                © 2025 TDP Restaurant. All Rights Reserved.
            </div>
        </div>
    );
};

export default CustomerFooter;