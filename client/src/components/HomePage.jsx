import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, Row, Col, Typography, Carousel, Form, Input, Space } from 'antd';
import { 
    EnvironmentOutlined, MailOutlined, PhoneOutlined
} from '@ant-design/icons';

// Import Modal Đặt bàn để dùng cho nút "ĐẶT BÀN NGAY" ở Banner
import BookingModal from './BookingModal';

const { Title, Text, Paragraph } = Typography;

const HomePage = ({ onGoToMenu, user }) => {
    // --- STATE ---
    const [banners, setBanners] = useState([]);
    const [showBooking, setShowBooking] = useState(false); // State bật tắt modal đặt bàn riêng của trang chủ

    // --- REFS (Để cuộn trang nếu cần) ---
    const contactRef = useRef(null);
    
    // Load dữ liệu Banner
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/banners/active');
                if(res.data?.length > 0) setBanners(res.data);
                else setBanners([{ id: 0, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', title: 'Nhà hàng TDP' }]);
            } catch (error) {
                console.error("Lỗi tải banner");
            }
        };
        fetchBanners();
    }, []);

    // --- 1. HERO SECTION (BANNER & NÚT ĐIỀU HƯỚNG) ---
    const HeroSection = () => (
        <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
            <Carousel autoplay autoplaySpeed={3000} effect="fade" dots={false}>
                {banners.map(banner => (
                    <div key={banner.id}>
                        <div style={{
                            backgroundImage: `url('${banner.imageUrl}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '100vh',
                            width: '100%',
                            filter: 'brightness(0.4)',
                            transition: 'all 0.5s ease'
                        }}></div>
                    </div>
                ))}
            </Carousel>

            {/* Nội dung đè lên Banner */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#fff', maxWidth: '800px', padding: '0 20px' }}>
                    <Title level={1} style={{ color: '#fff', fontSize: '60px', marginBottom: '10px', letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        {banners.length > 0 && banners[0].title ? banners[0].title : "Nhà hàng TDP"}
                        <span style={{ color: '#f5a623' }}>.</span>
                    </Title>
                    <Paragraph style={{ color: '#eee', fontSize: '20px', marginBottom: '40px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        Trải nghiệm ẩm thực tuyệt vời với các món ăn tươi ngon nhất, không gian sang trọng và phục vụ tận tâm.
                    </Paragraph>
                    <Space size="large">
                        {/* Nút chuyển sang trang Menu */}
                        <Button 
                            size="large" 
                            onClick={onGoToMenu} 
                            style={{ background: 'transparent', color: '#fff', borderColor: '#fff', width: '200px', height: '55px', fontWeight: 'bold', fontSize: '16px' }}
                        >
                            XEM THỰC ĐƠN
                        </Button>
                        
                        {/* Nút mở Modal đặt bàn */}
                        <Button 
                            size="large" 
                            onClick={() => setShowBooking(true)} 
                            style={{ background: '#f5a623', color: '#fff', borderColor: '#f5a623', width: '200px', height: '55px', fontWeight: 'bold', fontSize: '16px' }}
                        >
                            ĐẶT BÀN NGAY
                        </Button>
                    </Space>
                </div>
            </div>
        </div>
    );

    // --- 2. CONTACT SECTION ---
    const ContactSection = () => (
        <div ref={contactRef} style={{ padding: '80px 50px', background: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <Title level={2} style={{ color: '#1f2937', textTransform: 'uppercase', margin: 0 }}>Liên hệ với chúng tôi</Title>
                <div style={{ width: '60px', height: '3px', background: '#f5a623', margin: '15px auto' }}></div>
            </div>

            <Row gutter={[48, 48]}>
                {/* Bản đồ & Thông tin */}
                <Col xs={24} lg={12}>
                    <div style={{ width: '100%', height: '350px', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px', border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.263595478864!2d105.6936663751944!3d18.65217698246712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139ce673323a6b5%3A0x7a30366d4e92b81b!2zMTgyIEzDqiBEdeG6qW4sIELhur9uIFRo4bOqyLCBUcC4gVmluaCwgTmdo4buHIEFuLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1709221234567!5m2!1sen!2s"
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            title="Google Map"
                        ></iframe>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ background: '#ffcc00', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginRight: '20px', flexShrink: 0 }}><EnvironmentOutlined style={{ fontSize: '20px', color: '#fff' }} /></div>
                            <div><Title level={5} style={{ margin: 0, fontWeight: 'bold' }}>Địa chỉ:</Title><Text style={{ color: '#666' }}>182 Lê Duẩn, Bến Thủy, TP Vinh, Nghệ An</Text></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ background: '#ffcc00', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginRight: '20px', flexShrink: 0 }}><MailOutlined style={{ fontSize: '20px', color: '#fff' }} /></div>
                            <div><Title level={5} style={{ margin: 0, fontWeight: 'bold' }}>Email:</Title><Text style={{ color: '#666' }}>tdp.restaurant@gmail.com</Text></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ background: '#ffcc00', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginRight: '20px', flexShrink: 0 }}><PhoneOutlined style={{ fontSize: '20px', color: '#fff' }} /></div>
                            <div><Title level={5} style={{ margin: 0, fontWeight: 'bold' }}>Điện thoại:</Title><Text style={{ color: '#666' }}>+84 865.888.333</Text></div>
                        </div>
                    </div>
                </Col>
                
                {/* Form liên hệ */}
                <Col xs={24} lg={12}>
                    <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', border: '1px solid #eee', height: '100%' }}>
                        <Title level={4} style={{ marginBottom: '20px' }}>Gửi tin nhắn cho chúng tôi</Title>
                        <Form layout="vertical" size="large">
                            <Row gutter={16}>
                                <Col span={12}><Form.Item name="name"><Input placeholder="Họ và tên" /></Form.Item></Col>
                                <Col span={12}><Form.Item name="email"><Input placeholder="Email" /></Form.Item></Col>
                            </Row>
                            <Form.Item name="message"><Input.TextArea rows={6} placeholder="Nội dung tin nhắn..." /></Form.Item>
                            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit" style={{ background: '#ffcc00', borderColor: '#ffcc00', color: '#333', fontWeight: 'bold', width: '150px' }}>GỬI TIN NHẮN</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );

    return (
        <div style={{ background: '#fff' }}>
            <HeroSection />
            <ContactSection />
            
            {/* Modal Đặt bàn (Chỉ dùng cho nút bấm trong trang này) */}
            <BookingModal 
                open={showBooking} 
                onCancel={() => setShowBooking(false)} 
                user={user} 
            />
        </div>
    );
};

export default HomePage;