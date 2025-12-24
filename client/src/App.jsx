import React, { useState, useEffect } from "react";
// ... (Giữ các import cũ)
import POSView from "./components/POSView";
import KitchenView from "./components/KitchenView";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage"; 
import AdminDashboard from "./components/AdminDashboard";
import HomePage from "./components/HomePage";
import MenuPage from "./components/MenuPage";
import ProfilePage from "./components/ProfilePage"; 
import MainLayout from "./components/MainLayout";
import CustomerOrderHistory from './components/CustomerOrderHistory';
import BookingModal from './components/BookingModal';

// --- IMPORT MỚI ---
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); 
  
  // State điều hướng
  const [isOrdering, setIsOrdering] = useState(false);  
  const [showMenuPage, setShowMenuPage] = useState(false); 
  const [showProfilePage, setShowProfilePage] = useState(false);
  // --- STATE MỚI ---
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  
  const [searchText, setSearchText] = useState(''); 
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("fastfood_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("fastfood_user", JSON.stringify(userData));
    setShowLogin(false);
  };

  const resetNavigation = () => {
      setIsOrdering(false);
      setShowMenuPage(false);
      setShowProfilePage(false);
      setShowAboutPage(false);   // Reset
      setShowContactPage(false); // Reset
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fastfood_user");
    setShowLogin(false);
    resetNavigation();
    setSearchText(''); 
  };

  const handleSearch = (value) => {
      setSearchText(value);
      if (value && !showMenuPage) {
          resetNavigation();
          setShowMenuPage(true);
      }
  };

  const renderView = () => {
    // --- PHẦN LAYOUT CHO KHÁCH ---
    const CustomerLayoutContent = (
        <MainLayout
            user={user}
            onLogin={() => user ? {} : setShowLogin(true)} 
            onLogout={handleLogout}
            
            // CÁC HÀM ĐIỀU HƯỚNG
            onGoHome={() => { resetNavigation(); setSearchText(''); }}
            onGoToMenu={() => { resetNavigation(); setShowMenuPage(true); }}
            onGoToProfile={() => { 
                if(!user) setShowLogin(true); 
                else { resetNavigation(); setShowProfilePage(true); } 
            }}
            onGoToAbout={() => { resetNavigation(); setShowAboutPage(true); }}     // <--- Hàm mới
            onGoToContact={() => { resetNavigation(); setShowContactPage(true); }} // <--- Hàm mới
            
            onShowHistory={() => user ? setShowHistoryModal(true) : setShowLogin(true)}
            onShowBooking={() => setShowBookingModal(true)}
            
            searchText={searchText}
            onSearch={handleSearch} 
        >
            {/* LOGIC HIỂN THỊ NỘI DUNG */}
            {showProfilePage ? (
                <ProfilePage user={user} onUserUpdated={(updatedUser) => { setUser(updatedUser); localStorage.setItem("fastfood_user", JSON.stringify(updatedUser)); }} />
            ) : showAboutPage ? (
                <AboutPage onGoToMenu={() => { resetNavigation(); setShowMenuPage(true); }} /> 
            ) : showContactPage ? (
                <ContactPage />
            ) : showMenuPage ? (
                <MenuPage 
                    user={user}
                    onLogin={() => setShowLogin(true)}
                    onOrder={() => setIsOrdering(true)}
                    searchText={searchText} 
                /> 
            ) : (
                <HomePage 
                    onGoToMenu={() => { resetNavigation(); setShowMenuPage(true); }}
                    onOrder={() => user ? setIsOrdering(true) : setShowLogin(true)}
                    user={user}
                />
            )}
        </MainLayout>
    );

    if (user) {
        switch (user.role) {
          case "ADMIN": return <AdminDashboard onLogout={handleLogout} />;
          case "KITCHEN": return <KitchenView onLogout={handleLogout} />; 
          case "CASHIER": return <POSView />;
          case "CUSTOMER": 
          case "GUEST": 
            if (isOrdering) return <POSView isCustomer={true} />;
            return CustomerLayoutContent;
          default: return <div className="text-center mt-5">Vai trò không hợp lệ!</div>;
        }
    }

    // Chưa đăng nhập
    if (showRegister) return <RegisterPage onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />;
    if (showLogin) return <LoginPage onLogin={handleLoginSuccess} onGuest={() => { setUser({ role: "GUEST", fullName: "Khách" }); setShowLogin(false); }} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />;

    return CustomerLayoutContent; // Trả về layout khách vãng lai
  };

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      {renderView()}
      <CustomerOrderHistory user={user} open={showHistoryModal} onCancel={() => setShowHistoryModal(false)} />
      <BookingModal open={showBookingModal} onCancel={() => setShowBookingModal(false)} user={user} />
    </div>
  );
}

export default App;