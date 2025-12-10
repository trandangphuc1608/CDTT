import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Layout, Button, Input, Row, Col, Typography, Card, Tabs, Space, Carousel, message, Form } from 'antd';
import { 
    ShoppingCartOutlined, SearchOutlined, 
    EnvironmentOutlined, MailOutlined, PhoneOutlined, 
    FacebookOutlined, InstagramOutlined, TwitterOutlined,
    UserOutlined, HistoryOutlined, LogoutOutlined
} from '@ant-design/icons';

// Import các Modal
import CustomerOrderHistory from './CustomerOrderHistory';
import BookingModal from './BookingModal'; // <-- Import Modal Đặt Bàn

const { Title, Text, Paragraph } = Typography;

const HomePage = ({ onLogin }) => {
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [products, setProducts] = useState([]);     
    const [activeTab, setActiveTab] = useState('');   
    
    // --- STATE QUẢN LÝ USER & MODAL ---
    const [user, setUser] = useState(null); 
    const [showHistory, setShowHistory] = useState(false); 
    const [showBooking, setShowBooking] = useState(false); // State bật tắt đặt bàn

    // --- REFS ĐỂ CUỘN TRANG ---
    const menuRef = useRef(null);
    const contactRef = useRef(null);
    
    // Hàm cuộn đến section
    const scrollToSection = (ref) => {
        if(ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Load dữ liệu khi vào trang
    useEffect(() => {
        const savedUser = localStorage.getItem("fastfood_user");
        if (savedUser) setUser(JSON.parse(savedUser));

        const fetchData = async () => {
            try {
                const [bannerRes, catRes, prodRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/banners/active'),
                    axios.get('http://localhost:8081/api/categories'),
                    axios.get('http://localhost:8081/api/products')
                ]);

                if(bannerRes.data?.length > 0) setBanners(bannerRes.data);
                else setBanners([{ id: 0, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', title: 'Nhà hàng TDP' }]);

                setCategories(catRes.data);
                if (catRes.data.length > 0) setActiveTab(String(catRes.data[0].id)); 
                setProducts(prodRes.data);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("fastfood_user");
        setUser(null);
        message.success("Đã đăng xuất!");
        window.location.reload(); 
    };

    // --- 1. HERO SECTION ---
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

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
                {/* Navbar */}
                <div style={{ padding: '20px 50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>TDP<span style={{ color: '#f5a623' }}>.</span></div>
                    
                    <Space size="large" style={{ color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: '16px' }}>
                        <span className="hover-text" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Trang chủ</span>
                        
                        {/* Bấm vào đây sẽ cuộn xuống Menu */}
                        <span className="hover-text" onClick={() => scrollToSection(menuRef)}>Thực đơn</span>
                        
                        {/* Bấm vào đây sẽ mở Modal Đặt bàn */}
                        <span className="hover-text" onClick={() => setShowBooking(true)}>Đặt bàn</span>
                        
                        {/* Bấm vào đây sẽ cuộn xuống Liên hệ */}
                        <span className="hover-text" onClick={() => scrollToSection(contactRef)}>Liên hệ</span>

                        {user && (
                            <span onClick={() => setShowHistory(true)} style={{ color: '#f5a623', fontWeight: 'bold' }}>
                                <HistoryOutlined /> Lịch sử đơn
                            </span>
                        )}
                    </Space>

                    <Space>
                        <Input placeholder="Tìm món ăn..." prefix={<SearchOutlined style={{ color: '#ccc' }} />} style={{ borderRadius: '20px', background: 'transparent', border: '1px solid #aaa', color: '#fff', width: 200 }} className="search-input-home" />
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                <span style={{ fontWeight: 'bold' }}><UserOutlined /> {user.fullName}</span>
                                <Button type="text" ghost icon={<LogoutOutlined />} onClick={handleLogout} title="Đăng xuất" />
                            </div>
                        ) : (
                            <Button type="default" ghost onClick={onLogin} style={{ borderRadius: '4px' }}>Đăng nhập</Button>
                        )}
                        <Button type="primary" icon={<ShoppingCartOutlined />} style={{ background: 'transparent', border: '1px solid #f5a623', color: '#f5a623' }} />
                    </Space>
                </div>

                {/* Hero Content */}
                <div style={{ textAlign: 'center', marginTop: '15vh', color: '#fff' }}>
                    <Title level={1} style={{ color: '#fff', fontSize: '60px', marginBottom: '10px', letterSpacing: '2px' }}>
                        {banners.length > 0 && banners[0].title ? banners[0].title : "Nhà hàng TDP"}
                        <span style={{ color: '#f5a623' }}>.</span>
                    </Title>
                    <Paragraph style={{ color: '#ddd', fontSize: '18px', marginBottom: '40px' }}>Chúng tôi rất hân hạnh được phục vụ quý thực khách</Paragraph>
                    <Space size="large">
                        <Button size="large" onClick={() => scrollToSection(menuRef)} style={{ background: 'transparent', color: '#fff', borderColor: '#fff', width: '180px', height: '50px', fontWeight: 'bold' }}>XEM THỰC ĐƠN</Button>
                        
                        {/* Nút Đặt Bàn (Gọi Modal) */}
                        <Button size="large" onClick={() => setShowBooking(true)} style={{ background: 'transparent', color: '#f5a623', borderColor: '#f5a623', width: '180px', height: '50px', fontWeight: 'bold' }}>ĐẶT BÀN NGAY</Button>
                    </Space>
                </div>
            </div>
        </div>
    );

    // --- 2. MENU SECTION ---
    const MenuSection = () => {
        const displayedProducts = products.filter(p => p.category && String(p.category.id) === activeTab);

        return (
            // GẮN REF VÀO ĐÂY ĐỂ CUỘN TỚI
            <div ref={menuRef} style={{ padding: '80px 50px', background: '#fff' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Text type="secondary" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px', color: '#999' }}>Thực đơn</Text>
                    <Title level={2} style={{ marginTop: '5px', color: '#1f2937', textTransform: 'uppercase' }}>Bạn muốn ăn gì?</Title>
                    <div style={{ width: '60px', height: '3px', background: '#f5a623', margin: '15px auto' }}></div>
                </div>

                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab}
                    centered 
                    items={categories.map(cat => ({
                        key: String(cat.id),
                        label: cat.name.toUpperCase()
                    }))} 
                    tabBarStyle={{ marginBottom: 40, fontWeight: 'bold' }} 
                />

                <Row gutter={[32, 32]}>
                    {displayedProducts.length > 0 ? displayedProducts.map(item => (
                        <Col xs={24} sm={12} md={6} key={item.id}>
                            <Card 
                                hoverable 
                                cover={<img alt={item.name} src={item.imageUrl || "https://placehold.co/300x200?text=No+Image"} style={{ height: '220px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />} 
                                bordered={false} 
                                style={{ textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', borderRadius: '8px' }}
                            >
                                <Title level={5} style={{ margin: '10px 0', textTransform: 'uppercase', minHeight: '50px' }}>{item.name}</Title>
                                <Text strong style={{ fontSize: '18px', color: '#cf1322', display: 'block', marginBottom: '15px' }}>
                                    {item.price.toLocaleString()} ₫
                                </Text>
                                <Button type="primary" style={{ background: '#f5a623', borderColor: '#f5a623', fontWeight: 'bold' }}>Đặt món</Button>
                            </Card>
                        </Col>
                    )) : (
                        <Col span={24} style={{ textAlign: 'center', padding: '40px' }}>
                            <Text type="secondary">Chưa có món ăn nào trong danh mục này.</Text>
                        </Col>
                    )}
                </Row>
                
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Button size="large" style={{ borderColor: '#f5a623', color: '#f5a623', width: '200px' }}>XEM TẤT CẢ</Button>
                </div>
            </div>
        );
    };

    // --- 3. CONTACT SECTION ---
    const ContactSection = () => (
        // GẮN REF LIÊN HỆ VÀO ĐÂY
        <div ref={contactRef} style={{ padding: '80px 50px', background: '#fff' }}>
            <Row gutter={[48, 48]}>
                <Col xs={24} lg={12}>
                    <div style={{ width: '100%', height: '350px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '30px', position: 'relative', border: '1px solid #ddd' }}>
                        <img src="https://media.wired.com/photos/59269cd37034dc5f91becd64/master/w_2560%2Cc_limit/GoogleMapTA.jpg" alt="Google Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#cf1322', fontSize: '40px', dropShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                            <EnvironmentOutlined />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ background: '#ffcc00', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginRight: '20px', flexShrink: 0 }}>
                                <EnvironmentOutlined style={{ fontSize: '20px', color: '#fff' }} />
                            </div>
                            <div>
                                <Title level={5} style={{ margin: 0, fontWeight: 'bold' }}>Địa chỉ:</Title>
                                <Text style={{ color: '#666' }}>182 Lê Duẩn, Bến Thủy, TP Vinh, Nghệ An</Text>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ background: '#ffcc00', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginRight: '20px', flexShrink: 0 }}>
                                <MailOutlined style={{ fontSize: '20px', color: '#fff' }} />
                            </div>
                            <div>
                                <Title level={5} style={{ margin: 0, fontWeight: 'bold' }}>Email:</Title>
                                <Text style={{ color: '#666' }}>tdp.restaurant@gmail.com</Text>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ background: '#ffcc00', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginRight: '20px', flexShrink: 0 }}>
                                <PhoneOutlined style={{ fontSize: '20px', color: '#fff' }} />
                            </div>
                            <div>
                                <Title level={5} style={{ margin: 0, fontWeight: 'bold' }}>Điện thoại:</Title>
                                <Text style={{ color: '#666' }}>+84 865.888.333</Text>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <Form layout="vertical" size="large">
                            <Row gutter={16}>
                                <Col span={12}><Form.Item name="name"><Input placeholder="Họ và tên" style={{ borderRadius: '4px' }} /></Form.Item></Col>
                                <Col span={12}><Form.Item name="email"><Input placeholder="Địa chỉ Email" style={{ borderRadius: '4px' }} /></Form.Item></Col>
                            </Row>
                            <Form.Item name="message"><Input.TextArea rows={8} placeholder="Nội dung tin nhắn" style={{ borderRadius: '4px', resize: 'none' }} /></Form.Item>
                            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit" style={{ background: '#ffcc00', borderColor: '#ffcc00', color: '#333', fontWeight: 'bold', padding: '0 40px', height: '45px' }}>Gửi tin nhắn</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );

    const FooterSection = () => (
        <div style={{ background: '#1a1a1a', color: '#999', padding: '60px 50px 20px 50px' }}>
            <Row gutter={[40, 40]}>
                <Col xs={24} md={8}>
                    <Title level={3} style={{ color: '#fff', marginBottom: '20px' }}>TDP RESTAURANT.</Title>
                    <p>KTX KHU B, Đ. Mạc Đĩnh Chi, Khu phố Tân Hòa, Dĩ An, Bình Dương</p>
                    <p><b>Hotline:</b> 0865.888.333</p>
                    <p><b>Email:</b> contact@tdp.vn</p>
                </Col>
                <Col xs={12} md={8}>
                    <Title level={5} style={{ color: '#fff', marginBottom: '20px', textTransform: 'uppercase' }}>Liên kết</Title>
                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                        <li><a href="#" style={{ color: '#999' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Trang chủ</a></li>
                        <li><a href="#" style={{ color: '#999' }} onClick={() => scrollToSection(menuRef)}>Thực đơn</a></li>
                        <li><a href="#" style={{ color: '#999' }} onClick={() => setShowBooking(true)}>Đặt bàn</a></li>
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

    return (
        <Layout className="layout" style={{ background: '#fff' }}>
            <HeroSection />
            <MenuSection />
            <ContactSection />
            <FooterSection />
            
            {/* Modal Lịch Sử Đơn Hàng */}
            <CustomerOrderHistory 
                user={user} 
                open={showHistory} 
                onCancel={() => setShowHistory(false)} 
            />

            {/* Modal Đặt Bàn */}
            <BookingModal 
                open={showBooking} 
                onCancel={() => setShowBooking(false)} 
                user={user} 
            />
        </Layout>
    );
};

export default HomePage;