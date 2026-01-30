import React, { useRef } from 'react';
import { Layout, Button, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
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
    
    onOpenCart,   
    cartCount = 0, 
    searchText,   
    onSearch     
}) => {
    // 1. Ref cho Draggable (để tránh lỗi findDOMNode)
    const nodeRef = useRef(null);
    
    // 2. Ref để kiểm tra xem có đang kéo hay không
    const isDraggingRef = useRef(false);

    const handleOpenCart = (e) => {
        // 3. Logic chặn click khi đang kéo
        // Nếu cờ hiệu đang là TRUE (đang kéo) thì dừng lại, không mở giỏ
        if (isDraggingRef.current) {
            e.preventDefault();
            return;
        }
        // Nếu không kéo thì mở bình thường
        onOpenCart();
    };

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

            {/* --- GIỎ HÀNG KÉO THẢ ĐƯỢC (ĐÃ FIX LỖI CLICK) --- */}
            <div style={{ position: 'fixed', bottom: '100px', right: '50px', zIndex: 9999 }}>
                
                <Draggable 
                    nodeRef={nodeRef}
                    // 4. Khi bắt đầu kéo -> Ghi nhận "Đang chuyển động"
                    onDrag={() => { isDraggingRef.current = true; }}
                    
                    // 5. Khi thả chuột ra -> Đợi 1 chút rồi mới tắt cờ hiệu
                    // (Mục đích: Để sự kiện onClick bên dưới kịp nhận ra là vừa mới kéo xong)
                    onStop={() => {
                        setTimeout(() => {
                            isDraggingRef.current = false;
                        }, 100); 
                    }}
                >
                    <div ref={nodeRef} style={{ cursor: 'move', display: 'inline-block' }}>
                        <Badge count={cartCount} showZero={false} offset={[-5, 5]}>
                            <Button 
                                id="floating-cart-icon"
                                type="primary" 
                                shape="circle" 
                                icon={<ShoppingCartOutlined style={{ fontSize: '24px' }} />} 
                                size="large"
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '2px solid white'
                                }}
                                // 6. Thay hàm onOpenCart trực tiếp bằng hàm handleOpenCart đã bọc logic kiểm tra
                                onClick={handleOpenCart} 
                            />
                        </Badge>
                    </div>
                </Draggable>
            </div>

        </Layout>
    );
};

export default MainLayout;