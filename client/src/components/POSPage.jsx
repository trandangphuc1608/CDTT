import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from 'react-to-print';
import { Layout, Card, Row, Col, Button, Input, Typography, Modal, message, Segmented, Space, Avatar, Tag, Table } from "antd";
import { 
  ShoppingCartOutlined, DeleteOutlined, SearchOutlined, 
  PrinterOutlined, PlusOutlined, MinusOutlined, 
  LogoutOutlined, UserOutlined, UnorderedListOutlined, SyncOutlined
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

// --- COMPONENT HÓA ĐƠN ĐỂ IN ---
const InvoiceToPrint = React.forwardRef(({ cart, finalTotal, orderId, cashierName, orderDate }, ref) => (
  <div ref={ref} style={{ padding: '20px', width: '300px', margin: '0 auto', fontFamily: 'monospace' }}>
    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
      <Title level={4} style={{ margin: 0 }}>FASTFOOD STORE</Title>
      <Text style={{ fontSize: '12px' }}>ĐC: KTX Khu B</Text>
    </div>
    <hr style={{ borderTop: '1px dashed #000' }} />
    <div style={{ margin: '10px 0' }}>
      <Text strong>Hóa đơn: #{orderId}</Text><br/>
      <Text>Thu ngân: {cashierName}</Text><br/>
      <Text>Ngày: {orderDate ? new Date(orderDate).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}</Text>
    </div>
    <hr style={{ borderTop: '1px dashed #000' }} />
    <table style={{ width: '100%', fontSize: '12px' }}>
      <thead>
        <tr><th style={{ textAlign: 'left' }}>Món</th><th style={{ textAlign: 'center' }}>SL</th><th style={{ textAlign: 'right' }}>Tiền</th></tr>
      </thead>
      <tbody>
        {cart && cart.map((item, index) => {
            const name = item.product ? item.product.name : (item.name || 'Món ăn');
            const qty = item.quantity || item.qty || 0;
            const price = item.product ? item.product.price : item.price || 0;
            const total = price * qty;
            return (
                <tr key={index}>
                    <td style={{ textAlign: 'left' }}>{name}</td>
                    <td style={{ textAlign: 'center' }}>{qty}</td>
                    <td style={{ textAlign: 'right' }}>{total.toLocaleString()}</td>
                </tr>
            );
        })}
      </tbody>
    </table>
    <hr style={{ borderTop: '1px dashed #000' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }}>
      <span>TỔNG CỘNG:</span><span>{finalTotal ? Number(finalTotal).toLocaleString() : 0} đ</span>
    </div>
    <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
      <Text style={{ fontSize: '12px' }}>Cảm ơn quý khách & Hẹn gặp lại!</Text>
    </div>
  </div>
));

const POSPage = () => {
    const [activeTab, setActiveTab] = useState('pos'); 
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [printData, setPrintData] = useState({ cart: [], total: 0, orderId: null, date: null });
    const [orderList, setOrderList] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({ content: () => componentRef.current });

    useEffect(() => {
        fetchData();
        const savedUser = localStorage.getItem("fastfood_user");
        if (savedUser) {
            try {
                const u = JSON.parse(savedUser);
                setUser(u);
            } catch (e) {}
        }
        
        fetchOrders();
        // Tự động làm mới danh sách đơn hàng mỗi 10 giây
        const interval = setInterval(fetchOrders, 10000); 
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get("/api/products"),
                axios.get("/api/categories")
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) { console.error("Lỗi tải menu:", error); }
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await axios.get("/api/orders");
            let data = [];
            if (Array.isArray(res.data)) data = res.data;
            else if (res.data && Array.isArray(res.data.content)) data = res.data.content; 
            
            // Sắp xếp đơn mới nhất lên đầu
            const sortedOrders = data.sort((a, b) => b.id - a.id);
            setOrderList(sortedOrders);
        } catch (error) { console.error("Lỗi tải đơn hàng:", error); } 
        finally { setLoadingOrders(false); }
    };

    const addToCart = (p) => {
        const exist = cart.find((x) => x.id === p.id);
        if (exist) setCart(cart.map((x) => (x.id === p.id ? { ...exist, qty: exist.qty + 1 } : x)));
        else setCart([...cart, { ...p, qty: 1 }]);
        message.success(`Đã thêm ${p.name}`);
    };

    const updateQty = (id, delta) => {
        const exist = cart.find((x) => x.id === id);
        if (!exist) return;
        if (exist.qty + delta <= 0) setCart(cart.filter((x) => x.id !== id));
        else setCart(cart.map((x) => (x.id === id ? { ...exist, qty: exist.qty + delta } : x)));
    };

    const removeItem = (id) => setCart(cart.filter((x) => x.id !== id));
    const posTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    // --- THANH TOÁN TẠI QUẦY ---
    const handleCheckout = async () => {
        if (cart.length === 0) return message.warning("Giỏ hàng trống!");
        
        try {
            // Tạo đơn hàng
            const res = await axios.post("/api/orders", { 
                // Nếu là thu ngân tạo đơn, userId có thể để null hoặc ID của thu ngân (tùy logic BE)
                // Ở đây mình để null để BE hiểu là khách vãng lai, nhưng gắn tên người tạo vào customerName
                userId: null, 
                customerName: `Khách tại quầy (TN: ${user?.fullName || 'N/A'})`,
                items: cart.map((i) => ({ productId: i.id, quantity: i.qty })) 
            });

            const newOrderId = res.data?.id || res.data?.data?.id;

            if (!newOrderId) {
                message.error("Lỗi: Server không trả về mã đơn hàng!");
                return;
            }

            // Cập nhật trạng thái thành ĐÃ THANH TOÁN (PAID) ngay lập tức
            await axios.put(`/api/orders/${newOrderId}/status`, { status: 'PAID' });
            
            // Chuẩn bị dữ liệu in
            setPrintData({ 
                cart: cart, 
                total: posTotal, 
                orderId: newOrderId, 
                date: new Date(),
                cashierName: user?.fullName
            });
            
            setIsModalOpen(true); // Mở popup in bill
            setCart([]); 
            message.success("Thanh toán thành công!");
            fetchOrders(); // Làm mới danh sách

        } catch (err) { 
            console.error(err);
            message.error("Lỗi thanh toán! Vui lòng kiểm tra lại server."); 
        }
    };
    
    // --- XỬ LÝ ĐƠN HÀNG ONLINE ---
    const handleProcessPayment = async (orderId) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: 'PAID' });
            message.success(`Đã thu tiền đơn #${orderId}`);
            fetchOrders();
        } catch (error) { message.error("Lỗi cập nhật trạng thái!"); }
    };

    const handleReprint = (order) => {
        // Lấy thông tin để in lại bill cũ
        const creatorName = order.user ? order.user.fullName : (order.customerName || 'Khách vãng lai');
        
        setPrintData({
            cart: order.items || [], // Backend cần trả về list items trong order
            total: order.totalPrice || order.totalAmount, 
            orderId: order.id, 
            date: order.createdAt || order.orderDate,
            cashierName: creatorName
        });
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("fastfood_user");
        localStorage.removeItem("fastfood_token");
        window.location.href = '/login';
    };

    const filteredProducts = products.filter(p => {
        const matchCategory = selectedCategory === "ALL" || (p.category && p.category.id === selectedCategory);
        const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
        return matchCategory && matchSearch;
    });

    // --- CẤU HÌNH CỘT BẢNG ĐƠN HÀNG ---
    const orderColumns = [
        { 
            title: 'ID', 
            dataIndex: 'id', 
            key: 'id', 
            width: 80, 
            render: (text) => <b>#{text}</b> 
        },
        { 
            title: 'Khách hàng', 
            dataIndex: 'customerName', 
            key: 'customerName', 
            render: (text) => <Tag color="blue">{text || 'Khách vãng lai'}</Tag>
        },
        { 
            title: 'Tổng tiền', 
            dataIndex: 'totalPrice', // Khớp với BE mới sửa
            key: 'totalPrice', 
            render: (price) => <b style={{color: '#cf1322'}}>{Number(price || 0).toLocaleString()} ₫</b> 
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => {
                let color = 'default';
                let text = status;
                if (status === 'PENDING') { color = 'gold'; text = 'Chờ xác nhận'; }
                else if (status === 'PROCESSING') { color = 'blue'; text = 'Đang làm'; }
                else if (status === 'COMPLETED') { color = 'green'; text = 'Xong món'; }
                else if (status === 'PAID') { color = 'purple'; text = 'Đã thanh toán'; }
                else if (status === 'CANCELLED') { color = 'red'; text = 'Đã hủy'; }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        { 
            title: 'Ngày tạo', 
            dataIndex: 'createdAt', // Khớp với BE mới sửa
            key: 'createdAt', 
            render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '' 
        },
        {
            title: 'Hành động', 
            key: 'action',
            render: (_, record) => (
                <Space>
                    {/* Nếu chưa thanh toán thì hiện nút Thu tiền */}
                    {record.status !== 'PAID' && record.status !== 'CANCELLED' && (
                        <Button type="primary" size="small" onClick={() => handleProcessPayment(record.id)}>Thu tiền</Button>
                    )}
                    {/* Nút in bill luôn hiện để in lại */}
                    <Button icon={<PrinterOutlined />} size="small" onClick={() => handleReprint(record)}>In Bill</Button>
                </Space>
            )
        }
    ];

    return (
        <Layout style={{ height: "100vh", overflow: "hidden" }}>
             <Header style={{ background: "#fff", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0", height: 64 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Title level={4} style={{ margin: 0, color: "#cf1322" }}>🍔 FASTFOOD POS</Title>
                        {user?.role === 'ADMIN' && <Tag color="red">ADMIN</Tag>}
                        {user?.role === 'CASHIER' && <Tag color="blue">THU NGÂN</Tag>}
                    </div>
                    <Segmented 
                        options={[
                            { label: 'Bán hàng tại quầy', value: 'pos', icon: <ShoppingCartOutlined /> },
                            { label: 'Danh sách đơn hàng', value: 'orders', icon: <UnorderedListOutlined /> }
                        ]}
                        value={activeTab}
                        onChange={setActiveTab}
                    />
                </div>
                <Space size="large">
                    {activeTab === 'pos' && (
                        <Input placeholder="Tìm món..." prefix={<SearchOutlined />} style={{ width: 300 }} onChange={(e) => setSearchText(e.target.value)} allowClear />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15, borderLeft: '1px solid #f0f0f0', paddingLeft: 15 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: user ? '#87d068' : '#ccc' }} />
                            <Text strong>{user ? user.fullName : 'Chưa đăng nhập'}</Text>
                        </div>
                        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
                    </div>
                </Space>
            </Header>

            {/* TAB BÁN HÀNG (POS) */}
            {activeTab === 'pos' && (
                <Layout>
                    <Layout style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ padding: "10px", background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
                        <Segmented options={[{ label: 'Tất cả', value: 'ALL' }, ...categories.map(c => ({ label: c.name, value: c.id }))]} value={selectedCategory} onChange={setSelectedCategory} block />
                        </div>
                        <Content style={{ padding: "16px", overflowY: "auto", background: "#f5f5f5" }}>
                        <Row gutter={[16, 16]}>
                            {filteredProducts.map((p) => (
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={p.id}>
                                <Card hoverable cover={<img alt={p.name} src={p.imageUrl} style={{ height: 150, objectFit: "cover" }} />} onClick={() => addToCart(p)} styles={{ body: { padding: "12px" } }}>
                                <Card.Meta title={p.name} description={<Text type="danger" strong>{p.price.toLocaleString()} đ</Text>} />
                                </Card>
                            </Col>
                            ))}
                        </Row>
                        </Content>
                    </Layout>
                    
                    {/* Sidebar Giỏ hàng bên phải */}
                    <Sider width={400} theme="light" style={{ borderLeft: "1px solid #f0f0f0", display: "flex", flexDirection: "column", height: '100%' }}>
                        <div style={{ padding: "16px", background: "#fafafa", borderBottom: "1px solid #e8e8e8" }}><Title level={4} style={{ margin: 0 }}><ShoppingCartOutlined /> Giỏ hàng ({cart.length})</Title></div>
                        
                        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottom: '1px solid #eee' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>{item.name}</div>
                                        <div style={{ color: '#888', fontSize: 12 }}>{item.price.toLocaleString()} đ</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Button size="small" icon={<MinusOutlined />} onClick={() => updateQty(item.id, -1)} />
                                        <Text strong style={{ width: 20, textAlign: 'center' }}>{item.qty}</Text>
                                        <Button size="small" icon={<PlusOutlined />} onClick={() => updateQty(item.id, 1)} />
                                        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeItem(item.id)} />
                                    </div>
                                </div>
                            ))}
                            {cart.length === 0 && <div style={{ textAlign: 'center', color: '#999', marginTop: 50 }}>Giỏ hàng trống</div>}
                        </div>

                        <div style={{ padding: "20px", background: "#fff", borderTop: "2px solid #f0f0f0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}><Text strong style={{ fontSize: "18px" }}>TỔNG CỘNG:</Text><Text type="danger" strong style={{ fontSize: "24px" }}>{posTotal.toLocaleString()} đ</Text></div>
                            <Button type="primary" danger size="large" block onClick={handleCheckout} disabled={cart.length === 0}>THANH TOÁN & IN BILL</Button>
                        </div>
                    </Sider>
                </Layout>
            )}

            {/* TAB DANH SÁCH ĐƠN HÀNG */}
            {activeTab === 'orders' && (
                <Content style={{ padding: '24px', background: '#f0f2f5', overflowY: 'auto' }}>
                    <Card title={<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span>Danh sách đơn hàng</span><Button icon={<SyncOutlined spin={loadingOrders} />} onClick={fetchOrders} size="small">Làm mới</Button></div>} bordered={false}>
                        <Table columns={orderColumns} dataSource={orderList} rowKey="id" loading={loadingOrders} pagination={{ pageSize: 8 }} />
                    </Card>
                </Content>
            )}

            {/* MODAL IN HÓA ĐƠN */}
            <Modal title="Hóa đơn thanh toán" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={[<Button key="close" onClick={() => setIsModalOpen(false)}>Đóng</Button>, <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>In Ngay</Button>]}>
                <div style={{ border: "1px solid #ddd", padding: "10px", background: "#fff8f8" }}>
                    <InvoiceToPrint ref={componentRef} cart={printData.cart} finalTotal={printData.total} orderId={printData.orderId} cashierName={printData.cashierName} orderDate={printData.date} />
                </div>
            </Modal>
        </Layout>
    );
};

export default POSPage;