import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, Row, Col, Typography, Carousel, Form, Input, Space, Card, Tag, Rate, Avatar } from 'antd';
import { 
    HeartOutlined, 
    ArrowRightOutlined, AppstoreOutlined
} from '@ant-design/icons';

import BookingModal from './BookingModal';
import ProductDetailModal from './ProductDetailModal';

const { Title, Text, Paragraph } = Typography;

const HomePage = ({ onGoToMenu, user }) => {
    // --- STATE ---
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);

    const [showBooking, setShowBooking] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const contactRef = useRef(null);
    
    // Load dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Banner
                const bannerRes = await axios.get('http://localhost:8081/api/banners/active');
                if(bannerRes.data?.length > 0) setBanners(bannerRes.data);
                else setBanners([{ id: 0, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', title: 'Nhà hàng TDP' }]);

                // 2. Danh mục
                const catRes = await axios.get('http://localhost:8081/api/categories');
                setCategories(catRes.data);

                // 3. Sản phẩm
                const productRes = await axios.get('http://localhost:8081/api/products');
                const allProducts = productRes.data;

                setFeaturedProducts(allProducts.slice(0, 4));
                const shuffled = [...allProducts].reverse(); 
                setSuggestedProducts(shuffled.slice(0, 4));

            } catch (error) {
                console.error("Lỗi tải dữ liệu trang chủ");
            }
        };
        fetchData();
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowDetail(true);
    };

    // --- 1. HERO SECTION ---
    const HeroSection = () => (
        <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
            {/* ... Phần Carousel giữ nguyên ... */}
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

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#fff', maxWidth: '800px', padding: '0 20px' }}>
                    
                    {/* --- SỬA TIÊU ĐỀ TO Ở ĐÂY --- */}
                    {/* Xóa đoạn {banners.length...} đi và thay bằng chữ của bạn */}
                    <Title level={1} style={{ color: '#fff', fontSize: '60px', marginBottom: '10px', letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        THIÊN ĐƯỜNG ẨM THỰC
                        <span style={{ color: '#f5a623' }}>.</span>
                    </Title>
                    
                    {/* --- SỬA DÒNG MÔ TẢ NHỎ Ở ĐÂY --- */}
                    <Paragraph style={{ color: '#eee', fontSize: '20px', marginBottom: '40px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        Món ngon chuẩn vị, không gian sang trọng, phục vụ tận tâm.
                    </Paragraph>

                    <Space size="large">
                        <Button size="large" onClick={() => onGoToMenu(null)} style={{ background: 'transparent', color: '#fff', borderColor: '#fff', width: '200px', height: '55px', fontWeight: 'bold', fontSize: '16px' }}>XEM THỰC ĐƠN</Button>
                        <Button size="large" onClick={() => setShowBooking(true)} style={{ background: '#f5a623', color: '#fff', borderColor: '#f5a623', width: '200px', height: '55px', fontWeight: 'bold', fontSize: '16px' }}>ĐẶT BÀN NGAY</Button>
                    </Space>
                </div>
            </div>
        </div>
    );

    // --- 2. CATEGORY SECTION (CLICK ĐỂ CHUYỂN TAB) ---
    const CategorySection = () => (
        <div style={{ padding: '40px 20px', background: '#fff', marginTop: -60, position: 'relative', zIndex: 20 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '30px' }}>
                <Title level={4} style={{ textAlign: 'center', marginBottom: 20, textTransform: 'uppercase', color: '#cf1322' }}>
                    <AppstoreOutlined /> Danh mục món ăn
                </Title>
                <Row gutter={[24, 24]} justify="center">
                    {categories.map(cat => (
                        <Col key={cat.id} xs={12} sm={8} md={4}>
                            <div 
                                onClick={() => onGoToMenu(cat.id)} // Gửi ID danh mục
                                style={{ textAlign: 'center', cursor: 'pointer', transition: '0.3s' }}
                                className="category-item"
                            >
                                <div style={{ 
                                    width: 80, height: 80, margin: '0 auto 10px', 
                                    borderRadius: '50%', background: '#fff7e6', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid #ffd591'
                                }}>
                                    <img 
                                        src={cat.imageUrl || "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"} 
                                        alt={cat.name}
                                        style={{ width: '50%', height: '50%', objectFit: 'contain' }}
                                    />
                                </div>
                                <Text strong style={{ fontSize: 15 }}>{cat.name}</Text>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );

    // --- 3. PRODUCT CARD COMPONENT ---
    const ProductCard = ({ item, isSuggestion }) => (
        <Card 
            hoverable 
            cover={<img alt={item.name} src={item.imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
            style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            onClick={() => handleProductClick(item)} 
        >
            {isSuggestion && <Tag color="#87d068" style={{ position: 'absolute', top: 10, right: 10 }}>Gợi ý</Tag>}
            <Title level={5} style={{ margin: '5px 0', minHeight: 45 }}>{item.name}</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ color: '#cf1322', fontSize: 16 }}>{item.price.toLocaleString()} ₫</Text>
                <Button type="primary" shape="circle" icon={<ArrowRightOutlined />} style={{ background: '#f5a623', borderColor: '#f5a623' }} />
            </div>
        </Card>
    );

    // --- 4. FEATURED & SUGGESTION ---
    const FeaturedSection = () => (
        <div style={{ padding: '60px 50px', background: '#fafafa' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <Title level={2} style={{ color: '#1f2937', textTransform: 'uppercase', margin: 0 }}>MÓN NGON NỔI BẬT</Title>
                <div style={{ width: '60px', height: '3px', background: '#f5a623', margin: '15px auto' }}></div>
            </div>
            <Row gutter={[24, 24]}>
                {featuredProducts.map(item => (
                    <Col xs={24} sm={12} md={6} key={item.id}><ProductCard item={item} /></Col>
                ))}
            </Row>
        </div>
    );

    const SuggestionSection = () => (
        <div style={{ padding: '60px 50px', background: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <Title level={2} style={{ color: '#1f2937', textTransform: 'uppercase', margin: 0 }}>
                    <HeartOutlined style={{ color: '#cf1322' }} /> CÓ THỂ BẠN SẼ THÍCH
                </Title>
            </div>
            <Row gutter={[24, 24]}>
                {suggestedProducts.map(item => (
                    <Col xs={24} sm={12} md={6} key={item.id}><ProductCard item={item} isSuggestion={true} /></Col>
                ))}
            </Row>
        </div>
    );

    // --- 5. PROMO ---
    const PromoSection = () => (
        <div style={{ 
            padding: '80px 20px', 
            background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070")',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed', 
            textAlign: 'center',
            color: '#fff'
        }}>
            {/* ĐÃ SỬA NỘI DUNG TẠI ĐÂY */}
            <Title level={2} style={{ color: '#f5a623', fontSize: 40 }}>Khuyến Mãi Mùa Hè - Giảm 50%</Title>
            <Title level={3} style={{ color: '#fff', margin: '20px 0' }}>Trải nghiệm ẩm thực tuyệt vời với các món ăn tươi ngon nhất.</Title>
            
            <Button type="primary" size="large" onClick={() => onGoToMenu(null)} style={{ marginTop: 20, height: 50, padding: '0 40px', fontSize: 18, background: '#cf1322', borderColor: '#cf1322' }}>
                ĐẶT HÀNG NGAY
            </Button>
        </div>
    );

    // --- 6. CONTACT (MAP KTX KHU B) ---
    const ContactSection = () => (
        <div ref={contactRef} style={{ padding: '80px 50px', background: '#fafafa' }}>
            <Row gutter={[48, 48]}>
                <Col xs={24} lg={12}>
                    <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.068279867496!2d106.77976837480649!3d10.88243328927315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d89aad780e49%3A0x54542761d4c22175!2zS8O9IHTDumMgeMOhIEtodSBCIMSQSBRHIFRQLkHCMQ!5e0!3m2!1svi!2s!4v1709628000000!5m2!1svi!2s"
                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map"
                        ></iframe>
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
                        <Title level={4}>Gửi tin nhắn</Title>
                        <Form layout="vertical" size="large">
                            <Row gutter={16}>
                                <Col span={12}><Form.Item name="name"><Input placeholder="Họ tên" /></Form.Item></Col>
                                <Col span={12}><Form.Item name="email"><Input placeholder="Email" /></Form.Item></Col>
                            </Row>
                            <Form.Item name="message"><Input.TextArea rows={6} placeholder="Nội dung..." /></Form.Item>
                            <Button type="primary" htmlType="submit" block style={{ background: '#cf1322', borderColor: '#cf1322', height: 45 }}>GỬI NGAY</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );

    return (
        <div style={{ background: '#fff', overflowX: 'hidden' }}>
            <HeroSection />
            <CategorySection />
            <FeaturedSection />
            <PromoSection />
            <SuggestionSection />
            <ContactSection />
            <BookingModal open={showBooking} onCancel={() => setShowBooking(false)} user={user} />
            <ProductDetailModal 
                open={showDetail} 
                onCancel={() => setShowDetail(false)} 
                product={selectedProduct}
                onAddToCart={() => onGoToMenu(null)}
            />
        </div>
    );
};

export default HomePage;