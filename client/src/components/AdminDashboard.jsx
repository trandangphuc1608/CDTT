import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Menu, Button, Card, Statistic, Row, Col, theme, Typography, Radio } from 'antd';
import { 
    DashboardOutlined, ShopOutlined, AppstoreOutlined, TeamOutlined, LogoutOutlined,
    HistoryOutlined, GiftOutlined, PictureOutlined, DatabaseOutlined, CalendarOutlined,
    TagsOutlined, TableOutlined, BankOutlined, MessageOutlined 
} from '@ant-design/icons';
import { 
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

import UserManager from './Admin/UserManager';
import ProductManager from './Admin/ProductManager';
import CategoryManager from './Admin/CategoryManager';
import BannerManager from './Admin/BannerManager';
import VoucherManager from './Admin/VoucherManager';
import OrderHistoryPage from './Admin/OrderHistoryPage';
import InventoryManager from './Admin/InventoryManager';
import ReservationManager from './Admin/ReservationManager';
import TableManager from './Admin/TableManager'; 
import BranchManagement from './BranchManagement';
import ContactManager from './Admin/ContactManager'; // Đảm bảo bạn đã tạo file này

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// --- COMPONENT THỐNG KÊ (STATS VIEW) ---
const StatsView = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, completedOrders: 0, pendingOrders: 0 });
    const [chartData, setChartData] = useState([]);
    const [chartType, setChartType] = useState('bar'); 

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, chartRes] = await Promise.all([
                    axios.get('/api/orders/stats'),
                    axios.get('/api/orders/revenue-chart')
                ]);
                setStats(statsRes.data);
                setChartData(chartRes.data);
            } catch (error) {
                console.warn("Chưa có API thống kê hoặc lỗi kết nối.");
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <Title level={3} style={{ marginBottom: 20 }}>📊 Tổng quan kinh doanh</Title>
            
            <Row gutter={16} style={{ marginBottom: 30 }}>
                <Col span={8}>
                    {/* SỬA LỖI WARNING: Dùng variant="borderless" và styles */}
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic 
                            title="Doanh thu thực tế" 
                            value={stats.totalRevenue} 
                            precision={0} 
                            styles={{ content: { color: '#3f8600', fontWeight: 'bold' } }}
                            prefix="₫" 
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic 
                            title="Đơn đã hoàn thành" 
                            value={stats.completedOrders} 
                            styles={{ content: { color: '#1677ff', fontWeight: 'bold' } }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic 
                            title="Đơn đang chờ xử lý" 
                            value={stats.pendingOrders} 
                            styles={{ content: { color: '#cf1322', fontWeight: 'bold' } }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card 
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Biểu đồ doanh thu (7 ngày gần nhất)</span>
                        <Radio.Group 
                            value={chartType} 
                            onChange={(e) => setChartType(e.target.value)} 
                            buttonStyle="solid"
                            size="small"
                        >
                            <Radio.Button value="bar">Cột</Radio.Button>
                            <Radio.Button value="line">Đường</Radio.Button>
                        </Radio.Group>
                    </div>
                }
                variant="borderless" 
                className="shadow-sm"
            >
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        {chartData.length > 0 ? (
                            <ComposedChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                                <Legend />
                                
                                {chartType === 'bar' && (
                                    <Bar 
                                        dataKey="revenue" 
                                        name="Doanh thu" 
                                        fill="#1677ff" 
                                        barSize={50} 
                                        radius={[4, 4, 0, 0]} 
                                    />
                                )}
                                
                                {chartType === 'line' && (
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        name="Doanh thu" 
                                        stroke="#1677ff" 
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 8 }}
                                    />
                                )}
                            </ComposedChart>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#999' }}>
                                Chưa có dữ liệu doanh thu
                            </div>
                        )}
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

// --- LAYOUT CHÍNH CỦA ADMIN DASHBOARD ---
const AdminDashboard = ({ onLogout }) => {
    const [selectedKey, setSelectedKey] = useState('1');
    const [collapsed, setCollapsed] = useState(false); 
    const { token: { colorBgContainer } } = theme.useToken();

    const renderContent = () => {
        switch (selectedKey) {
            case '1': return <StatsView />;
            case '2': return <CategoryManager />;
            case '3': return <ProductManager />;
            case '4': return <OrderHistoryPage />;
            case '5': return <UserManager />;
            case '6': return <VoucherManager />;
            case '7': return <BannerManager />;
            case '8': return <InventoryManager />;
            case '9': return <ReservationManager />;
            case '10': return <TableManager />;
            case '11': return <BranchManagement />;
            case '12': return <ContactManager />; // Thêm mục Phản hồi khách hàng
            default: return <StatsView />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider 
                collapsible 
                collapsed={collapsed} 
                onCollapse={(value) => setCollapsed(value)} 
                theme="dark" 
                width={260} 
                style={{ overflowY: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
            >
                <div style={{ height: 64, margin: 16, background: 'rgba(255, 255, 255, 0.2)', color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', lineHeight: '64px', borderRadius: 6 }}>
                    {collapsed ? 'TDP' : 'ADMIN PANEL'}
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
                        { key: '10', icon: <TableOutlined />, label: 'Sơ đồ Bàn ăn' },
                        { key: '11', icon: <BankOutlined />, label: 'Quản lý Chi nhánh' },
                        { key: '12', icon: <MessageOutlined />, label: 'Phản hồi khách hàng' },
                    ]}
                />
            </Sider>
            
            <Layout style={{ 
                marginLeft: collapsed ? 80 : 260, 
                transition: 'all 0.2s' 
            }}>
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