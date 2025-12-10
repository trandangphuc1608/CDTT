import React, { useState, useEffect } from 'react'; // <-- ĐÃ SỬA: Thêm useEffect vào đây
import axios from 'axios';
import { Layout, Menu, Button, Card, Statistic, Row, Col, theme } from 'antd';
import { 
    DashboardOutlined, ShopOutlined, AppstoreOutlined, TeamOutlined, LogoutOutlined 
} from '@ant-design/icons';
// Import thư viện biểu đồ
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import UserManager from './Admin/UserManager';
import ProductManager from './Admin/ProductManager';
import CategoryManager from './Admin/CategoryManager';
import { PictureOutlined } from '@ant-design/icons';
import BannerManager from './Admin/BannerManager';
import { HistoryOutlined, GiftOutlined } from '@ant-design/icons';
import VoucherManager from './Admin/VoucherManager';
import OrderHistory from './Admin/OrderHistory';
import { DatabaseOutlined } from '@ant-design/icons';
import InventoryManager from './Admin/InventoryManager';

// --- COMPONENT THỐNG KÊ ---
const StatsView = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, completedOrders: 0, pendingOrders: 0 });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, chartRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/orders/stats'),
                    axios.get('http://localhost:8081/api/orders/revenue-chart')
                ]);
                setStats(statsRes.data);
                setChartData(chartRes.data);
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">📊 Tổng quan kinh doanh</h2>
            
            <Row gutter={16} className="mb-8">
                <Col span={8}>
                    {/* Sửa lỗi warning: dùng variant="borderless" thay cho bordered={false} */}
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic 
                            title="Doanh thu thực tế" 
                            value={stats.totalRevenue} 
                            precision={0} 
                            // Sửa lỗi warning: dùng styles={{ content: ... }} thay cho valueStyle
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

            <Card title="Biểu đồ doanh thu (Đơn hoàn thành)" className="shadow-sm mt-4">
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
                        <div className="text-center text-gray-400 mt-10">Chưa có dữ liệu đơn hàng hoàn thành</div>
                    )}
                </div>
            </Card>
        </div>
    );
};

// --- LAYOUT CHÍNH ---
const { Header, Sider, Content } = Layout;

const AdminDashboard = ({ onLogout }) => {
    const [selectedKey, setSelectedKey] = useState('1');
    const { token: { colorBgContainer } } = theme.useToken();

    const renderContent = () => {
        switch (selectedKey) {
            case '1': return <StatsView />;
            case '2': return <ProductManager />;
            case '3': return <CategoryManager />;
            case '4': return <UserManager />;
            case '5': return <BannerManager />;
            case '6': return <VoucherManager />;
            case '7': return <OrderHistory />;
            case '8': return <InventoryManager />;
            default: return <StatsView />;
        }
    };

    return (
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
            
            {/* 1. SIDEBAR (CỐ ĐỊNH, CUỘN RIÊNG) */}
            <Sider 
                collapsible 
                theme="dark" 
                width={250}
                style={{
                    overflowY: 'auto', 
                    height: '100vh',   
                    position: 'fixed', 
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100
                }}
            >
                <div className="h-16 flex items-center justify-center bg-red-600 shadow-md sticky top-0 z-10">
                    <h1 className="text-white font-bold text-xl m-0 tracking-wider">ADMIN</h1>
                </div>
                <Menu 
                    theme="dark" 
                    defaultSelectedKeys={['1']} 
                    mode="inline"
                    onClick={(e) => setSelectedKey(e.key)}
                    items={[
                        { key: '1', icon: <DashboardOutlined />, label: 'Tổng quan' },
                        { key: '7', icon: <HistoryOutlined />, label: 'Lịch sử Đơn hàng' },
                        { key: '8', icon: <DatabaseOutlined />, label: 'Quản lý Kho' },
                        { key: '6', icon: <GiftOutlined />, label: 'Mã Giảm Giá' },
                        { key: '5', icon: <PictureOutlined />, label: 'Quản lý Banner' },
                        { key: '2', icon: <ShopOutlined />, label: 'Quản lý Món ăn' },
                        { key: '3', icon: <AppstoreOutlined />, label: 'Quản lý Danh mục' },
                        { key: '4', icon: <TeamOutlined />, label: 'Quản lý Nhân sự' },
                    ]}
                />
            </Sider>

            {/* 2. KHUNG NỘI DUNG (CUỘN RIÊNG) */}
            <Layout 
                style={{ 
                    marginLeft: 250, 
                    height: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column' 
                }}
            >
                <Header 
                    style={{ 
                        padding: '0 24px', 
                        background: colorBgContainer, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                        zIndex: 1,
                        flexShrink: 0 
                    }}
                >
                    <span className="font-bold text-lg text-gray-700">Hệ Thống Quản Lý FastFood</span>
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogout}>
                        Đăng xuất
                    </Button>
                </Header>
                
                <Content 
                    style={{ 
                        margin: '16px', 
                        overflowY: 'auto', 
                        flex: 1,           
                        borderRadius: 8 
                    }}
                >
                    <div style={{ padding: 24, minHeight: '100%', background: colorBgContainer }}>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;