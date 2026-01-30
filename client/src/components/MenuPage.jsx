import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Row, Col, Typography, Card, Tabs, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const { Title, Text } = Typography;

// Đã bỏ props onOrder vì không cần xử lý thêm vào giỏ ở trang này nữa
const MenuPage = ({ user, onLogin, searchText, initialCategoryId }) => { 
    const [categories, setCategories] = useState([]); 
    const [products, setProducts] = useState([]);     
    const [activeTab, setActiveTab] = useState('');   
    const [loading, setLoading] = useState(false);
    
    // 2. Khởi tạo navigate
    const navigate = useNavigate();

    // 3. Đã XÓA các state và logic liên quan đến Modal (showDetail, selectedProduct...)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, prodRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/products')
                ]);
                
                setCategories(catRes.data);
                
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
                message.error("Không thể tải thực đơn lúc này.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [initialCategoryId]); 

    // 4. Hàm chuyển trang sang chi tiết
    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    const displayedProducts = products.filter(p => {
        const matchSearch = searchText ? p.name.toLowerCase().includes(searchText.toLowerCase()) : true;
        const matchCategory = searchText ? true : (p.category && String(p.category.id) === activeTab);
        return matchSearch && matchCategory;
    });

    return (
        <div style={{ padding: '20px 50px', background: '#fff', minHeight: '80vh' }}>
            
            {/* TIÊU ĐỀ */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Title level={2} style={{ color: '#1f2937', textTransform: 'uppercase' }}>
                    {searchText ? `Kết quả tìm kiếm: "${searchText}"` : "THỰC ĐƠN HÔM NAY"}
                </Title>
                <div style={{ width: '60px', height: '3px', background: '#f5a623', margin: '10px auto' }}></div>
            </div>

            {/* TABS DANH MỤC */}
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

            {/* LIST SẢN PHẨM */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
            ) : (
                <Row gutter={[24, 24]}>
                    {displayedProducts.length > 0 ? displayedProducts.map(item => (
                        <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                            <Card 
                                hoverable 
                                cover={
                                    <img 
                                        alt={item.name} 
                                        src={item.imageUrl || item.image || "https://placehold.co/300x200?text=No+Image"} 
                                        style={{ height: '200px', objectFit: 'cover' }} 
                                    />
                                } 
                                bordered={false} 
                                style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }} 
                                
                                // Click vào Card thì chuyển trang
                                onClick={() => handleProductClick(item)} 
                            >
                                <Title level={5} style={{ margin: '10px 0', minHeight: '40px', fontSize: '16px' }}>{item.name}</Title>
                                <Text strong style={{ fontSize: '18px', color: '#cf1322', display: 'block', marginBottom: '15px' }}>
                                    {item.price.toLocaleString()} ₫
                                </Text>
                                <Button 
                                    type="primary" block 
                                    style={{ background: '#f5a623', borderColor: '#f5a623', fontWeight: 'bold' }} 
                                    onClick={(e) => { 
                                        e.stopPropagation(); // Chặn sự kiện nổi bọt
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
                                {searchText ? `Không tìm thấy món nào tên "${searchText}"` : "Danh mục này chưa có món ăn."}
                            </Text>
                        </Col>
                    )}
                </Row>
            )}
            
            {/* Đã xóa <ProductDetailModal /> */}
        </div>
    );
};

export default MenuPage;