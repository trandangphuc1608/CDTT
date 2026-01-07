import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Card, Row, Col, Button, Input, Typography, Modal, message, Space, Table, Divider } from "antd";
import { 
  DeleteOutlined, MinusOutlined, PlusOutlined, ArrowLeftOutlined 
} from "@ant-design/icons";

import CustomerHeader from './CustomerHeader';

const { Content } = Layout;
const { Title, Text } = Typography;

const CartPage = ({ onGoHome }) => {
    // --- STATE ---
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('fastfood_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [user, setUser] = useState(null);
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("fastfood_user");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    // Lưu giỏ hàng mỗi khi thay đổi
    useEffect(() => {
        localStorage.setItem('fastfood_cart', JSON.stringify(cart));
    }, [cart]);

    const updateQty = (id, delta) => {
        const exist = cart.find((x) => x.id === id);
        if (!exist) return;
        if (exist.qty + delta <= 0) setCart(cart.filter((x) => x.id !== id));
        else setCart(cart.map((x) => (x.id === id ? { ...exist, qty: exist.qty + delta } : x)));
    };

    const removeItem = (id) => {
        setCart(cart.filter((x) => x.id !== id));
        message.success("Đã xóa món khỏi giỏ hàng");
    };

    const subTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const finalTotal = subTotal - (subTotal * discount / 100);

    const handleApplyVoucher = async () => {
        if (!voucherCode) return;
        try {
            const res = await axios.get(`http://localhost:8081/api/vouchers/check/${voucherCode}`);
            setDiscount(res.data.discountPercent);
            message.success(`Áp dụng mã giảm ${res.data.discountPercent}% thành công!`);
        } catch (error) { setDiscount(0); message.error("Mã không hợp lệ!"); }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return message.warning("Giỏ hàng đang trống!");
        try {
            // 1. Gửi đơn hàng lên Server
            await axios.post("http://localhost:8081/api/orders", { 
                items: cart.map((i) => ({ productId: i.id, quantity: i.qty })) 
            });

            // 2. XÓA GIỎ HÀNG NGAY LẬP TỨC (Fix lỗi treo đơn)
            setCart([]); 
            localStorage.removeItem('fastfood_cart');
            window.dispatchEvent(new Event("storage")); // Cập nhật số trên icon giỏ hàng về 0

            // 3. Hiện thông báo thành công
            setIsModalOpen(true);
            message.success("Đặt hàng thành công! Vui lòng đợi Bếp lên món.");
            
        } catch (err) { 
            console.error(err);
            message.error("Lỗi đặt hàng! Vui lòng thử lại."); 
        }
    };

    const handleVnPayPayment = async () => {
        if (cart.length === 0) return message.warning("Giỏ hàng đang trống!");
        try {
            const amount = finalTotal; 
            const res = await axios.get(`http://localhost:8081/api/payment/create_payment?amount=${amount}`);
            if (res.data && res.data.url) window.location.href = res.data.url;
        } catch (error) { message.error("Lỗi kết nối VNPAY!"); }
    };

    const handleFinishOrder = () => {
        setCart([]); setDiscount(0); setVoucherCode(""); setIsModalOpen(false);
        if(onGoHome) onGoHome(); // Quay về trang chủ sau khi xong
    };

    const handleLogout = () => {
        localStorage.removeItem("fastfood_user");
        window.location.reload(); 
    };

    // Cấu hình bảng
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <img src={record.imageUrl} alt={text} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
                    <Text strong>{text}</Text>
                </div>
            )
        },
        { title: 'Đơn giá', dataIndex: 'price', key: 'price', render: (price) => `${price.toLocaleString()} ₫` },
        {
            title: 'Số lượng',
            key: 'qty',
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<MinusOutlined />} onClick={() => updateQty(record.id, -1)} />
                    <Input value={record.qty} style={{ width: 40, textAlign: 'center' }} readOnly />
                    <Button size="small" icon={<PlusOutlined />} onClick={() => updateQty(record.id, 1)} />
                </Space>
            )
        },
        { title: 'Thành tiền', key: 'total', render: (_, record) => <Text type="danger" strong>{(record.price * record.qty).toLocaleString()} ₫</Text> },
        { title: '', key: 'action', render: (_, record) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(record.id)} /> }
    ];

    return (
        <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <CustomerHeader 
                user={user} onLogout={handleLogout} 
                onGoHome={() => window.location.reload()} 
                onGoToMenu={() => {}} 
                searchText="" onSearch={() => {}}
            />
            
            <Content style={{ padding: '30px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                <div style={{ marginBottom: 20 }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={onGoHome}>Tiếp tục mua sắm</Button>
                </div>
                
                <Row gutter={24}>
                    <Col xs={24} lg={16}>
                        <Card title={`Giỏ hàng của bạn (${cart.length} món)`} bordered={false}>
                            <Table columns={columns} dataSource={cart} rowKey="id" pagination={false} locale={{ emptyText: 'Giỏ hàng đang trống' }} />
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title="Cộng giỏ hàng" bordered={false}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text>Tạm tính:</Text><Text>{subTotal.toLocaleString()} ₫</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text>Giảm giá:</Text><Text type="success">-{ (subTotal * discount / 100).toLocaleString() } ₫</Text>
                            </div>
                            <Divider />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Title level={4}>Tổng cộng:</Title><Title level={4} type="danger">{finalTotal.toLocaleString()} ₫</Title>
                            </div>
                            
                            <Space.Compact style={{ width: '100%', marginBottom: 20 }}>
                                <Input placeholder="Mã giảm giá" value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} />
                                <Button type="primary" onClick={handleApplyVoucher}>Áp dụng</Button>
                            </Space.Compact>

                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="primary" danger size="large" block onClick={handleCheckout} disabled={cart.length === 0}>THANH TOÁN TIỀN MẶT</Button>
                                <Button type="primary" size="large" block style={{ background: '#0057D9' }} onClick={handleVnPayPayment} disabled={cart.length === 0}>THANH TOÁN VNPAY</Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Modal title="Thanh toán thành công" open={isModalOpen} onCancel={handleFinishOrder} footer={[<Button key="close" onClick={handleFinishOrder}>Đóng</Button>]}>
                <p>Cảm ơn bạn đã đặt hàng! Đơn hàng đang được xử lý.</p>
            </Modal>
        </Layout>
    );
};

export default CartPage;