import React from 'react';
import { Layout } from 'antd';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';

const { Content } = Layout;

const MainLayout = ({ 
    children, user, onLogin, onLogout, 
    onGoHome, onGoToMenu, onShowHistory, onShowBooking, onGoToProfile, 
    onGoToAbout, onGoToContact, // <--- NHẬN THÊM
    searchText, onSearch 
}) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <CustomerHeader 
                user={user}
                onLogin={onLogin}
                onLogout={onLogout}
                onGoHome={onGoHome}
                onGoToMenu={onGoToMenu}
                onShowHistory={onShowHistory}
                onShowBooking={onShowBooking}
                onGoToProfile={onGoToProfile}
                
                // TRUYỀN XUỐNG HEADER
                onGoToAbout={onGoToAbout}
                onGoToContact={onGoToContact}
                
                searchText={searchText} 
                onSearch={onSearch}
            />
            <Content>{children}</Content>
            <CustomerFooter />
        </Layout>
    );
};

export default MainLayout;