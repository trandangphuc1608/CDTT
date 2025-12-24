import React from 'react';
import { Row, Col, Typography, Card, Timeline, Button, Divider, Image } from 'antd';
import { HeartOutlined, StarOutlined, SafetyCertificateOutlined, TeamOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AboutPage = ({ onGoToMenu }) => {
    return (
        <div style={{ background: '#fff' }}>
            {/* 1. HERO BANNER */}
            <div style={{ 
                height: '400px', 
                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                textAlign: 'center',
                padding: '0 20px'
            }}>
                <Title style={{ color: '#fff', fontSize: '48px', margin: 0 }}>CÂU CHUYỆN CỦA TDP FOOD</Title>
                <Paragraph style={{ color: '#eee', fontSize: '18px', marginTop: 20, maxWidth: 600 }}>
                    Nơi hội tụ tinh hoa ẩm thực đường phố với tiêu chuẩn nhà hàng 5 sao.
                </Paragraph>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px' }}>
                
                {/* 2. SỨ MỆNH & TẦM NHÌN */}
                <Row gutter={[48, 48]} align="middle">
                    <Col xs={24} md={12}>
                        <Title level={2} style={{ color: '#cf1322' }}>Về Chúng Tôi</Title>
                        <Paragraph style={{ fontSize: '16px', lineHeight: 1.8, color: '#555' }}>
                            Được thành lập vào năm 2023, <b>TDP FOOD</b> bắt đầu từ một cửa hàng nhỏ với niềm đam mê cháy bỏng mang đến những món ăn nhanh nhưng vẫn đảm bảo dinh dưỡng và hương vị tuyệt hảo.
                        </Paragraph>
                        <Paragraph style={{ fontSize: '16px', lineHeight: 1.8, color: '#555' }}>
                            Chúng tôi tin rằng "Nhanh" không có nghĩa là "Qua loa". Mỗi nguyên liệu tại TDP FOOD đều được tuyển chọn kỹ lưỡng từ các nông trại sạch, chế biến ngay trong ngày để giữ trọn độ tươi ngon.
                        </Paragraph>
                        <div style={{ marginTop: 30 }}>
                            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                                <SafetyCertificateOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>Nguyên liệu sạch 100%</Text>
                                    <div style={{ color: '#888' }}>Kiểm định an toàn vệ sinh thực phẩm mỗi ngày.</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 20 }}>
                                <HeartOutlined style={{ fontSize: 32, color: '#cf1322' }} />
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>Chế biến bằng cả trái tim</Text>
                                    <div style={{ color: '#888' }}>Đội ngũ đầu bếp tâm huyết với từng món ăn.</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <Image 
                            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop" 
                            style={{ borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        />
                    </Col>
                </Row>

                <Divider style={{ margin: '60px 0' }} />

                {/* 3. ĐỘI NGŨ CỦA CHÚNG TÔI */}
                <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <Title level={2}>Đội Ngũ Đầu Bếp</Title>
                    <Text type="secondary">Những người nghệ sĩ tạo nên hương vị</Text>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                        <Card hoverable cover={<img alt="chef" src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=600&auto=format&fit=crop" style={{ height: 300, objectFit: 'cover' }} />}>
                            <Card.Meta title="Gordon Ramsay (Fake)" description="Bếp Trưởng - 15 năm kinh nghiệm" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card hoverable cover={<img alt="chef" src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop" style={{ height: 300, objectFit: 'cover' }} />}>
                            <Card.Meta title="Christine Ha" description="Chuyên gia món Á - MasterChef" />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card hoverable cover={<img alt="chef" src="https://images.unsplash.com/photo-1607631568010-a87245c9099c?q=80&w=600&auto=format&fit=crop" style={{ height: 300, objectFit: 'cover' }} />}>
                            <Card.Meta title="Yan Can Cook" description="Cố vấn ẩm thực cao cấp" />
                        </Card>
                    </Col>
                </Row>

                {/* 4. CALL TO ACTION */}
                <div style={{ marginTop: 80, padding: 40, background: '#fff7e6', borderRadius: 16, textAlign: 'center' }}>
                    <Title level={3} style={{ color: '#d46b08' }}>Bạn đã sẵn sàng thưởng thức?</Title>
                    <Paragraph>Đừng chần chừ, hãy đến và trải nghiệm không gian ẩm thực tuyệt vời ngay hôm nay.</Paragraph>
                    <Button type="primary" size="large" onClick={onGoToMenu} style={{ background: '#fa8c16', borderColor: '#fa8c16', height: 50, padding: '0 40px', fontSize: 16 }}>
                        XEM THỰC ĐƠN NGAY <RightOutlined />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;