import React, { useEffect } from 'react';
import { Typography, Card, Divider, Row, Col } from 'antd';
import { SafetyCertificateOutlined, LockOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicy = () => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ background: '#f0f2f5', minHeight: '100vh', paddingBottom: 60 }}>
            {/* Banner Header */}
            <div style={{ 
                background: '#1f2937', 
                padding: '60px 20px', 
                textAlign: 'center',
                color: 'white'
            }}>
                <SafetyCertificateOutlined style={{ fontSize: 48, color: '#f5a623', marginBottom: 20 }} />
                <Title level={1} style={{ color: 'white', margin: 0 }}>Chính Sách Bảo Mật</Title>
                <Text style={{ color: '#ccc', fontSize: 16 }}>Cam kết bảo vệ thông tin khách hàng tuyệt đối</Text>
            </div>

            <div style={{ maxWidth: 1000, margin: '-40px auto 0', padding: '0 20px', position: 'relative', zIndex: 2 }}>
                <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    
                    <Title level={4}>1. Mục đích và phạm vi thu thập</Title>
                    <Paragraph>
                        Việc thu thập dữ liệu chủ yếu trên website <b>TDP Restaurant</b> bao gồm: email, điện thoại, tên đăng nhập, mật khẩu đăng nhập, địa chỉ khách hàng. Đây là các thông tin mà chúng tôi cần thành viên cung cấp bắt buộc khi đăng ký sử dụng dịch vụ và để chúng tôi liên hệ xác nhận khi khách hàng đăng ký sử dụng dịch vụ trên website nhằm đảm bảo quyền lợi cho cho người tiêu dùng.
                    </Paragraph>

                    <Title level={4}>2. Phạm vi sử dụng thông tin</Title>
                    <Paragraph>
                        Chúng tôi sử dụng thông tin thành viên cung cấp để:
                    </Paragraph>
                    <ul>
                        <li><Text>Cung cấp các dịch vụ đến thành viên (Giao hàng, đặt bàn).</Text></li>
                        <li><Text>Gửi các thông báo về các hoạt động trao đổi thông tin giữa thành viên và website.</Text></li>
                        <li><Text>Ngăn ngừa các hoạt động phá hủy tài khoản người dùng của thành viên hoặc các hoạt động giả mạo thành viên.</Text></li>
                        <li><Text>Liên lạc và giải quyết với thành viên trong những trường hợp đặc biệt.</Text></li>
                    </ul>

                    <Divider />

                    <Title level={4}>3. Thời gian lưu trữ thông tin</Title>
                    <Paragraph>
                        Dữ liệu cá nhân của Thành viên sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự thành viên đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân thành viên sẽ được bảo mật trên máy chủ của <b>TDP Restaurant</b>.
                    </Paragraph>

                    <Title level={4}>4. Cam kết bảo mật thông tin cá nhân khách hàng</Title>
                    <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
                        <Col xs={24} md={8}>
                            <Card size="small" style={{ background: '#f9f9f9', textAlign: 'center' }}>
                                <LockOutlined style={{ fontSize: 24, color: '#cf1322', marginBottom: 10 }} />
                                <Paragraph strong>Bảo mật tuyệt đối</Paragraph>
                                <Text type="secondary" style={{ fontSize: 13 }}>Thông tin của bạn được mã hóa và bảo vệ theo tiêu chuẩn an toàn cao nhất.</Text>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" style={{ background: '#f9f9f9', textAlign: 'center' }}>
                                <UserOutlined style={{ fontSize: 24, color: '#1677ff', marginBottom: 10 }} />
                                <Paragraph strong>Không chia sẻ</Paragraph>
                                <Text type="secondary" style={{ fontSize: 13 }}>Không cung cấp thông tin cho bên thứ 3 nếu không có sự đồng ý của bạn.</Text>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" style={{ background: '#f9f9f9', textAlign: 'center' }}>
                                <GlobalOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 10 }} />
                                <Paragraph strong>Tuân thủ pháp luật</Paragraph>
                                <Text type="secondary" style={{ fontSize: 13 }}>Tuân thủ các quy định về an toàn thông tin mạng của Việt Nam.</Text>
                            </Card>
                        </Col>
                    </Row>

                    <Divider />

                    <Title level={4}>5. Thông tin liên hệ</Title>
                    <Paragraph>
                        Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:
                    </Paragraph>
                    <Paragraph>
                        <b>TDP RESTAURANT</b><br />
                        📍 Địa chỉ: KTX KHU B, Đ. Mạc Đĩnh Chi, Khu phố Tân Hòa, Dĩ An, Bình Dương<br />
                        📧 Email: trandangphuc1608@gmail.com<br />
                        📞 Hotline: 0981255021
                    </Paragraph>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicy;