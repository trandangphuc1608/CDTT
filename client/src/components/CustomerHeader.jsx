import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { Layout, Button, Input, Space, Avatar, Dropdown, message, Badge } from 'antd'; 
import { 
    SearchOutlined, UserOutlined, 
    LogoutOutlined, LoginOutlined, HistoryOutlined, HomeOutlined,
    ProfileOutlined, ShopOutlined, DownOutlined,
    HeartOutlined, ShoppingCartOutlined 
} from '@ant-design/icons';

const { Header } = Layout;

const CustomerHeader = ({ 
    user, 
    onLogin, 
    onLogout, 
    onGoHome, 
    onGoToMenu, 
    onShowHistory, 
    onShowBooking, 
    searchText, 
    onSearch, 
    onGoToProfile,
    onGoToAbout, 
    onGoToContact
}) => {
    const navigate = useNavigate();

    // --- STATE CHO CHI NHÁNH ---
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    // --- STATE CHO GIỎ HÀNG (QUAN TRỌNG) ---
    const [cartCount, setCartCount] = useState(0);

    // 1. LOGIC CẬP NHẬT GIỎ HÀNG
    useEffect(() => {
        const updateCartCount = () => {
            // Lấy từ localStorage với key 'fastfood_cart'
            const cart = JSON.parse(localStorage.getItem('fastfood_cart')) || [];
            // Tính tổng số lượng
            const total = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
            setCartCount(total);
        };

        // Chạy lần đầu
        updateCartCount();

        // Lắng nghe sự kiện thay đổi
        window.addEventListener('cartUpdated', updateCartCount);
        window.addEventListener('storage', updateCartCount);

        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    // 2. LOGIC TẢI CHI NHÁNH
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await axios.get('/api/branches');
                const activeBranches = res.data ? res.data.filter(b => b.active) : [];
                setBranches(activeBranches);

                const savedBranchId = localStorage.getItem('selectedBranchId');
                if (savedBranchId) {
                    const savedBranch = activeBranches.find(b => b.id === parseInt(savedBranchId));
                    if (savedBranch) setSelectedBranch(savedBranch);
                    else if (activeBranches.length > 0) setSelectedBranch(activeBranches[0]);
                } else if (activeBranches.length > 0) {
                    setSelectedBranch(activeBranches[0]);
                }
            } catch (error) {
                console.error("Lỗi tải chi nhánh:", error);
            }
        };
        fetchBranches();
    }, []);

    const handleSelectBranch = (branch) => {
        setSelectedBranch(branch);
        localStorage.setItem('selectedBranchId', branch.id);
        message.success(`Đã chuyển sang: ${branch.name}`);
    };

    const branchItems = branches.map(branch => ({
        key: String(branch.id),
        label: branch.name,
        icon: <ShopOutlined />,
        onClick: () => handleSelectBranch(branch)
    }));

    // --- MENU USER ---
    const userMenuItems = [
        {
            key: 'info',
            label: (
                <div style={{ padding: '4px 8px', minWidth: '150px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{user?.fullName}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>@{user?.username || 'user'}</div>
                </div>
            ),
        },
        { type: 'divider' },
        { key: 'profile', icon: <ProfileOutlined />, label: 'Thông tin tài khoản', onClick: onGoToProfile },
        { 
            key: 'favorites', 
            icon: <HeartOutlined style={{ color: '#eb2f96' }} />, 
            label: 'Món ăn yêu thích', 
            onClick: () => navigate('/favorites') 
        },
        { key: 'history', icon: <HistoryOutlined />, label: 'Lịch sử đơn hàng', onClick: onShowHistory },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true, onClick: onLogout },
    ];

    return (
        <Header 
            style={{ 
                background: "#fff", 
                padding: "0 24px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                borderBottom: "1px solid #f0f0f0", 
                position: 'sticky', 
                top: 0, 
                zIndex: 1000, 
                height: '64px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
            }}
        >
            {/* 1. LOGO & CHỌN CHI NHÁNH */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div 
                    style={{ fontSize: '22px', fontWeight: '800', color: '#cf1322', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' }} 
                    onClick={onGoHome}
                >
                    <HomeOutlined style={{ fontSize: '20px' }} /> TDP FOOD
                </div>

                {branches.length > 0 && (
                    <Dropdown 
                        menu={{ items: branchItems }} 
                        trigger={['click']}
                    >
                        <Button type="text" style={{ fontSize: '14px', fontWeight: 500, color: '#555', display: 'flex', alignItems: 'center' }}>
                            <ShopOutlined style={{ color: '#cf1322' }} /> 
                            {selectedBranch ? selectedBranch.name : 'Chọn chi nhánh'} 
                            <DownOutlined style={{ fontSize: '12px', marginLeft: 5 }} />
                        </Button>
                    </Dropdown>
                )}
            </div>
            
            {/* 2. MENU GIỮA */}
            <Space size={30} style={{ fontWeight: 600, fontSize: '15px' }} className="d-none d-lg-flex">
                <span className="hover-text" style={{cursor: 'pointer'}} onClick={onGoHome}>Trang chủ</span>
                <span className="hover-text" style={{cursor: 'pointer'}} onClick={onGoToMenu}>Thực đơn</span>
                <span className="hover-text" style={{cursor: 'pointer'}} onClick={onShowBooking}>Đặt bàn</span>
                <span className="hover-text" style={{cursor: 'pointer'}} onClick={onGoToAbout}>Giới thiệu</span>
                <span className="hover-text" style={{cursor: 'pointer'}} onClick={onGoToContact}>Liên hệ</span>
            </Space>

            {/* 3. CỤM CÔNG CỤ BÊN PHẢI */}
            <Space size="middle" style={{ display: 'flex', alignItems: 'center' }}>
                <Input 
                    placeholder="Tìm món ăn..." 
                    prefix={<SearchOutlined style={{ color: '#999', fontSize: '14px' }} />} 
                    value={searchText} 
                    onChange={(e) => onSearch(e.target.value)} 
                    allowClear
                    style={{ borderRadius: '30px', width: '220px', background: '#f5f5f5', border: 'none', fontSize: '13px', height: '36px', paddingTop: '0', paddingBottom: '0' }} 
                    className="d-none d-md-flex"
                />

                {/* 🛒 ICON GIỎ HÀNG (MỚI THÊM VÀO) */}
                <div onClick={() => navigate('/cart')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 5px' }}>
                    <Badge count={cartCount} showZero color="#cf1322" offset={[-2, 2]}>
                        <Button 
                            shape="circle" 
                            icon={<ShoppingCartOutlined style={{ fontSize: '18px', color: '#1f2937' }} />} 
                            size="large"
                            style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                        />
                    </Badge>
                </div>
                
                {user ? (
                    <div style={{ marginLeft: '5px' }}>
                        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight" arrow>
                            <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '20px', transition: '0.3s' }}>
                                <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} icon={<UserOutlined />} size="large">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                </Avatar>
                                <span className="d-none d-sm-inline" style={{ fontWeight: 600, color: '#333' }}>{user.fullName}</span>
                            </Space>
                        </Dropdown>
                    </div>
                ) : (
                    <Button type="primary" ghost icon={<LoginOutlined />} onClick={onLogin} style={{ borderRadius: '20px', fontWeight: '600', height: '32px' }}>Đăng nhập</Button>
                )}
            </Space>
        </Header>
    );
};

export default CustomerHeader;