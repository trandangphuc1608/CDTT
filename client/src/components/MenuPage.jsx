import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Row, Col, Typography, Card, Tabs, message, Spin } from 'antd';
import ProductDetailModal from './ProductDetailModal';

const { Title, Text } = Typography;

const MenuPage = ({ user, onLogin, onOrder, searchText, initialCategoryId }) => { 
    const [categories, setCategories] = useState([]); 
    const [products, setProducts] = useState([]);     
    const [activeTab, setActiveTab] = useState('');   
    const [loading, setLoading] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // --- THÊM ĐOẠN NÀY ĐỂ TỰ ĐỘNG CUỘN LÊN ĐẦU TRANG ---
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 
    // -----------------------------------------------------

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, prodRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/categories'),
                    axios.get('http://localhost:8081/api/products')
                ]);
                setCategories(catRes.data);
                
                // Logic chọn tab
                if (catRes.data.length > 0) {
                    if (initialCategoryId) {
                        setActiveTab(String(initialCategoryId));
                    } else {
                        setActiveTab(String(catRes.data[0].id)); 
                    }
                }
                
                setProducts(prodRes.data);
            } catch (error) { 
                console.error("Lỗi tải thực đơn:", error); 
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [initialCategoryId]); 

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowDetail(true);
    };

    const handleAddToCartFromModal = (orderItem) => {
        if (user) {
            onOrder(); 
        } else {
            message.info("Vui lòng Đăng nhập để đặt món!");
            onLogin();
        }
    };

    const displayedProducts = products.filter(p => {
        const matchSearch = searchText ? p.name.toLowerCase().includes(searchText.toLowerCase()) : true;
        const matchCategory = searchText ? true : (p.category && String(p.category.id) === activeTab);
        return matchSearch && matchCategory;
    });

    return (
        <div style={{ padding: '20px 50px', background: '#fff', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Title level={2} style={{ color: '#1f2937', textTransform: 'uppercase' }}>
                    {searchText ? `Kết quả tìm kiếm: "${searchText}"` : "THỰC ĐƠN HÔM NAY"}
                </Title>
                <div style={{ width: '60px', height: '3px', background: '#f5a623', margin: '10px auto' }}></div>
            </div>

            {!searchText && categories.length > 0 && (
                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab} 
                    centered 
                    items={categories.map(cat => ({ 
                        key: String(cat.id), 
                        label: <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{cat.name.toUpperCase()}</span> 
                    }))} 
                    tabBarStyle={{ marginBottom: 40 }} 
                />
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
            ) : (
                <Row gutter={[24, 24]}>
                    {displayedProducts.length > 0 ? displayedProducts.map(item => (
                        <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                            <Card 
                                hoverable 
                                cover={<img alt={item.name} src={item.imageUrl || "https://placehold.co/300x200?text=No+Image"} style={{ height: '200px', objectFit: 'cover' }} />} 
                                bordered={false} 
                                style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }} 
                                onClick={() => handleProductClick(item)} 
                            >
                                <Title level={5} style={{ margin: '10px 0', minHeight: '40px', fontSize: '16px' }}>{item.name}</Title>
                                <Text strong style={{ fontSize: '18px', color: '#cf1322', display: 'block', marginBottom: '15px' }}>{item.price.toLocaleString()} ₫</Text>
                                <Button 
                                    type="primary" block 
                                    style={{ background: '#f5a623', borderColor: '#f5a623', fontWeight: 'bold' }} 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleProductClick(item);
                                    }}
                                >
                                    CHỌN MÓN
                                </Button>
                            </Card>
                        </Col>
                    )) : (
                        <Col span={24} style={{ textAlign: 'center', padding: '50px' }}>
                            <Text type="secondary" style={{ fontSize: '18px' }}>
                                {searchText ? `Không tìm thấy món nào tên "${searchText}"` : "Đang cập nhật thực đơn..."}
                            </Text>
                        </Col>
                    )}
                </Row>
            )}

            <ProductDetailModal 
                open={showDetail} 
                onCancel={() => setShowDetail(false)} 
                product={selectedProduct}
                onAddToCart={handleAddToCartFromModal}
            />
        </div>
    );
};

export default MenuPage;