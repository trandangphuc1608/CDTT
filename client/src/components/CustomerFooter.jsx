import React, { useState } from 'react';
import { Row, Col, Typography, Space, Input, Button, Divider, message } from 'antd';
import { 
    FacebookOutlined, 
    YoutubeOutlined,
    TikTokOutlined,
    SendOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const CustomerFooter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // --- LOGIC XỬ LÝ ĐĂNG KÝ NHẬN TIN ---
    const handleSubscribe = () => {
        if (!email) {
            message.warning("Vui lòng nhập địa chỉ email!");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message.error("Email không hợp lệ!");
            return;
        }

        setLoading(true);
        // Giả lập gọi API (hoặc bạn có thể gọi axios.post('/api/newsletter', { email }) nếu muốn lưu thật)
        setTimeout(() => {
            message.success("Đăng ký nhận tin thành công! Cảm ơn bạn.");
            setEmail('');
            setLoading(false);
        }, 1000);
    };
    // -------------------------------------

    const linkStyle = { color: '#b3b3b3', textDecoration: 'none', transition: 'color 0.3s', display: 'block', marginBottom: '10px' };
    const iconStyle = { color: '#f5a623', marginRight: '10px', fontSize: '18px' };
    const socialIconStyle = { fontSize: '24px', color: '#fff', cursor: 'pointer', transition: 'all 0.3s' };

    return (
        <div style={{ background: '#111', color: '#b3b3b3', padding: '80px 50px 20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Row gutter={[40, 40]}>
                    
                    {/* CỘT 1: THÔNG TIN THƯƠNG HIỆU & MẠNG XÃ HỘI */}
                    <Col xs={24} sm={12} md={6}>
                        <Title level={3} style={{ color: '#fff', marginBottom: '20px', letterSpacing: '1px' }}>
                            TDP <span style={{ color: '#cf1322' }}>FOOD</span>.
                        </Title>
                        <Text style={{ color: '#b3b3b3', display: 'block', marginBottom: 20, lineHeight: 1.8 }}>
                            Trải nghiệm ẩm thực tuyệt vời với nguyên liệu tươi ngon và không gian sang trọng ngay tại khuôn viên đại học.
                        </Text>
                        <Space size="middle">
                            {/* 1. Facebook */}
                            <a href="https://www.facebook.com/tran.phuc.476241" target="_blank" rel="noopener noreferrer">
                                <FacebookOutlined style={socialIconStyle} />
                            </a>
                            
                            {/* 2. TikTok */}
                            <a href="https://www.tiktok.com/@thaivinhphu" target="_blank" rel="noopener noreferrer">
                                <TikTokOutlined style={socialIconStyle} title="TikTok" /> 
                            </a>

                            {/* 3. YouTube */}
                            <a href="https://www.youtube.com/@PhucTran-ob1gy" target="_blank" rel="noopener noreferrer">
                                <YoutubeOutlined style={socialIconStyle} />
                            </a>
                        </Space>
                    </Col>

                    {/* CỘT 2: LIÊN KẾT NHANH */}
                    <Col xs={24} sm={12} md={6}>
                        <Title level={5} style={{ color: '#fff', marginBottom: '25px', textTransform: 'uppercase' }}>Về Chúng Tôi</Title>
                        <Link to="/" style={linkStyle}>Trang chủ</Link>
                        <Link to="/about" style={linkStyle}>Giới thiệu</Link>
                        <Link to="/menu" style={linkStyle}>Thực đơn & Đặt món</Link>
                        <Link to="/table-booking" style={linkStyle}>Đặt bàn trước</Link>
                        <Link to="/policy" style={linkStyle}>Chính sách bảo mật</Link>
                    </Col>

                    {/* CỘT 3: THÔNG TIN LIÊN HỆ & GIỜ MỞ CỬA */}
                    <Col xs={24} sm={12} md={6}>
                        <Title level={5} style={{ color: '#fff', marginBottom: '25px', textTransform: 'uppercase' }}>Liên Hệ</Title>
                        <div style={{ marginBottom: 15, display: 'flex' }}>
                            <EnvironmentOutlined style={iconStyle} />
                            <span>KTX Khu B, ĐHQG TP.HCM, Dĩ An, Bình Dương</span>
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <PhoneOutlined style={iconStyle} />
                            <a href="tel:0981255021" style={{ color: '#b3b3b3' }}>0981 255 021</a>
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <MailOutlined style={iconStyle} />
                            <a href="mailto:trandangphuc1608@gmail.com" style={{ color: '#b3b3b3' }}>trandangphuc1608@gmail.com</a>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <Title level={5} style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase' }}>Giờ mở cửa</Title>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                                <ClockCircleOutlined style={{ color: '#cf1322', marginRight: 10 }} />
                                <span>Thứ 2 - Thứ 6: 08:00 - 22:00</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ClockCircleOutlined style={{ color: '#cf1322', marginRight: 10 }} />
                                <span>Thứ 7 - CN: 09:00 - 23:00</span>
                            </div>
                        </div>
                    </Col>

                    {/* CỘT 4: ĐĂNG KÝ NHẬN TIN (NEWSLETTER - ĐÃ CÓ LOGIC) */}
                    <Col xs={24} sm={12} md={6}>
                        <Title level={5} style={{ color: '#fff', marginBottom: '25px', textTransform: 'uppercase' }}>Khuyến Mãi</Title>
                        <Text style={{ color: '#b3b3b3', display: 'block', marginBottom: 15 }}>
                            Đăng ký để nhận thông tin ưu đãi mới nhất và mã giảm giá độc quyền.
                        </Text>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input 
                                placeholder="Nhập email của bạn" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onPressEnter={handleSubscribe}
                                style={{ borderRadius: '0', border: 'none', height: 40 }} 
                            />
                            <Button 
                                type="primary" 
                                loading={loading}
                                onClick={handleSubscribe}
                                style={{ borderRadius: '0', height: 40, background: '#cf1322', borderColor: '#cf1322' }}
                            >
                                <SendOutlined />
                            </Button>
                        </Space.Compact>
                        
                        <div style={{ marginTop: 30 }}>
                            <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: 10 }}>CHẤP NHẬN THANH TOÁN</Text>
                            <Space size="middle">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" style={{ height: 20, filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" style={{ height: 20, filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
                                <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" style={{ height: 20, filter: 'grayscale(100%)', opacity: 0.7 }} />
                            </Space>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ borderColor: '#333', margin: '40px 0' }} />

                {/* BOTTOM FOOTER */}
                <Row justify="space-between" align="middle">
                    <Col xs={24} md={12} style={{ textAlign: 'left' }}>
                        <Text style={{ color: '#666', fontSize: '13px' }}>
                            © 2025 TDP Restaurant. All Rights Reserved. Designed by Phuc Tran.
                        </Text>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                        <Space split={<Divider type="vertical" style={{ borderColor: '#666' }} />}>
                            <Link to="/terms" style={{ color: '#666', fontSize: '13px' }}>Điều khoản sử dụng</Link>
                            <Link to="/policy" style={{ color: '#666', fontSize: '13px' }}>Chính sách bảo mật</Link>
                            <Link to="/contact" style={{ color: '#666', fontSize: '13px' }}>Cookies</Link>
                        </Space>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CustomerFooter;