import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from 'react-to-print';
import { Layout, Card, Row, Col, Button, Input, List, Typography, Modal, message, Segmented, Space, Avatar, Tag, Table, Tabs, Badge } from "antd";
import { 
  ShoppingCartOutlined, DeleteOutlined, SearchOutlined, 
  PrinterOutlined, PlusOutlined, MinusOutlined, GiftOutlined,
  LogoutOutlined, UserOutlined, UnorderedListOutlined, CheckCircleOutlined, SyncOutlined
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

// --- COMPONENT HÓA ĐƠN ---
const InvoiceToPrint = React.forwardRef(({ cart, subTotal, discount, finalTotal, orderId, cashierName }, ref) => (
  <div ref={ref} style={{ padding: '20px', width: '300px', margin: '0 auto', fontFamily: 'monospace' }}>
    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
      <Title level={4} style={{ margin: 0 }}>FASTFOOD STORE</Title>
      <Text style={{ fontSize: '12px' }}>ĐC: KTX Khu B</Text>
    </div>
    <hr style={{ borderTop: '1px dashed #000' }} />
    <div style={{ margin: '10px 0' }}>
      <Text strong>Hóa đơn: #{orderId}</Text><br/>
      <Text>Thu ngân: {cashierName}</Text><br/>
      <Text>Ngày: {new Date().toLocaleString()}</Text>
    </div>
    <hr style={{ borderTop: '1px dashed #000' }} />
    <table style={{ width: '100%', fontSize: '12px' }}>
      <thead>
        <tr><th style={{ textAlign: 'left' }}>Món</th><th style={{ textAlign: 'center' }}>SL</th><th style={{ textAlign: 'right' }}>Tiền</th></tr>
      </thead>
      <tbody>
        {cart.map((item) => (
          <tr key={item.id}>
            <td style={{ textAlign: 'left' }}>{item.product?.name || item.name}</td>
            <td style={{ textAlign: 'center' }}>{item.quantity || item.qty}</td>
            <td style={{ textAlign: 'right' }}>{((item.product?.price || item.price) * (item.quantity || item.qty)).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <hr style={{ borderTop: '1px dashed #000' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
      <span>TỔNG:</span><span>{finalTotal.toLocaleString()} đ</span>
    </div>
  </div>
));

const POSPage = () => {
    // --- STATE CHUNG ---
    const [activeTab, setActiveTab] = useState('pos'); // 'pos': Bán hàng, 'orders': Quản lý đơn
    const [user, setUser] = useState(null);
    
    // --- STATE CHO POS (BÁN HÀNG) ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [searchText, setSearchText] = useState("");
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    
    // --- STATE CHO DANH SÁCH ĐƠN HÀNG ---
    const [orderList, setOrderList] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({ content: () => componentRef.current });

    useEffect(() => {
        fetchData();
        const savedUser = localStorage.getItem("fastfood_user");
        if (savedUser) setUser(JSON.parse(savedUser));
        
        // Load danh sách đơn hàng ban đầu
        fetchOrders();
        
        // Tự động refresh đơn hàng mỗi 10 giây để thấy đơn mới từ bếp/khách
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get("http://localhost:8081/api/products"),
                axios.get("http://localhost:8081/api/categories")
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) { console.error("Lỗi tải menu:", error); }
    };

    // --- HÀM TẢI DANH SÁCH ĐƠN HÀNG TỪ SERVER ---
    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            // Đảm bảo Backend đã có API GET /api/orders trả về danh sách
            const res = await axios.get("http://localhost:8081/api/orders");
            // Sắp xếp đơn mới nhất lên đầu
            const sortedOrders = res.data.sort((a, b) => b.id - a.id);
            setOrderList(sortedOrders);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    // --- LOGIC POS (BÁN HÀNG TẠI QUẦY) ---
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
    const subTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const finalTotal = subTotal - (subTotal * discount / 100);

    const handleCheckout = async () => {
        if (cart.length === 0) return message.warning("Trống!");
        try {
            const res = await axios.post("http://localhost:8081/api/orders", { items: cart.map((i) => ({ productId: i.id, quantity: i.qty })) });
            // Sau khi tạo đơn, tự động cập nhật trạng thái là PAID luôn vì bán tại quầy
            await axios.put(`http://localhost:8081/api/orders/${res.data.id}/status?status=PAID`);
            
            setCurrentOrderId(res.data.id);
            setIsModalOpen(true);
            message.success("Thành công!");
            fetchOrders(); // Reload lại danh sách đơn
        } catch (err) { message.error("Lỗi!"); }
    };
    
    const handleFinishOrder = () => {
        setCart([]); setIsModalOpen(false); setCurrentOrderId(null);
    };

    // --- LOGIC XỬ LÝ ĐƠN HÀNG TỪ DANH SÁCH ---
    const handleProcessPayment = async (orderId) => {
        try {
            await axios.put(`http://localhost:8081/api/orders/${orderId}/status?status=PAID`);
            message.success(`Đã thanh toán đơn #${orderId}`);
            fetchOrders();
        } catch (error) {
            message.error("Lỗi cập nhật trạng thái!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("fastfood_user");
        window.location.reload();
    };

    const filteredProducts = products.filter(p => {
        const matchCategory = selectedCategory === "ALL" || (p.category && p.category.id === selectedCategory);
        const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
        return matchCategory && matchSearch;
    });

    // Cột bảng quản lý đơn hàng
    const orderColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60, render: (text) => <b>#{text}</b> },
        { 
            title: 'Khách hàng', 
            dataIndex: 'user', 
            key: 'user', 
            render: (u) => u ? <Tag color="blue">{u.fullName}</Tag> : <Tag color="orange">Khách vãng lai</Tag>
        },
        { 
            title: 'Tổng tiền', 
            dataIndex: 'totalAmount', // <--- ĐÃ SỬA: Khớp với Backend (totalAmount)
            key: 'totalAmount',
            render: (price) => <b style={{color: '#cf1322'}}>{price ? price.toLocaleString() : 0} ₫</b>
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => {
                let color = 'default';
                let text = status;
                if (status === 'PENDING') { color = 'gold'; text = 'Chờ xác nhận'; }
                else if (status === 'COOKING') { color = 'blue'; text = 'Đang nấu'; }
                else if (status === 'COMPLETED') { color = 'green'; text = 'Bếp xong'; } // Bếp đã xong
                else if (status === 'PAID') { color = 'purple'; text = 'Đã thanh toán'; }
                else if (status === 'CANCELLED') { color = 'red'; text = 'Đã hủy'; }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (date) => date ? new Date(date).toLocaleString() : '' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    {/* Chỉ hiện nút thanh toán nếu đơn chưa thanh toán */}
                    {record.status !== 'PAID' && record.status !== 'CANCELLED' && (
                        <Button type="primary" onClick={() => handleProcessPayment(record.id)}>
                            Thu tiền
                        </Button>
                    )}
                    {record.status === 'PAID' && <Button icon={<PrinterOutlined />}>In lại bill</Button>}
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
                        <Tag color="blue">Thu ngân</Tag>
                    </div>
                    
                    {/* MENU CHUYỂN ĐỔI TAB */}
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
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
                            <Text strong>{user?.fullName || 'Thu ngân'}</Text>
                        </div>
                        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
                    </div>
                </Space>
            </Header>

            {/* --- GIAO DIỆN BÁN HÀNG TẠI QUẦY (POS) --- */}
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
                                <Card hoverable cover={<img alt={p.name} src={p.imageUrl} style={{ height: 150, objectFit: "cover" }} />} onClick={() => addToCart(p)} bodyStyle={{ padding: "12px" }}>
                                <Card.Meta title={p.name} description={<Text type="danger" strong>{p.price.toLocaleString()} đ</Text>} />
                                </Card>
                            </Col>
                            ))}
                        </Row>
                        </Content>
                    </Layout>
                    <Sider width={400} theme="light" style={{ borderLeft: "1px solid #f0f0f0", display: "flex", flexDirection: "column", height: '100%' }}>
                        <div style={{ padding: "16px", background: "#fafafa", borderBottom: "1px solid #e8e8e8" }}><Title level={4} style={{ margin: 0 }}><ShoppingCartOutlined /> Giỏ hàng ({cart.length})</Title></div>
                        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                            <List itemLayout="horizontal" dataSource={cart} renderItem={(item) => (
                                <List.Item actions={[
                                    <Button size="small" icon={<MinusOutlined />} onClick={() => updateQty(item.id, -1)} />,
                                    <Text strong>{item.qty}</Text>,
                                    <Button size="small" icon={<PlusOutlined />} onClick={() => updateQty(item.id, 1)} />,
                                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeItem(item.id)} />
                                ]}>
                                    <List.Item.Meta title={item.name} description={`${item.price.toLocaleString()} đ`} />
                                    <div style={{ fontWeight: "bold" }}>{(item.price * item.qty).toLocaleString()}</div>
                                </List.Item>
                            )} />
                        </div>
                        <div style={{ padding: "20px", background: "#fff", borderTop: "2px solid #f0f0f0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}><Text strong style={{ fontSize: "18px" }}>TỔNG CỘNG:</Text><Text type="danger" strong style={{ fontSize: "24px" }}>{finalTotal.toLocaleString()} đ</Text></div>
                            <Button type="primary" danger size="large" block onClick={handleCheckout} disabled={cart.length === 0}>THANH TOÁN & IN BILL</Button>
                        </div>
                    </Sider>
                </Layout>
            )}

            {/* --- GIAO DIỆN QUẢN LÝ ĐƠN HÀNG (DÀNH CHO ĐƠN TỪ KHÁCH/BẾP) --- */}
            {activeTab === 'orders' && (
                <Content style={{ padding: '24px', background: '#f0f2f5', overflowY: 'auto' }}>
                    <Card 
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span>Danh sách đơn hàng chờ xử lý</span>
                                <Button icon={<SyncOutlined spin={loadingOrders} />} onClick={fetchOrders} size="small">Làm mới</Button>
                            </div>
                        } 
                        bordered={false}
                    >
                        <Table 
                            columns={orderColumns} 
                            dataSource={orderList} 
                            rowKey="id" 
                            loading={loadingOrders}
                            pagination={{ pageSize: 8 }}
                        />
                    </Card>
                </Content>
            )}

            {/* MODAL IN HÓA ĐƠN */}
            <Modal title="Thanh toán thành công" open={isModalOpen} onCancel={handleFinishOrder} footer={[<Button key="close" onClick={handleFinishOrder}>Đóng</Button>, <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>In Hóa Đơn</Button>]}>
                <div style={{ border: "1px solid #ddd", padding: "10px", background: "#fff8f8" }}>
                    <InvoiceToPrint 
                        ref={componentRef} 
                        cart={activeTab === 'pos' ? cart : []} // Lưu ý: Nếu in từ Order List thì cần truyền item của order đó vào (Code này đang demo cho POS tab)
                        subTotal={subTotal} discount={discount} finalTotal={finalTotal} orderId={currentOrderId} cashierName={user?.fullName} 
                    />
                </div>
            </Modal>
        </Layout>
    );
};

export default POSPage;