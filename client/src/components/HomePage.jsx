import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Typography, Carousel, Form, Input, Space, Card, Badge, Rate, message, Spin } from 'antd';
import { 
    HeartFilled, 
    HeartOutlined, 
    ArrowRightOutlined, 
    AppstoreFilled, 
    FireFilled, 
    SendOutlined 
} from '@ant-design/icons';
import BookingModal from './BookingModal';

// Cấu hình Base URL (Nên để ở App.js, nhưng để đây cho chắc nếu chạy file lẻ)
// axios.defaults.baseURL = 'http://localhost:8081';

const { Title, Text, Paragraph } = Typography;

const HomePage = ({ onGoToMenu, user }) => {
    const navigate = useNavigate();
    
    // --- STATE ---
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [showBooking, setShowBooking] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    
    // State lưu danh sách ID các món đã yêu thích
    const [favoriteIds, setFavoriteIds] = useState([]);

    const contactRef = useRef(null);

    // Load dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Load các API cơ bản
                const [bannerRes, catRes, productRes] = await Promise.all([
                    axios.get('/api/banners/active').catch(() => ({ data: [] })),
                    axios.get('/api/categories').catch(() => ({ data: [] })),
                    axios.get('/api/products').catch(() => ({ data: [] }))
                ]);

                if(bannerRes.data?.length > 0) setBanners(bannerRes.data);
                else setBanners([
                    { id: 1, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070' },
                    { id: 2, imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070' }
                ]);

                setCategories(catRes.data);
                
                const allProducts = productRes.data;
                // Lấy 4 món đầu tiên làm nổi bật
                setFeaturedProducts(allProducts.slice(0, 4));
                // Lấy 4 món cuối cùng làm gợi ý (hoặc random nếu muốn)
                setSuggestedProducts([...allProducts].reverse().slice(0, 4));

                // 2. Load danh sách yêu thích (Nếu đã đăng nhập)
                if (user && user.id) {
                    try {
                        const favRes = await axios.get(`/api/favorites/${user.id}`);
                        const ids = favRes.data.map(item => item.id);
                        setFavoriteIds(ids);
                    } catch (e) { console.log("Lỗi tải yêu thích", e); }
                }

            } catch (error) {
                console.error("Lỗi tải dữ liệu trang chủ:", error);
                message.error("Không thể tải dữ liệu trang chủ");
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [user]); 

    // Xử lý chuyển trang chi tiết
    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    // Xử lý Thả tim / Bỏ tim
    const handleToggleFavorite = async (e, productId) => {
        e.stopPropagation(); 

        if (!user) {
            message.warning("Vui lòng đăng nhập để yêu thích món này!");
            return;
        }

        try {
            await axios.post(`/api/favorites/toggle/${user.id}/${productId}`);
            
            if (favoriteIds.includes(productId)) {
                setFavoriteIds(prev => prev.filter(id => id !== productId)); 
                message.success("Đã xóa khỏi danh sách yêu thích");
            } else {
                setFavoriteIds(prev => [...prev, productId]); 
                message.success("Đã thêm vào danh sách yêu thích ❤️");
            }
        } catch (error) {
            console.error(error);
            message.error("Lỗi kết nối!");
        }
    };

    // --- COMPONENT CARD SẢN PHẨM ---
    const ProductCard = ({ item, badgeText, badgeColor }) => {
        const isFav = favoriteIds.includes(item.id); 

        return (
            <Badge.Ribbon text={badgeText} color={badgeColor} style={{ display: badgeText ? 'block' : 'none' }}>
                <Card 
                    hoverable 
                    cover={
                        <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
                            <img 
                                alt={item.name} 
                                src={item.imageUrl || item.image || "https://placehold.co/300x200?text=Food"} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                            
                            <Button
                                shape="circle"
                                size="large"
                                onClick={(e) => handleToggleFavorite(e, item.id)}
                                style={{
                                    position: 'absolute', top: 10, left: 10, zIndex: 10, border: 'none',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    color: isFav ? '#ff4d4f' : '#ccc',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}
                                icon={isFav ? <HeartFilled style={{ fontSize: '20px' }} /> : <HeartOutlined style={{ fontSize: '20px' }} />}
                            />
                        </div>
                    }
                    style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', border: 'none' }}
                    bodyStyle={{ padding: '20px' }}
                    onClick={() => handleProductClick(item)} 
                >
                    <Title level={5} style={{ margin: '0 0 10px 0', fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                    </Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Text strong style={{ color: '#cf1322', fontSize: 20 }}>{item.price?.toLocaleString()} ₫</Text>
                            <div style={{ fontSize: 12, color: '#999' }}>
                                <Rate disabled defaultValue={5} style={{ fontSize: 12, color: '#f5a623' }} /> (5.0)
                            </div>
                        </div>
                        <Button 
                            type="primary" shape="circle" icon={<ArrowRightOutlined />} size="large"
                            style={{ background: '#1f2937', borderColor: '#1f2937' }} 
                        />
                    </div>
                </Card>
            </Badge.Ribbon>
        );
    };

    // --- CÁC SECTION CON ---
    const HeroSection = () => (
        <div style={{ position: 'relative', height: '85vh', width: '100%', overflow: 'hidden' }}>
            <Carousel autoplay autoplaySpeed={4000} effect="fade" dots={false}>
                {banners.map(banner => (
                    <div key={banner.id}>
                        <div style={{ backgroundImage: `url('${banner.imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', height: '85vh', width: '100%', filter: 'brightness(0.6)' }}></div>
                    </div>
                ))}
            </Carousel>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))' }}>
                <div style={{ textAlign: 'center', color: '#fff', maxWidth: '900px', padding: '0 20px' }}>
                    <Title level={1} style={{ color: '#fff', fontSize: 'clamp(40px, 5vw, 70px)', fontWeight: 900, marginBottom: '20px', letterSpacing: '3px', textTransform: 'uppercase', textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                        Thiên Đường <span style={{ color: '#f5a623' }}>Ẩm Thực</span>
                    </Title>
                    <Paragraph style={{ color: '#f0f0f0', fontSize: '20px', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px auto' }}>
                        Trải nghiệm hương vị tuyệt hảo, không gian sang trọng và dịch vụ đẳng cấp ngay tại khuôn viên đại học.
                    </Paragraph>
                    <Space size="large" wrap>
                        <Button type="primary" size="large" onClick={() => onGoToMenu && onGoToMenu(null)} style={{ background: '#f5a623', borderColor: '#f5a623', height: '60px', padding: '0 50px', fontSize: '18px', fontWeight: 'bold', borderRadius: '30px', boxShadow: '0 10px 20px rgba(245, 166, 35, 0.4)' }}>XEM THỰC ĐƠN</Button>
                        <Button ghost size="large" onClick={() => setShowBooking(true)} style={{ color: '#fff', borderColor: '#fff', height: '60px', padding: '0 50px', fontSize: '18px', fontWeight: 'bold', borderRadius: '30px', borderWidth: '2px' }}>ĐẶT BÀN NGAY</Button>
                    </Space>
                </div>
            </div>
        </div>
    );

    const CategorySection = () => (
        <div style={{ padding: '0 20px', marginTop: '-80px', position: 'relative', zIndex: 20 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '40px' }}>
                <Title level={4} style={{ textAlign: 'center', marginBottom: 40, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <AppstoreFilled style={{ color: '#cf1322', marginRight: 10 }} /> Khám phá thực đơn
                </Title>
                <Row gutter={[32, 32]} justify="center">
                    {categories.map(cat => (
                        <Col key={cat.id} xs={12} sm={8} md={4}>
                            <div onClick={() => onGoToMenu && onGoToMenu(cat.id)} style={{ textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ width: 100, height: 100, margin: '0 auto 15px', borderRadius: '50%', background: '#fff7e6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #f5a623', boxShadow: '0 5px 15px rgba(245, 166, 35, 0.2)' }}>
                                    <img src={cat.imageUrl || "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"} alt={cat.name} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                                </div>
                                <Text strong style={{ fontSize: 16, color: '#4b5563' }}>{cat.name}</Text>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );

    const FeaturedSection = () => (
        <div style={{ padding: '100px 20px 60px', background: '#f9fafb' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <Text strong style={{ color: '#f5a623', letterSpacing: '2px', textTransform: 'uppercase' }}>Sự lựa chọn hàng đầu</Text>
                    <Title level={2} style={{ color: '#1f2937', fontSize: 36, marginTop: 10 }}>Món Ngon <span style={{ color: '#cf1322' }}>Nổi Bật</span></Title>
                    <div style={{ width: '80px', height: '4px', background: '#cf1322', margin: '20px auto', borderRadius: 2 }}></div>
                </div>
                <Row gutter={[24, 24]}>
                    {featuredProducts.map(item => (
                        <Col xs={24} sm={12} md={6} key={item.id}>
                            <ProductCard item={item} badgeText="Hot" badgeColor="#cf1322" />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );

    const PromoSection = () => (
        <div style={{ padding: '100px 20px', background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974")', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center', textAlign: 'center', color: '#fff' }}>
            <FireFilled style={{ fontSize: 50, color: '#f5a623', marginBottom: 20 }} />
            <Title level={2} style={{ color: '#fff', fontSize: 'clamp(30px, 4vw, 48px)', marginBottom: 20 }}>KHUYẾN MÃI MÙA HÈ</Title>
            <Title level={3} style={{ color: '#f5a623', margin: '0 0 40px 0', fontSize: 'clamp(40px, 5vw, 60px)' }}>GIẢM GIÁ 50%</Title>
            <Paragraph style={{ color: '#ddd', fontSize: 18, maxWidth: 600, margin: '0 auto 40px' }}>Áp dụng cho tất cả các đơn hàng đặt bàn trước trong khung giờ vàng 14:00 - 17:00 hàng ngày.</Paragraph>
            <Button type="primary" size="large" onClick={() => onGoToMenu && onGoToMenu(null)} style={{ height: 55, padding: '0 40px', fontSize: 16, fontWeight: 'bold', background: '#cf1322', borderColor: '#cf1322', borderRadius: 4, boxShadow: '0 10px 20px rgba(207, 19, 34, 0.4)' }}>ĐẶT HÀNG NGAY</Button>
        </div>
    );

    const SuggestionSection = () => (
        <div style={{ padding: '80px 20px', background: '#fff' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <Title level={2} style={{ color: '#1f2937', margin: 0 }}><HeartFilled style={{ color: '#cf1322', marginRight: 10 }} /> Gợi ý cho bạn</Title>
                </div>
                <Row gutter={[24, 24]}>
                    {suggestedProducts.map(item => (
                        <Col xs={24} sm={12} md={6} key={item.id}>
                             <ProductCard item={item} badgeText="New" badgeColor="#87d068" />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );

    const ContactSection = () => {
        const [form] = Form.useForm();
        const [loading, setLoading] = useState(false);

        const onFinish = async (values) => {
            setLoading(true);
            try {
                // Gọi API gửi phản hồi (Đảm bảo backend có API này)
                await axios.post('/api/contacts', values);
                message.success('Tin nhắn của bạn đã được gửi thành công!');
                form.resetFields(); 
            } catch (error) {
                console.error("Lỗi gửi tin nhắn:", error);
                message.error('Có lỗi xảy ra, vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div ref={contactRef} style={{ padding: '80px 20px', background: '#f3f4f6' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} lg={12}>
                            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', height: 450 }}>
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.232359628292!2d106.80047917480625!3d10.869923657376377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1706691456281!5m2!1svi!2s" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map"></iframe>
                            </div>
                        </Col>
                        <Col xs={24} lg={12}>
                            <div style={{ padding: '0 20px' }}>
                                <Text strong style={{ color: '#cf1322', letterSpacing: '1px', textTransform: 'uppercase' }}>Liên hệ với chúng tôi</Text>
                                <Title level={2} style={{ marginTop: 10, marginBottom: 20 }}>Gửi tin nhắn ngay</Title>
                                <Paragraph style={{ color: '#666', marginBottom: 30 }}>Chúng tôi luôn lắng nghe ý kiến đóng góp của bạn để cải thiện chất lượng dịch vụ tốt hơn mỗi ngày.</Paragraph>
                                
                                <Form 
                                    form={form}
                                    layout="vertical" 
                                    size="large"
                                    onFinish={onFinish}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                                                <Input placeholder="Họ tên của bạn" style={{ borderRadius: 8 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                                                <Input placeholder="Email liên hệ" style={{ borderRadius: 8 }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item name="message" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                                        <Input.TextArea rows={5} placeholder="Nội dung tin nhắn..." style={{ borderRadius: 8 }} />
                                    </Form.Item>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        icon={<SendOutlined />} 
                                        loading={loading}
                                        style={{ background: '#1f2937', borderColor: '#1f2937', height: 50, padding: '0 40px', borderRadius: 8, fontSize: 16 }}
                                    >
                                        GỬI TIN NHẮN
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    };

    if (loadingData) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;

    return (
        <div style={{ background: '#fff', overflowX: 'hidden' }}>
            <HeroSection />
            <CategorySection />
            <FeaturedSection />
            <PromoSection />
            <SuggestionSection />
            <ContactSection />
            
            {/* Modal đặt bàn (Đảm bảo file BookingModal tồn tại) */}
            <BookingModal open={showBooking} onCancel={() => setShowBooking(false)} user={user} />
        </div>
    );
};

export default HomePage;