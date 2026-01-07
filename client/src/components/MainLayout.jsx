import React from 'react';
import { Layout, FloatButton, Badge } from 'antd'; // <-- 1. Import thêm FloatButton, Badge
import { ShoppingCartOutlined } from '@ant-design/icons';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';

const { Content } = Layout;

const MainLayout = ({ 
    children, 
    user, 
    onLogin, 
    onLogout, 
    onGoHome, 
    onGoToMenu, 
    onShowHistory, 
    onShowBooking, 
    onGoToProfile,
    onGoToAbout, 
    onGoToContact,
    
    // NHẬN THÊM PROPS:
    onOpenCart,  // Hàm mở giỏ hàng
    cartCount = 0, // Số lượng món trong giỏ (để hiển thị số đỏ đỏ)

    searchText,  
    onSearch     
}) => {
    return (
        <Layout style={{ minHeight: '100vh', position: 'relative' }}>
            <CustomerHeader 
                user={user}
                onLogin={onLogin}
                onLogout={onLogout}
                onGoHome={onGoHome}
                onGoToMenu={onGoToMenu}
                onShowHistory={onShowHistory}
                onShowBooking={onShowBooking}
                onGoToProfile={onGoToProfile}
                onGoToAbout={onGoToAbout}
                onGoToContact={onGoToContact}
                searchText={searchText} 
                onSearch={onSearch}
            />

            <Content>
                {children}
            </Content>

            <CustomerFooter />

            {/* --- 2. THÊM NÚT GIỎ HÀNG NỔI TẠI ĐÂY --- */}
            <FloatButton.Group shape="circle" style={{ right: 24, bottom: 80 }}>
                <Badge count={cartCount} showZero={false} offset={[-5, 5]}>
                    <FloatButton 
                        icon={<ShoppingCartOutlined />} 
                        type="primary" 
                        style={{ width: 60, height: 60 }}
                        onClick={onOpenCart} // Bấm vào sẽ gọi hàm mở giỏ hàng
                        tooltip={<div>Xem giỏ hàng & Thanh toán</div>}
                    />
                </Badge>
            </FloatButton.Group>

        </Layout>
    );
};

export default MainLayout;