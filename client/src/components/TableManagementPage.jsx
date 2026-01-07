import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Card, Row, Col, Button, Tag, Tabs, List, Typography, message, Segmented, Space } from "antd";
import { UserOutlined, PlusOutlined, MinusOutlined, CheckCircleOutlined, SwapOutlined } from "@ant-design/icons";

// XÓA DÒNG IMPORT HEADER VÌ ĐÃ CÓ Ở MAIN LAYOUT
// import CustomerHeader from './CustomerHeader'; 

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const TableManagementPage = ({ onGoHome, user, onLogout }) => {
    // --- STATE ---
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null); 
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    
    // Giỏ hàng của TỪNG BÀN
    const [tableOrders, setTableOrders] = useState({}); 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tableRes, prodRes, catRes] = await Promise.all([
                axios.get("http://localhost:8081/api/tables"), 
                axios.get("http://localhost:8081/api/products"),
                axios.get("http://localhost:8081/api/categories")
            ]);
            setTables(tableRes.data);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu, dùng dữ liệu mẫu:", error);
            setTables([
                { id: 1, name: "Bàn 01", status: "FREE", capacity: 4 },
                { id: 2, name: "Bàn 02", status: "OCCUPIED", capacity: 2 },
                { id: 3, name: "Bàn 03", status: "FREE", capacity: 6 },
                { id: 4, name: "Bàn VIP", status: "RESERVED", capacity: 10 },
                { id: 5, name: "Bàn 04", status: "FREE", capacity: 4 },
                { id: 6, name: "Bàn 05", status: "FREE", capacity: 4 },
                { id: 7, name: "Bàn 06", status: "FREE", capacity: 4 },
                { id: 8, name: "Bàn 07", status: "FREE", capacity: 4 },
                { id: 9, name: "Bàn 08", status: "FREE", capacity: 4 },
                { id: 10, name: "Bàn 09", status: "FREE", capacity: 4 },
            ]);
        }
    };

    // --- LOGIC GỌI MÓN ---
    const getCurrentCart = () => {
        if (!selectedTable) return [];
        return tableOrders[selectedTable.id] || [];
    };

    const addToTableCart = (product) => {
        if (!selectedTable) return message.warning("Vui lòng chọn bàn trước!");
        
        const currentCart = getCurrentCart();
        const exist = currentCart.find(x => x.id === product.id);
        
        let newCart;
        if (exist) {
            newCart = currentCart.map(x => x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x);
        } else {
            newCart = [...currentCart, { ...product, qty: 1 }];
        }

        setTableOrders({ ...tableOrders, [selectedTable.id]: newCart });
        
        if (selectedTable.status === "FREE") {
            updateTableStatus(selectedTable.id, "OCCUPIED");
        }
    };

    const updateQty = (id, delta) => {
        const currentCart = getCurrentCart();
        const exist = currentCart.find(x => x.id === id);
        if (!exist) return;

        let newCart;
        if (exist.qty + delta <= 0) {
            newCart = currentCart.filter(x => x.id !== id);
        } else {
            newCart = currentCart.map(x => x.id === id ? { ...exist, qty: exist.qty + delta } : x);
        }
        
        setTableOrders({ ...tableOrders, [selectedTable.id]: newCart });
    };

    const updateTableStatus = (tableId, status) => {
        const newTables = tables.map(t => t.id === tableId ? { ...t, status: status } : t);
        setTables(newTables);
        if (selectedTable && selectedTable.id === tableId) {
            setSelectedTable({ ...selectedTable, status: status });
        }
    };

    // --- XỬ LÝ GỬI ĐƠN XUỐNG BẾP ---
    const handleSendOrder = () => {
        const cart = getCurrentCart();
        if (cart.length === 0) return message.warning("Chưa có món nào để gọi!");
        message.success(`Đã gửi đơn cho ${selectedTable.name} xuống bếp!`);
    };

    const handleCheckoutTable = () => {
         message.success(`Đang tính tiền cho ${selectedTable.name}`);
         setTableOrders({ ...tableOrders, [selectedTable.id]: [] });
         updateTableStatus(selectedTable.id, "FREE");
    };

    const filteredProducts = products.filter(p => selectedCategory === "ALL" || (p.category && p.category.id === selectedCategory));
    const cart = getCurrentCart();
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        // Xóa style height: 100vh để nó tự fill theo MainLayout
        <Layout style={{ height: "100%", overflow: "hidden" }}>
             {/* ĐÃ XÓA CUSTOMER HEADER Ở ĐÂY */}

            <Layout>
                {/* --- CỘT TRÁI: SƠ ĐỒ BÀN (60%) --- */}
                <Content style={{ padding: "20px", overflowY: "auto", background: "#f0f2f5", flex: 1.5 }}>
                    <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Title level={3} style={{ margin: 0 }}>Quản lý bàn</Title>
                        <Space>
                            <Tag color="green">Trống ({tables.filter(t=>t.status === 'FREE').length})</Tag>
                            <Tag color="red">Có khách ({tables.filter(t=>t.status === 'OCCUPIED').length})</Tag>
                            <Tag color="gold">Đặt trước ({tables.filter(t=>t.status === 'RESERVED').length})</Tag>
                        </Space>
                    </div>

                    <Row gutter={[16, 16]}>
                        {tables.map(table => (
                            <Col xs={12} sm={8} md={6} lg={6} key={table.id}>
                                <Card 
                                    hoverable
                                    onClick={() => setSelectedTable(table)}
                                    style={{ 
                                        textAlign: 'center', 
                                        cursor: 'pointer',
                                        border: selectedTable?.id === table.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                        backgroundColor: table.status === 'OCCUPIED' ? '#fff1f0' : (table.status === 'RESERVED' ? '#fffbe6' : '#f6ffed')
                                    }}
                                >
                                    <Title level={4} style={{ color: table.status === 'OCCUPIED' ? '#cf1322' : '#389e0d' }}>{table.name}</Title>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 5, color: '#666' }}>
                                        <UserOutlined /> {table.capacity} người
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        {table.status === 'FREE' && <Tag color="green">Trống</Tag>}
                                        {table.status === 'OCCUPIED' && <Tag color="red">Đang dùng</Tag>}
                                        {table.status === 'RESERVED' && <Tag color="gold">Đã đặt</Tag>}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Content>

                {/* --- CỘT PHẢI: CHI TIẾT & GỌI MÓN (40%) --- */}
                <Sider width={500} theme="light" style={{ borderLeft: "1px solid #ddd", display: "flex", flexDirection: "column" }}>
                    {!selectedTable ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', color: '#999' }}>
                            <SwapOutlined style={{ fontSize: 40, marginBottom: 10 }} />
                            <Text>Chọn một bàn để xem chi tiết</Text>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                            {/* Header Bàn */}
                            <div style={{ padding: "15px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Title level={4} style={{ margin: 0 }}>{selectedTable.name}</Title>
                                    <Tag color={selectedTable.status === 'FREE' ? 'green' : 'red'}>
                                        {selectedTable.status === 'FREE' ? 'Sẵn sàng' : 'Đang phục vụ'}
                                    </Tag>
                                </div>
                            </div>

                            {/* Tabs: Thực đơn & Hóa đơn */}
                            <Tabs defaultActiveKey="menu" centered style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                                items={[
                                    {
                                        key: 'menu',
                                        label: 'Thực đơn',
                                        children: (
                                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                {/* Danh mục */}
                                                <div style={{ padding: "5px 10px" }}>
                                                    <Segmented block size="small" options={[{ label: 'Tất cả', value: 'ALL' }, ...categories.map(c => ({ label: c.name, value: c.id }))]} value={selectedCategory} onChange={setSelectedCategory} />
                                                </div>
                                                {/* List món ăn */}
                                                <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
                                                    <List
                                                        grid={{ gutter: 10, column: 2 }}
                                                        dataSource={filteredProducts}
                                                        renderItem={(item) => (
                                                            <List.Item>
                                                                <Card hoverable size="small" onClick={() => addToTableCart(item)}
                                                                    cover={<img alt={item.name} src={item.imageUrl} style={{ height: 80, objectFit: 'cover' }} />}
                                                                >
                                                                    <Card.Meta title={<Text style={{ fontSize: 13 }}>{item.name}</Text>} description={<Text type="danger">{item.price.toLocaleString()}đ</Text>} />
                                                                </Card>
                                                            </List.Item>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        key: 'bill',
                                        label: `Hóa đơn (${cart.length})`,
                                        children: (
                                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
                                                    {cart.length === 0 ? <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 50 }}>Chưa gọi món nào</Text> : (
                                                        <List
                                                            dataSource={cart}
                                                            renderItem={(item) => (
                                                                <List.Item actions={[
                                                                    <Space>
                                                                        <Button size="small" icon={<MinusOutlined />} onClick={() => updateQty(item.id, -1)} />
                                                                        <Text>{item.qty}</Text>
                                                                        <Button size="small" icon={<PlusOutlined />} onClick={() => updateQty(item.id, 1)} />
                                                                    </Space>
                                                                ]}>
                                                                    <List.Item.Meta title={item.name} description={`${item.price.toLocaleString()} đ x ${item.qty}`} />
                                                                    <div style={{ fontWeight: "bold" }}>{(item.price * item.qty).toLocaleString()}</div>
                                                                </List.Item>
                                                            )}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                ]} 
                            />

                            {/* Footer Hành động */}
                            <div style={{ padding: "15px", borderTop: "1px solid #f0f0f0", background: "#fff" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                    <Text strong>Tạm tính:</Text>
                                    <Text type="danger" strong style={{ fontSize: 18 }}>{totalAmount.toLocaleString()} đ</Text>
                                </div>
                                <Space style={{ width: '100%' }}>
                                    <Button type="primary" block onClick={handleSendOrder} disabled={cart.length === 0}>
                                        <CheckCircleOutlined /> Gửi Bếp
                                    </Button>
                                    <Button danger block onClick={handleCheckoutTable} disabled={selectedTable.status === 'FREE'}>
                                        Thanh toán & Trả bàn
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    )}
                </Sider>
            </Layout>
        </Layout>
    );
};

export default TableManagementPage;