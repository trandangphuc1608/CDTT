import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Row, Col, Typography, Card, Tabs, message } from 'antd';

const { Title, Text } = Typography;

const MenuPage = ({ user, onLogin, onOrder, searchText }) => { 
    const [categories, setCategories] = useState([]); 
    const [products, setProducts] = useState([]);     
    const [activeTab, setActiveTab] = useState('');   

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/categories'),
                    axios.get('http://localhost:8081/api/products')
                ]);
                setCategories(catRes.data);
                if (catRes.data.length > 0) setActiveTab(String(catRes.data[0].id)); 
                setProducts(prodRes.data);
            } catch (error) { console.error("Lỗi tải thực đơn:", error); }
        };
        fetchData();
    }, []);

    const handleOrderClick = () => {
        if (user) onOrder();
        else { message.info("Vui lòng Đăng nhập để đặt món!"); onLogin(); }
    };

    // Logic lọc sản phẩm khi có searchText
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

            {!searchText && (
                <Tabs activeKey={activeTab} onChange={setActiveTab} centered items={categories.map(cat => ({ key: String(cat.id), label: <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{cat.name.toUpperCase()}</span> }))} tabBarStyle={{ marginBottom: 40 }} />
            )}

            <Row gutter={[24, 24]}>
                {displayedProducts.length > 0 ? displayedProducts.map(item => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <Card hoverable cover={<img alt={item.name} src={item.imageUrl || "https://placehold.co/300x200?text=No+Image"} style={{ height: '200px', objectFit: 'cover' }} />} bordered={false} style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }} onClick={handleOrderClick}>
                            <Title level={5} style={{ margin: '10px 0', minHeight: '40px', fontSize: '16px' }}>{item.name}</Title>
                            <Text strong style={{ fontSize: '18px', color: '#cf1322', display: 'block', marginBottom: '15px' }}>{item.price.toLocaleString()} ₫</Text>
                            <Button type="primary" block style={{ background: '#f5a623', borderColor: '#f5a623', fontWeight: 'bold' }} onClick={(e) => { e.stopPropagation(); handleOrderClick(); }}>CHỌN MÓN</Button>
                        </Card>
                    </Col>
                )) : (
                    <Col span={24} style={{ textAlign: 'center', padding: '50px' }}><Text type="secondary" style={{ fontSize: '18px' }}>Không tìm thấy món ăn nào phù hợp.</Text></Col>
                )}
            </Row>
        </div>
    );
};

export default MenuPage;