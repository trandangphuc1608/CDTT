import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from 'react-to-print';
import { Layout, Card, Row, Col, Button, Input, List, Typography, Modal, message, Segmented, Space, Avatar, Dropdown } from "antd";
import { 
  ShoppingCartOutlined, DeleteOutlined, SearchOutlined, 
  PrinterOutlined, PlusOutlined, MinusOutlined, GiftOutlined,
  UserOutlined, HistoryOutlined, LogoutOutlined 
} from "@ant-design/icons";

// Đảm bảo đường dẫn import đúng (Nếu file này nằm ở src/components thì CustomerOrderHistory cũng nên ở đó hoặc chỉnh lại đường dẫn)
import CustomerOrderHistory from './CustomerOrderHistory'; 

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

// --- COMPONENT HÓA ĐƠN ---
const InvoiceToPrint = React.forwardRef(({ cart, subTotal, discount, finalTotal, orderId, cashierName }, ref) => (
  <div ref={ref} style={{ padding: '20px', width: '300px', margin: '0 auto', fontFamily: 'monospace' }}>
    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
      <Title level={4} style={{ margin: 0 }}>FASTFOOD STORE</Title>
      <Text style={{ fontSize: '12px' }}>ĐC: 123 Đường ABC, TP.HCM</Text><br/>
      <Text style={{ fontSize: '12px' }}>Hotline: 1900 1234</Text>
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
        <tr>
          <th style={{ textAlign: 'left' }}>Món</th>
          <th style={{ textAlign: 'center' }}>SL</th>
          <th style={{ textAlign: 'right' }}>Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item) => (
          <tr key={item.id}>
            <td style={{ textAlign: 'left' }}>{item.name}</td>
            <td style={{ textAlign: 'center' }}>{item.qty}</td>
            <td style={{ textAlign: 'right' }}>{(item.price * item.qty).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <hr style={{ borderTop: '1px dashed #000' }} />
    
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
      <span>Tạm tính:</span>
      <span>{subTotal.toLocaleString()} đ</span>
    </div>
    {discount > 0 && (
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <span>Giảm giá ({discount}%):</span>
        <span>-{(subTotal * discount / 100).toLocaleString()} đ</span>
      </div>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', marginTop: '5px' }}>
      <span>THANH TOÁN:</span>
      <span>{finalTotal.toLocaleString()} đ</span>
    </div>

    <hr style={{ borderTop: '1px dashed #000' }} />
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <Text style={{ fontSize: '12px' }}>Cảm ơn quý khách & Hẹn gặp lại!</Text><br/>
      <Text style={{ fontSize: '10px' }}>Wifi: FastFood_Free | Pass: 12345678</Text>
    </div>
  </div>
));

// --- COMPONENT CHÍNH ---
const POSView = ({ isCustomer = false }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  
  // State Voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // State Modal Thanh toán
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  
  // State User & Lịch sử
  const [user, setUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  useEffect(() => {
    fetchData();
    // Lấy thông tin user từ localStorage
    const savedUser = localStorage.getItem("fastfood_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get("http://localhost:8081/api/products"),
        axios.get("http://localhost:8081/api/categories")
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      message.error("Lỗi kết nối máy chủ!");
    }
  };

  const addToCart = (p) => {
    const exist = cart.find((x) => x.id === p.id);
    if (exist) {
      setCart(cart.map((x) => (x.id === p.id ? { ...exist, qty: exist.qty + 1 } : x)));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
    message.success(`Đã thêm ${p.name}`);
  };

  const updateQty = (id, delta) => {
    const exist = cart.find((x) => x.id === id);
    if (!exist) return;
    if (exist.qty + delta <= 0) {
      setCart(cart.filter((x) => x.id !== id));
    } else {
      setCart(cart.map((x) => (x.id === id ? { ...exist, qty: exist.qty + delta } : x)));
    }
  };

  const subTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const finalTotal = subTotal - (subTotal * discount / 100);

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    try {
      const res = await axios.get(`http://localhost:8081/api/vouchers/check/${voucherCode}`);
      setDiscount(res.data.discountPercent);
      message.success(`Áp dụng mã giảm ${res.data.discountPercent}% thành công!`);
    } catch (error) {
      setDiscount(0);
      message.error(error.response?.data || "Mã không hợp lệ!");
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return message.warning("Giỏ hàng đang trống!");
    
    try {
      const res = await axios.post("http://localhost:8081/api/orders", { 
        items: cart.map((i) => ({ productId: i.id, quantity: i.qty })) 
      });
      
      setCurrentOrderId(res.data.id);
      setIsModalOpen(true);
      message.success("Đặt hàng thành công!");

    } catch (err) {
      message.error("Lỗi thanh toán: " + err.message);
    }
  };

  const handleFinishOrder = () => {
    setCart([]);
    setDiscount(0);
    setVoucherCode("");
    setIsModalOpen(false);
    setCurrentOrderId(null);
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

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout>
        {/* HEADER ĐÃ ĐƯỢC CẬP NHẬT */}
        <Header style={{ background: "#fff", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0" }}>
          
          {/* Logo & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Title level={4} style={{ margin: 0, color: "#cf1322" }}>🍔 FASTFOOD POS</Title>
            <Input 
              placeholder="Tìm món ăn..." 
              prefix={<SearchOutlined />} 
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* MENU KHÁCH HÀNG (BÊN PHẢI) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user && (
              <>
                 <Button 
                    type="text" 
                    icon={<HistoryOutlined />} 
                    onClick={() => setShowHistory(true)}
                 >
                    Lịch sử đơn
                 </Button>
                 
                 <span style={{ fontWeight: 'bold' }}>
                    <UserOutlined /> {user.fullName}
                 </span>
                 
                 <Button 
                    danger 
                    type="text" 
                    icon={<LogoutOutlined />} 
                    onClick={handleLogout}
                    title="Đăng xuất"
                 />
              </>
            )}
          </div>
        </Header>
        
        <div style={{ padding: "10px", background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
          <Segmented 
            options={[
              { label: 'Tất cả', value: 'ALL' },
              ...categories.map(c => ({ label: c.name, value: c.id }))
            ]}
            value={selectedCategory}
            onChange={setSelectedCategory}
            block
          />
        </div>

        <Content style={{ padding: "16px", overflowY: "auto", background: "#f5f5f5" }}>
          <Row gutter={[16, 16]}>
            {filteredProducts.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={6} key={p.id}>
                <Card
                  hoverable
                  cover={<img alt={p.name} src={p.imageUrl || "https://placehold.co/300x200"} style={{ height: 150, objectFit: "cover" }} />}
                  onClick={() => addToCart(p)}
                  bodyStyle={{ padding: "12px" }}
                >
                  <Card.Meta 
                    title={p.name} 
                    description={<Text type="danger" strong>{p.price.toLocaleString()} đ</Text>} 
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>

      <Sider width={400} theme="light" style={{ borderLeft: "1px solid #f0f0f0", display: "flex", flexDirection: "column" }}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px", background: "#fafafa", borderBottom: "1px solid #e8e8e8" }}>
            <Title level={4} style={{ margin: 0 }}><ShoppingCartOutlined /> Giỏ hàng ({cart.length})</Title>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <List
              itemLayout="horizontal"
              dataSource={cart}
              renderItem={(item) => (
                <List.Item actions={[
                  <Button size="small" icon={<MinusOutlined />} onClick={() => updateQty(item.id, -1)} />,
                  <Text strong>{item.qty}</Text>,
                  <Button size="small" icon={<PlusOutlined />} onClick={() => updateQty(item.id, 1)} />,
                  <Button size="small" danger icon={<DeleteOutlined />} onClick={() => updateQty(item.id, -100)} />
                ]}>
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.price.toLocaleString()} đ`}
                  />
                  <div style={{ fontWeight: "bold" }}>{(item.price * item.qty).toLocaleString()}</div>
                </List.Item>
              )}
            />
          </div>

          <div style={{ padding: "20px", background: "#fff", borderTop: "2px solid #f0f0f0" }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <Input prefix={<GiftOutlined />} placeholder="Mã giảm giá" value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} />
                <Button onClick={handleApplyVoucher}>Áp dụng</Button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}><Text>Tạm tính:</Text><Text>{subTotal.toLocaleString()} đ</Text></div>
            {discount > 0 && (<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", color: 'green' }}><Text type="success">Giảm giá ({discount}%):</Text><Text type="success">-{(subTotal * discount / 100).toLocaleString()} đ</Text></div>)}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}><Text strong style={{ fontSize: "18px" }}>TỔNG CỘNG:</Text><Text type="danger" strong style={{ fontSize: "24px" }}>{finalTotal.toLocaleString()} đ</Text></div>
            <Button type="primary" danger size="large" block style={{ height: "50px", fontSize: "18px", fontWeight: "bold" }} onClick={handleCheckout} disabled={cart.length === 0}>THANH TOÁN NGAY</Button>
          </div>
        </div>
      </Sider>

      <Modal title="Thanh toán thành công" open={isModalOpen} onCancel={handleFinishOrder} footer={[<Button key="close" onClick={handleFinishOrder}>Đóng</Button>, <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>In Hóa Đơn</Button>]}>
        <div style={{ border: "1px solid #ddd", padding: "10px", background: "#fff8f8" }}>
          <InvoiceToPrint ref={componentRef} cart={cart} subTotal={subTotal} discount={discount} finalTotal={finalTotal} orderId={currentOrderId} cashierName={user ? user.fullName : "Thu Ngân"} />
        </div>
      </Modal>

      {/* MODAL LỊCH SỬ ĐƠN HÀNG */}
      <CustomerOrderHistory 
        user={user} 
        open={showHistory} 
        onCancel={() => setShowHistory(false)} 
      />
    </Layout>
  );
};

export default POSView;