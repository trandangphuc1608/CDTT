import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, InputNumber, message, Space, Tag, Divider } from 'antd';
import { ShoppingCartOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ProductDetailModal = ({ open, onCancel, product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    // Reset quantity when opening a new product
    useEffect(() => {
        if (open) setQuantity(1);
    }, [open, product]);

    if (!product) return null;

    const handleAddToCart = () => {
        // 1. Get existing cart from LocalStorage
        const cartData = JSON.parse(localStorage.getItem('fastfood_cart')) || [];
        
        // 2. Check if product already exists in cart
        const existingItem = cartData.find(item => item.id === product.id);
        
        if (existingItem) {
            // If exists, update quantity
            existingItem.qty += quantity;
        } else {
            // If new, add to cart
            cartData.push({ ...product, qty: quantity });
        }

        // 3. Save back to LocalStorage
        localStorage.setItem('fastfood_cart', JSON.stringify(cartData));

        // --- DISPATCH STORAGE EVENT FOR REAL-TIME UPDATE ---
        window.dispatchEvent(new Event("storage")); 
        // --------------------------------------------------

        message.success(`Đã thêm ${quantity} ${product.name} vào giỏ!`);
        
        // 4. Call callback function (if any)
        if (onAddToCart) onAddToCart();
        
        onCancel(); // Close modal
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            centered
            closeIcon={<CloseOutlined style={{ fontSize: 20 }} />}
        >
            <div style={{ display: 'flex', gap: 30, flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
                <div style={{ flex: 1 }}>
                    <img 
                        src={product.imageUrl || "https://placehold.co/400x400"} 
                        alt={product.name} 
                        style={{ width: '100%', borderRadius: 12, objectFit: 'cover', border: '1px solid #f0f0f0' }} 
                    />
                </div>
                <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column' }}>
                    <Title level={3} style={{ marginBottom: 10 }}>{product.name}</Title>
                    <Title level={4} type="danger" style={{ margin: 0 }}>{product.price.toLocaleString()} ₫</Title>
                    
                    <div style={{ margin: '15px 0' }}>
                        <Tag color="green">Còn hàng</Tag>
                        <Tag color="blue">Được yêu thích</Tag>
                    </div>

                    <Paragraph style={{ color: '#666', fontSize: 15 }}>
                        {product.description || "Món ăn được chế biến từ nguyên liệu tươi ngon, hương vị đậm đà khó quên."}
                    </Paragraph>

                    <Divider style={{ margin: '15px 0' }} />

                    <div style={{ marginTop: 'auto' }}>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>Số lượng:</Text>
                        <Space size="large" align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                            <InputNumber 
                                min={1} 
                                max={50} 
                                value={quantity} 
                                onChange={setQuantity} 
                                size="large" 
                                style={{ width: 100 }}
                            />
                            <Button 
                                type="primary" 
                                size="large" 
                                icon={<ShoppingCartOutlined />} 
                                onClick={handleAddToCart}
                                style={{ background: '#cf1322', borderColor: '#cf1322', height: 45, padding: '0 30px', fontWeight: 'bold' }}
                            >
                                THÊM VÀO GIỎ
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProductDetailModal;