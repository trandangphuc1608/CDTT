import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Row, Col, Typography, message, Spin, Divider, Tag, InputNumber } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Cấu hình Base URL nếu chưa có trong App.js (đề phòng)
// axios.defaults.baseURL = 'http://localhost:8081';

const ProductDetailPage = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1); // State số lượng muốn mua

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Lấy thông tin món ăn
                const res = await axios.get(`/api/products/${id}`);
                setProduct(res.data);
                
                // Kiểm tra yêu thích (Nếu user đã đăng nhập)
                if (user) {
                   try {
                       const favRes = await axios.get(`/api/favorites/${user.id}`);
                       const isFav = favRes.data.some(p => p.id === parseInt(id));
                       setIsFavorite(isFav);
                   } catch (e) { console.log("Lỗi check favorite", e); }
                }
            } catch (error) {
                console.error(error);
                message.error("Không thể tải thông tin món ăn!");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, user]);

    // --- 🛒 LOGIC THÊM VÀO GIỎ HÀNG (QUAN TRỌNG) ---
    const handleAddToCart = () => {
        // 1. Dùng đúng tên kho là 'fastfood_cart'
        let cart = JSON.parse(localStorage.getItem('fastfood_cart')) || [];

        const existingItemIndex = cart.findIndex((item) => item.id === product.id);

        if (existingItemIndex !== -1) {
            // 2. Dùng đúng tên biến là 'quantity' (không dùng qty)
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }

        // 3. Lưu lại đúng tên kho
        localStorage.setItem('fastfood_cart', JSON.stringify(cart));

        // 4. Báo hiệu cập nhật
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('cartUpdated'));

        message.success(`Đã thêm ${quantity} ${product.name} vào giỏ!`);
    };

    // --- ❤️ LOGIC YÊU THÍCH ---
    const handleToggleFavorite = async () => {
        if (!user) {
            message.warning("Bạn cần đăng nhập để thích món ăn này!");
            return;
        }
        try {
            await axios.post(`/api/favorites/toggle/${user.id}/${product.id}`);
            setIsFavorite(!isFavorite);
            message.success(isFavorite ? "Đã bỏ thích" : "Đã thích món ăn này ❤️");
        } catch (error) {
            message.error("Lỗi kết nối server");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" /></div>;
    if (!product) return <div style={{ textAlign: 'center', marginTop: 100 }}><h3>Không tìm thấy món ăn!</h3></div>;

    return (
        <div style={{ padding: '40px 20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/')} 
                    style={{ marginBottom: 20, border: 'none', boxShadow: 'none', background: 'transparent', color: '#666' }}
                >
                    Quay lại thực đơn
                </Button>

                <Card bordered={false} style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.05)' }}>
                    <Row gutter={[48, 48]} align="middle">
                        {/* Cột Trái: Ảnh */}
                        <Col xs={24} md={12}>
                            <div style={{ 
                                borderRadius: 20, 
                                overflow: 'hidden', 
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                position: 'relative',
                                height: 400
                            }}>
                                <img 
                                    src={product.imageUrl || "https://placehold.co/500x500?text=No+Image"} 
                                    alt={product.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                {!product.isAvailable && (
                                    <div style={{
                                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontSize: 30, fontWeight: 'bold'
                                    }}>
                                        HẾT HÀNG
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* Cột Phải: Thông tin */}
                        <Col xs={24} md={12}>
                            <div style={{ padding: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <Tag color={product.isAvailable ? "success" : "error"} style={{ fontSize: 14, padding: '5px 10px' }}>
                                        {product.isAvailable ? "ĐANG MỞ BÁN" : "TẠM HẾT HÀNG"}
                                    </Tag>
                                    <Tag color="orange" style={{ fontSize: 14 }}>{product.category?.name || "Món Ngon"}</Tag>
                                </div>
                                
                                <Title level={1} style={{ margin: '15px 0', fontSize: 36 }}>{product.name}</Title>
                                
                                <Title level={2} style={{ color: '#cf1322', margin: '0 0 20px', fontWeight: 900 }}>
                                    {product.price?.toLocaleString()} ₫
                                </Title>

                                <Divider style={{ margin: '20px 0' }} />

                                <Paragraph style={{ fontSize: 16, color: '#666', lineHeight: 1.8, minHeight: 80 }}>
                                    {product.description || "Món ăn này được chế biến từ những nguyên liệu tươi ngon nhất, mang lại hương vị đậm đà khó quên."}
                                </Paragraph>

                                <div style={{ marginTop: 30 }}>
                                    <div style={{ marginBottom: 15, fontWeight: 'bold' }}>Số lượng:</div>
                                    <div style={{ display: 'flex', gap: 15 }}>
                                        <InputNumber 
                                            min={1} 
                                            max={50} 
                                            value={quantity} 
                                            onChange={(val) => setQuantity(val)} 
                                            size="large"
                                            style={{ borderRadius: 8, width: 80 }}
                                            disabled={!product.isAvailable}
                                        />
                                        
                                        <Button 
                                            type="primary" 
                                            size="large" 
                                            icon={<ShoppingCartOutlined />} 
                                            onClick={handleAddToCart}
                                            disabled={!product.isAvailable}
                                            style={{ 
                                                flex: 1, height: 50, fontSize: 18, fontWeight: 'bold', 
                                                borderRadius: 12, background: '#1f2937', borderColor: '#1f2937' 
                                            }}
                                        >
                                            Thêm vào giỏ hàng
                                        </Button>
                                        
                                        <Button 
                                            size="large" 
                                            icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                                            onClick={handleToggleFavorite}
                                            style={{ 
                                                height: 50, width: 50, borderRadius: 12,
                                                borderColor: isFavorite ? '#ff4d4f' : '#d9d9d9'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetailPage;