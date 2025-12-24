import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Menu, Button, Card, Statistic, Row, Col, theme, Typography } from 'antd';
import { 
    DashboardOutlined, ShopOutlined, AppstoreOutlined, TeamOutlined, LogoutOutlined,
    HistoryOutlined, GiftOutlined, PictureOutlined, DatabaseOutlined, CalendarOutlined,
    TagsOutlined, TableOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- IMPORT CÁC COMPONENT QUẢN LÝ ---
import UserManager from './Admin/UserManager';
import ProductManager from './Admin/ProductManager';
import CategoryManager from './Admin/CategoryManager';
import BannerManager from './Admin/BannerManager';
import VoucherManager from './Admin/VoucherManager';
import OrderHistory from './Admin/OrderHistory';
import InventoryManager from './Admin/InventoryManager';
import ReservationManager from './Admin/ReservationManager';
import TableManager from './Admin/TableManager'; // <--- Import component Quản lý bàn

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// --- COMPONENT THỐNG KÊ (STATS VIEW) ---
const StatsView = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, completedOrders: 0, pendingOrders: 0 });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Giả lập dữ liệu nếu API chưa sẵn sàng hoặc gọi API thật
                const [statsRes, chartRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/orders/stats'),
                    axios.get('http://localhost:8081/api/orders/revenue-chart')
                ]);
                setStats(statsRes.data);
                setChartData(chartRes.data);
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
                // Dữ liệu mẫu fallback nếu lỗi
                setStats({ totalRevenue: 0, completedOrders: 0, pendingOrders: 0 });
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <Title level={3} style={{ marginBottom: 20 }}>📊 Tổng quan kinh doanh</Title>
            
            <Row gutter={16} style={{ marginBottom: 30 }}>
                <Col span={8}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Doanh thu thực tế" 
                            value={stats.totalRevenue} 
                            precision={0} 
                            valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                            prefix="₫" 
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Đơn đã hoàn thành" 
                            value={stats.completedOrders} 
                            valueStyle={{ color: '#1677ff', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Đơn đang chờ xử lý" 
                            value={stats.pendingOrders} 
                            valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Biểu đồ doanh thu (Đơn hoàn thành)" bordered={false} className="shadow-sm">
                <div style={{ width: '100%', height: 350 }}>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                                <Legend />
                                <Bar dataKey="revenue" name="Doanh thu" fill="#1677ff" barSize={50} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#999', marginTop: 50 }}>
                            Chưa có dữ liệu biểu đồ
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

// --- LAYOUT CHÍNH CỦA ADMIN DASHBOARD ---
const AdminDashboard = ({ onLogout }) => {
    const [selectedKey, setSelectedKey] = useState('1');
    const { token: { colorBgContainer } } = theme.useToken();

    // Hàm render nội dung dựa trên menu đã chọn
    const renderContent = () => {
        switch (selectedKey) {
            case '1': return <StatsView />;
            case '2': return <CategoryManager />;
            case '3': return <ProductManager />;
            case '4': return <OrderHistory />;
            case '5': return <UserManager />;
            case '6': return <VoucherManager />;
            case '7': return <BannerManager />;
            case '8': return <InventoryManager />;
            case '9': return <ReservationManager />;
            case '10': return <TableManager />; // <--- Hiển thị Quản lý bàn
            default: return <StatsView />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible theme="dark" width={260} style={{ overflowY: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}>
                <div style={{ height: 64, margin: 16, background: 'rgba(255, 255, 255, 0.2)', color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', lineHeight: '64px', borderRadius: 6 }}>
                    ADMIN PANEL
                </div>
                <Menu 
                    theme="dark" 
                    defaultSelectedKeys={['1']} 
                    mode="inline"
                    onClick={(e) => setSelectedKey(e.key)}
                    items={[
                        { key: '1', icon: <DashboardOutlined />, label: 'Thống kê Tổng quan' },
                        { key: '2', icon: <AppstoreOutlined />, label: 'Quản lý Danh mục' },
                        { key: '3', icon: <ShopOutlined />, label: 'Quản lý Món ăn' },
                        { key: '4', icon: <HistoryOutlined />, label: 'Lịch sử Đơn hàng' },
                        { key: '5', icon: <TeamOutlined />, label: 'Quản lý Người dùng' },
                        { key: '6', icon: <GiftOutlined />, label: 'Mã giảm giá (Voucher)' },
                        { key: '7', icon: <PictureOutlined />, label: 'Quản lý Banner' },
                        { key: '8', icon: <DatabaseOutlined />, label: 'Kho & Nguyên liệu' },
                        { key: '9', icon: <CalendarOutlined />, label: 'Quản lý Đặt bàn' },
                        { key: '10', icon: <TableOutlined />, label: 'Sơ đồ Bàn ăn' }, // <--- Menu mới
                    ]}
                />
            </Sider>
            <Layout style={{ marginLeft: 260, transition: 'all 0.2s' }}>
                <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 99, boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                    <Title level={4} style={{ margin: 0 }}>Hệ Thống Quản Trị FastFood</Title>
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogout}>
                        Đăng xuất
                    </Button>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div style={{ padding: 24, background: colorBgContainer, borderRadius: 8, minHeight: '80vh' }}>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;