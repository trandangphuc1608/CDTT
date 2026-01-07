import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Button, Input, Space, Avatar, Dropdown, message } from 'antd'; // Bỏ import Menu vì không dùng trực tiếp nữa
import { 
    SearchOutlined, UserOutlined, 
    LogoutOutlined, LoginOutlined, HistoryOutlined, HomeOutlined,
    ProfileOutlined, ShopOutlined, DownOutlined
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
    // --- STATE CHO CHI NHÁNH ---
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    // --- LOAD DANH SÁCH CHI NHÁNH ---
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/branches');
                // Lọc chi nhánh đang hoạt động
                const activeBranches = res.data ? res.data.filter(b => b.active) : [];
                setBranches(activeBranches);

                // Logic chọn chi nhánh mặc định
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

    // Hàm xử lý chọn chi nhánh
    const handleSelectBranch = (branch) => {
        setSelectedBranch(branch);
        localStorage.setItem('selectedBranchId', branch.id);
        message.success(`Đã chuyển sang: ${branch.name}`);
        // window.location.reload(); // Bỏ comment nếu muốn tải lại trang
    };

    // --- SỬA LỖI Ở ĐÂY: TẠO MENU ITEMS CHUẨN ANT DESIGN V5 ---
    const branchItems = branches.map(branch => ({
        key: String(branch.id),
        label: branch.name,
        icon: <ShopOutlined />,
        onClick: () => handleSelectBranch(branch) // Gắn sự kiện click vào từng item
    }));

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

                {/* --- SỬA LỖI Ở ĐÂY: DÙNG PROP MENU THAY VÌ OVERLAY --- */}
                {branches.length > 0 && (
                    <Dropdown 
                        menu={{ items: branchItems }} // Dùng prop 'menu' + 'items'
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
                <span className="hover-text" onClick={onGoHome}>Trang chủ</span>
                <span className="hover-text" onClick={onGoToMenu}>Thực đơn</span>
                <span className="hover-text" onClick={onShowBooking}>Đặt bàn</span>
                <span className="hover-text" onClick={onGoToAbout}>Giới thiệu</span>
                <span className="hover-text" onClick={onGoToContact}>Liên hệ</span>
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
                
                {user ? (
                    <div style={{ marginLeft: '10px' }}>
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