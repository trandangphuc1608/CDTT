import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Typography, Button, Empty, Spin, message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const FavoriteProducts = ({ user }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const res = await axios.get(`/api/favorites/${user.id}`);
            setFavorites(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await axios.post(`/api/favorites/toggle/${user.id}/${productId}`);
            message.success("Đã xóa khỏi danh sách yêu thích");
            fetchFavorites(); // Load lại danh sách
        } catch (error) {
            message.error("Lỗi khi xóa");
        }
    };

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    if (!user) return <Empty description="Vui lòng đăng nhập để xem món yêu thích" />;
    if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin /></div>;

    return (
        <div style={{ padding: '20px' }}>
            <Title level={3} style={{ marginBottom: 20 }}>Món Ăn Yêu Thích Của Bạn ❤️</Title>
            
            {favorites.length === 0 ? (
                <Empty description="Bạn chưa yêu thích món nào cả" />
            ) : (
                <Row gutter={[16, 16]}>
                    {favorites.map(item => (
                        <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                cover={
                                    <img 
                                        alt={item.name} 
                                        src={item.imageUrl || item.image} 
                                        style={{ height: 180, objectFit: 'cover' }}
                                        onClick={() => handleProductClick(item.id)}
                                    />
                                }
                                actions={[
                                    <DeleteOutlined key="delete" onClick={() => handleRemove(item.id)} style={{ color: 'red' }} />,
                                    <ShoppingCartOutlined key="cart" onClick={() => handleProductClick(item.id)} />
                                ]}
                            >
                                <Card.Meta 
                                    title={item.name} 
                                    description={<Text type="danger" strong>{item.price.toLocaleString()} ₫</Text>} 
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default FavoriteProducts;