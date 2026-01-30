import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";

// Import các components
import POSPage from "./components/POSPage";
import CartPage from "./components/CartPage";
import KitchenView from "./components/KitchenPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AdminDashboard from "./components/AdminDashboard";
import OrderHistoryPage from "./components/Admin/OrderHistoryPage";
import HomePage from "./components/HomePage";
import MenuPage from "./components/MenuPage";
import ProfilePage from "./components/ProfilePage";
import MainLayout from "./components/MainLayout";
import CustomerOrderHistory from './components/CustomerOrderHistory';
import TableManagementPage from "./components/TableManagementPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import ProductDetailPage from "./components/ProductDetailPage";
import FavoriteProducts from "./components/FavoriteProducts";
import PaymentReturn from './components/PaymentReturn';
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";
import ChatBot from "./components/ChatBot";

import './axiosConfig';

function App() {
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem("fastfood_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (location.pathname === '/' && parsedUser.role === 'ADMIN') navigate('/admin');
      if (location.pathname === '/' && parsedUser.role === 'CASHIER') navigate('/pos');
      if (location.pathname === '/' && parsedUser.role === 'KITCHEN') navigate('/kitchen');
    }
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('fastfood_cart')) || [];
    const count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
    setCartCount(count);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("fastfood_user", JSON.stringify(userData));
    
    switch (userData.role) {
      case "ADMIN": navigate("/admin"); break;
      case "CASHIER": navigate("/pos"); break;
      case "KITCHEN": navigate("/kitchen"); break;
      default: navigate("/"); 
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fastfood_user");
    setSearchText('');
    navigate("/login");
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value && location.pathname !== '/menu') {
      navigate('/menu');
    }
  };

  const CustomerLayoutWrapper = ({ children }) => {
    return (
      <MainLayout
        user={user}
        onLogin={() => navigate("/login")}
        onLogout={handleLogout}
        onGoHome={() => navigate("/")}
        onGoToMenu={() => navigate("/menu")}
        onGoToProfile={() => user ? navigate("/profile") : navigate("/login")}
        onGoToAbout={() => navigate("/about")}
        onGoToContact={() => navigate("/contact")}
        onShowBooking={() => navigate("/table-booking")}
        
        onOpenCart={() => navigate("/cart")}
        cartCount={cartCount}
        onShowHistory={() => user ? setShowHistoryModal(true) : navigate("/login")}
        
        searchText={searchText}
        onSearch={handleSearch}
      >
        {children}
      </MainLayout>
    );
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <div className="text-center mt-5">Bạn không có quyền truy cập trang này!</div>;
    }
    return children;
  };

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLoginSuccess} onGuest={() => { setUser({ role: "GUEST", fullName: "Khách" }); navigate("/"); }} onSwitchToRegister={() => navigate("/register")} />} />
        <Route path="/register" element={<RegisterPage onSwitchToLogin={() => navigate("/login")} />} />

        {/* CUSTOMER ROUTES */}
        <Route path="/" element={<CustomerLayoutWrapper><HomePage onGoToMenu={() => navigate("/menu")} onOrder={() => navigate("/menu")} user={user} /></CustomerLayoutWrapper>} />
        <Route path="/menu" element={<CustomerLayoutWrapper><MenuPage user={user} onLogin={() => navigate("/login")} searchText={searchText} /></CustomerLayoutWrapper>} />
        <Route path="/about" element={<CustomerLayoutWrapper><AboutPage onGoToMenu={() => navigate("/menu")} /></CustomerLayoutWrapper>} />
        <Route path="/contact" element={<CustomerLayoutWrapper><ContactPage /></CustomerLayoutWrapper>} />
        
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'GUEST', 'ADMIN', 'CASHIER', 'KITCHEN']}><CustomerLayoutWrapper><ProfilePage user={user} onUserUpdated={(u) => { setUser(u); localStorage.setItem("fastfood_user", JSON.stringify(u)); }} /></CustomerLayoutWrapper></ProtectedRoute>} />
        <Route path="/table-booking" element={<CustomerLayoutWrapper><TableManagementPage user={user} onGoHome={() => navigate("/")} onLogout={handleLogout} /></CustomerLayoutWrapper>} />
        <Route path="/cart" element={<CartPage onGoHome={() => navigate("/menu")} />} />
        <Route path="/payment_return" element={<PaymentReturn />} />

        {/* STAFF ROUTES */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="/pos" element={<ProtectedRoute allowedRoles={['CASHIER', 'ADMIN']}><POSPage /></ProtectedRoute>} />
        <Route path="/kitchen" element={<ProtectedRoute allowedRoles={['KITCHEN', 'ADMIN']}><KitchenView onLogout={handleLogout} /></ProtectedRoute>} />

        {/* ROUTE CHI TIẾT SẢN PHẨM */}
        <Route 
          path="/product/:id" 
          element={
             <CustomerLayoutWrapper>
                <ProductDetailPage onOrder={() => navigate("/cart")} />
             </CustomerLayoutWrapper>
          } 
        />

        {/* ROUTE YÊU THÍCH (ĐÃ KHỚP ĐƯỜNG DẪN) */}
        <Route 
          path="/favorites" 
          element={
             <CustomerLayoutWrapper>
                <FavoriteProducts user={user} />
             </CustomerLayoutWrapper>
          } 
        />

        <Route 
          path="/policy" 
          element={
             <CustomerLayoutWrapper>
                <PrivacyPolicy />
             </CustomerLayoutWrapper>
          } 
        />

        <Route 
          path="/terms" 
          element={
             <CustomerLayoutWrapper>
                <TermsOfUse />
             </CustomerLayoutWrapper>
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <CustomerOrderHistory user={user} open={showHistoryModal} onCancel={() => setShowHistoryModal(false)} />
      <ChatBot />
    </div>
  );
}

export default App;