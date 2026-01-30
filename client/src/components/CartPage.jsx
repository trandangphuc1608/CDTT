import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Card, Row, Col, Button, Input, Typography, Modal, message, Space, Table, Divider, Empty } from "antd";
import { 
  DeleteOutlined, MinusOutlined, PlusOutlined, ArrowLeftOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import CustomerHeader from './CustomerHeader'; 

const { Content } = Layout;
const { Title, Text } = Typography;

const CartPage = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('fastfood_cart');
        try {
            const parsed = savedCart ? JSON.parse(savedCart) : [];
            if (!Array.isArray(parsed)) return [];
            return parsed.map(item => ({
                ...item,
                id: item.id,
                name: item.name,
                imageUrl: item.imageUrl,
                price: Number(item.price) || 0, 
                quantity: Number(item.quantity || item.qty || 1) 
            })).filter(item => item.id && item.price >= 0);
        } catch (e) {
            return [];
        }
    });

    const [user, setUser] = useState(null);
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Tải thông tin User
    useEffect(() => {
        const savedUser = localStorage.getItem("fastfood_user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Lỗi đọc user", e);
            }
        }
    }, []);

    // 2. Lưu giỏ hàng mỗi khi thay đổi
    useEffect(() => {
        localStorage.setItem('fastfood_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("cartUpdated"));
    }, [cart]);

    // --- CÁC HÀM XỬ LÝ ---
    const updateQty = (id, delta) => {
        const exist = cart.find((x) => x.id === id);
        if (!exist) return;
        const currentQty = Number(exist.quantity) || 1;
        const newQty = currentQty + delta;

        if (newQty <= 0) {
            removeItem(id);
        } else {
            setCart(cart.map((x) => (x.id === id ? { ...exist, quantity: newQty } : x)));
        }
    };

    const removeItem = (id) => {
        const newCart = cart.filter((x) => x.id !== id);
        setCart(newCart);
        message.success("Đã xóa món khỏi giỏ hàng");
    };

    // Tính tổng tiền
    const subTotal = cart.reduce((sum, i) => {
        const price = Number(i.price) || 0;
        const qty = Number(i.quantity) || 1;
        return sum + (price * qty);
    }, 0);

    const finalTotal = subTotal - (subTotal * discount / 100);

    // --- XỬ LÝ VOUCHER ---
    const handleApplyVoucher = async () => {
        if (!voucherCode) return;
        try {
            const res = await axios.post(`/api/vouchers/check`, { code: voucherCode });
            setDiscount(res.data.discountPercent);
            message.success(`Áp dụng mã giảm ${res.data.discountPercent}% thành công!`);
        } catch (error) { 
            setDiscount(0); 
            message.error(error.response?.data || "Mã không hợp lệ!"); 
        }
    };

    // --- THANH TOÁN TIỀN MẶT (CASH) ---
    const handleCheckout = async () => {
        if (cart.length === 0) return message.warning("Giỏ hàng đang trống!");
        
        try {
            const payload = {
                userId: user?.id || null, 
                customerName: user ? user.fullName : "Khách vãng lai",
                phone: user?.phone || "",
                address: user?.address || "",
                totalPrice: finalTotal,
                paymentMethod: "CASH", // Mặc định là CASH
                items: cart.map((i) => ({ 
                    productId: i.id, 
                    quantity: Number(i.quantity) || 1 
                })) 
            };

            await axios.post("/api/orders", payload);

            setCart([]); 
            localStorage.removeItem('fastfood_cart');
            window.dispatchEvent(new Event("cartUpdated"));

            setIsModalOpen(true);
            
        } catch (err) { 
            message.error("Lỗi đặt hàng! Vui lòng thử lại.");
        }
    };

    // --- THANH TOÁN VNPAY (UPDATE ĐỂ LƯU INFO TRƯỚC) ---
    const handleVnPayPayment = async () => {
        if (cart.length === 0) return message.warning("Giỏ hàng đang trống!");
        
        try {
            // [QUAN TRỌNG] 1. Lưu thông tin giao hàng tạm thời vào LocalStorage
            // Để trang PaymentReturn có thể đọc lại sau khi quay về từ VNPay
            // Nếu không có bước này, trang PaymentReturn sẽ không biết đơn hàng của ai
            const tempShippingInfo = {
                fullName: user ? user.fullName : "Khách vãng lai (VNPAY)",
                phone: user?.phone || "",
                address: user?.address || ""
            };
            localStorage.setItem("temp_shipping_info", JSON.stringify(tempShippingInfo));

            // 2. Gọi API lấy link thanh toán
            const amount = Math.round(finalTotal); 
            const userIdParam = user?.id ? `&userId=${user.id}` : "";
            const res = await axios.get(`/api/payment/create_payment?amount=${amount}${userIdParam}`);
            
            if (res.data && res.data.url) {
                // 3. Chuyển hướng sang VNPAY
                window.location.href = res.data.url;
            } else {
                message.error("Không lấy được link thanh toán!");
            }
        } catch (error) { 
            message.error("Lỗi kết nối VNPAY!"); 
        }
    };

    const handleFinishOrder = () => {
        setCart([]); setDiscount(0); setVoucherCode(""); setIsModalOpen(false);
        navigate('/'); 
    };

    const handleLogout = () => {
        localStorage.removeItem("fastfood_user");
        localStorage.removeItem("fastfood_token");
        setUser(null);
        navigate('/login');
    };

    // --- CỘT BẢNG ---
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <img 
                        src={record.imageUrl || "https://placehold.co/60x60"} 
                        alt={text} 
                        style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} 
                    />
                    <Text strong>{text}</Text>
                </div>
            )
        },
        { 
            title: 'Đơn giá', 
            dataIndex: 'price', 
            key: 'price', 
            render: (price) => `${(Number(price) || 0).toLocaleString()} ₫` 
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<MinusOutlined />} onClick={() => updateQty(record.id, -1)} />
                    <Input 
                        value={Number(record.quantity) || 1} 
                        style={{ width: 40, textAlign: 'center' }} 
                        readOnly 
                    />
                    <Button size="small" icon={<PlusOutlined />} onClick={() => updateQty(record.id, 1)} />
                </Space>
            )
        },
        { 
            title: 'Thành tiền', 
            key: 'total', 
            render: (_, record) => {
                const p = Number(record.price) || 0;
                const q = Number(record.quantity) || 1;
                return <Text type="danger" strong>{(p * q).toLocaleString()} ₫</Text>;
            }
        },
        { 
            title: '', 
            key: 'action', 
            render: (_, record) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(record.id)} /> 
        }
    ];

    return (
        <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <CustomerHeader user={user} onLogout={handleLogout} />
            
            <Content style={{ padding: '30px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                <div style={{ marginBottom: 20 }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>Tiếp tục mua sắm</Button>
                </div>
                
                <Row gutter={24}>
                    <Col xs={24} lg={16}>
                        <Card title={`Giỏ hàng của bạn (${cart.length} món)`} bordered={false} style={{ borderRadius: 12 }}>
                            <Table 
                                columns={columns} 
                                dataSource={cart} 
                                rowKey="id" 
                                pagination={false} 
                                locale={{ emptyText: <Empty description="Giỏ hàng đang trống" /> }} 
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title="Cộng giỏ hàng" bordered={false} style={{ borderRadius: 12 }}>
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
                                <Input 
                                    placeholder="Mã giảm giá" 
                                    value={voucherCode} 
                                    onChange={e => setVoucherCode(e.target.value.toUpperCase())} 
                                />
                                <Button type="primary" onClick={handleApplyVoucher}>Áp dụng</Button>
                            </Space.Compact>

                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button 
                                    type="primary" danger size="large" block 
                                    onClick={handleCheckout} 
                                    disabled={cart.length === 0}
                                    style={{ height: 50, fontWeight: 'bold' }}
                                >
                                    THANH TOÁN TIỀN MẶT
                                </Button>
                                <Button 
                                    type="primary" size="large" block 
                                    style={{ background: '#0057D9', height: 50, fontWeight: 'bold' }} 
                                    onClick={handleVnPayPayment} 
                                    disabled={cart.length === 0}
                                >
                                    THANH TOÁN VNPAY
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Modal 
                title="Thanh toán thành công" 
                open={isModalOpen} 
                onCancel={handleFinishOrder} 
                footer={[<Button key="close" type="primary" onClick={handleFinishOrder}>Về trang chủ</Button>]}
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Title level={4} style={{ color: '#52c41a' }}>Đặt hàng thành công!</Title>
                    <p>Cảm ơn bạn đã đặt hàng. Đơn hàng đang được nhà bếp xử lý.</p>
                </div>
            </Modal>
        </Layout>
    );
};

export default CartPage;