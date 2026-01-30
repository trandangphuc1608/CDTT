import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Result, Button, Spin, message, Card } from 'antd';

const PaymentReturn = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('processing'); // processing, success, error

    useEffect(() => {
        const processPayment = async () => {
            // 1. Lấy các tham số từ URL do VNPAY trả về
            const searchParams = new URLSearchParams(location.search);
            const responseCode = searchParams.get('vnp_ResponseCode');
            // const transactionStatus = searchParams.get('vnp_TransactionStatus');

            if (responseCode === '00') {
                // --- THANH TOÁN THÀNH CÔNG ---
                try {
                    // 2. Lấy lại dữ liệu từ LocalStorage (đã lưu bên CartPage trước khi đi)
                    const savedCart = localStorage.getItem('fastfood_cart');
                    const cartItems = savedCart ? JSON.parse(savedCart) : [];
                    
                    const savedUser = localStorage.getItem('fastfood_user');
                    const user = savedUser ? JSON.parse(savedUser) : null;

                    const tempShipping = localStorage.getItem('temp_shipping_info');
                    const shippingInfo = tempShipping ? JSON.parse(tempShipping) : {};

                    if (cartItems.length === 0) {
                        message.warning("Không tìm thấy giỏ hàng để lưu đơn!");
                        setStatus('error');
                        setLoading(false);
                        return;
                    }

                    // Tính lại tổng tiền để gửi xuống Backend (Backend sẽ check lại giá lần nữa)
                    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                    // 3. Chuẩn bị dữ liệu để Tạo Đơn Hàng (Khớp với OrderRequest bên Java)
                    const orderPayload = {
                        userId: user?.id || null,
                        customerName: shippingInfo.fullName || user?.fullName || "Khách VNPAY",
                        phone: shippingInfo.phone || user?.phone || "",
                        address: shippingInfo.address || user?.address || "",
                        paymentMethod: "VNPAY", // 👈 Báo Backend đây là đơn VNPAY
                        totalPrice: totalPrice,
                        items: cartItems.map(item => ({
                            productId: item.id,
                            quantity: item.quantity
                        }))
                    };

                    // 4. Gọi API Lưu Đơn Hàng
                    await axios.post('/api/orders', orderPayload);

                    // 5. QUAN TRỌNG: XÓA GIỎ HÀNG & DỮ LIỆU TẠM
                    localStorage.removeItem('fastfood_cart');
                    localStorage.removeItem('temp_shipping_info');
                    
                    // Phát sự kiện để Header cập nhật lại số lượng giỏ hàng về 0
                    window.dispatchEvent(new Event("storage")); 
                    window.dispatchEvent(new Event("cartUpdated"));

                    setStatus('success');
                    message.success("Thanh toán thành công! Đơn hàng đã được tạo.");

                } catch (error) {
                    console.error(error);
                    setStatus('error');
                    message.error("Lỗi khi lưu đơn hàng vào hệ thống!");
                }
            } else {
                // --- THANH TOÁN THẤT BẠI / HỦY BỎ ---
                setStatus('error');
                message.error("Giao dịch thất bại hoặc bị hủy!");
            }
            setLoading(false);
        };

        // Chạy hàm xử lý sau 1 khoảng delay ngắn để tránh lỗi render
        const timer = setTimeout(() => {
            processPayment();
        }, 500);

        return () => clearTimeout(timer);
    }, [location]);

    // --- GIAO DIỆN ---
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Spin size="large" />
                <h3 style={{ marginTop: 20 }}>Đang xử lý kết quả thanh toán...</h3>
            </div>
        );
    }

    return (
        <div style={{ padding: '50px 20px', display: 'flex', justifyContent: 'center', background: '#f0f2f5', minHeight: '100vh' }}>
            <Card style={{ width: 600, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {status === 'success' ? (
                    <Result
                        status="success"
                        title="Thanh toán thành công!"
                        subTitle="Đơn hàng của bạn đã được chuyển xuống bếp. Vui lòng đợi món ăn nhé!"
                        extra={[
                            <Button type="primary" key="home" onClick={() => navigate('/')}>
                                Về Trang Chủ
                            </Button>,
                            <Button key="history" onClick={() => navigate('/order-history')}>
                                Xem Lịch Sử Đơn
                            </Button>,
                        ]}
                    />
                ) : (
                    <Result
                        status="error"
                        title="Thanh toán thất bại"
                        subTitle="Có lỗi xảy ra hoặc bạn đã hủy giao dịch. Vui lòng thử lại."
                        extra={[
                            <Button type="primary" key="cart" onClick={() => navigate('/cart')}>
                                Quay lại Giỏ hàng
                            </Button>,
                            <Button key="home" onClick={() => navigate('/')}>
                                Về Trang Chủ
                            </Button>,
                        ]}
                    />
                )}
            </Card>
        </div>
    );
};

export default PaymentReturn;