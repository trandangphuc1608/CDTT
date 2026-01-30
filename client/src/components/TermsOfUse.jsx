import React, { useEffect } from 'react';
import { Typography, Card, Divider } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const TermsOfUse = () => {
    
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
                <FileProtectOutlined style={{ fontSize: 48, color: '#f5a623', marginBottom: 20 }} />
                <Title level={1} style={{ color: 'white', margin: 0 }}>Điều Khoản Sử Dụng</Title>
                <Text style={{ color: '#ccc', fontSize: 16 }}>Quy định chung khi sử dụng dịch vụ tại TDP Restaurant</Text>
            </div>

            <div style={{ maxWidth: 1000, margin: '-40px auto 0', padding: '0 20px', position: 'relative', zIndex: 2 }}>
                <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    
                    <Title level={4}>1. Giới thiệu</Title>
                    <Paragraph>
                        Chào mừng quý khách đến với website của <b>TDP Restaurant</b>. Khi quý khách truy cập vào trang web của chúng tôi, quý khách đồng ý với các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Quy định và Điều kiện sử dụng này, vào bất cứ lúc nào.
                    </Paragraph>

                    <Title level={4}>2. Hướng dẫn sử dụng website</Title>
                    <Paragraph>
                        - Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp.<br/>
                        - Nghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục đích thương mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu không được chúng tôi cho phép bằng văn bản.
                    </Paragraph>

                    <Divider />

                    <Title level={4}>3. Quy định về Đặt bàn & Đặt món</Title>
                    <Paragraph>
                        <Text strong>Đặt bàn:</Text> Quý khách vui lòng đến đúng giờ đã hẹn. Chúng tôi sẽ giữ bàn trong vòng 15 phút kể từ giờ hẹn. Sau thời gian này, yêu cầu đặt bàn có thể bị hủy.<br/>
                        <Text strong>Đặt món:</Text> Đơn hàng đã xác nhận sẽ được chế biến ngay. Nếu muốn hủy hoặc thay đổi, vui lòng liên hệ hotline trong vòng 5 phút sau khi đặt.
                    </Paragraph>

                    <Title level={4}>4. Giá cả và Thanh toán</Title>
                    <Paragraph>
                        Giá sản phẩm được niêm yết tại website là giá bán cuối cùng đã bao gồm thuế Giá trị gia tăng (VAT). Giá có thể thay đổi tùy thời điểm và chương trình khuyến mãi kèm theo.
                    </Paragraph>

                    <Divider />

                    <Title level={4}>5. Ý kiến khách hàng</Title>
                    <Paragraph>
                        Tất cả nội dung trang web và ý kiến phê bình của quý khách đều là tài sản của chúng tôi. Nếu chúng tôi phát hiện bất kỳ thông tin giả mạo nào, chúng tôi sẽ khóa tài khoản của quý khách ngay lập tức hoặc áp dụng các biện pháp khác theo quy định của pháp luật Việt Nam.
                    </Paragraph>
                </Card>
            </div>
        </div>
    );
};

export default TermsOfUse;