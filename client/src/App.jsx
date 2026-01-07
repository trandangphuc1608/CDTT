import React, { useState, useEffect } from "react";
import POSPage from "./components/POSPage";
import CartPage from "./components/CartPage";
import KitchenView from "./components/KitchenView";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AdminDashboard from "./components/AdminDashboard";
import HomePage from "./components/HomePage";
import MenuPage from "./components/MenuPage";
import ProfilePage from "./components/ProfilePage";
import MainLayout from "./components/MainLayout";
import CustomerOrderHistory from './components/CustomerOrderHistory';
import BookingModal from './components/BookingModal'; // You might want to remove this if fully replacing with TableManagementPage
import TableManagementPage from "./components/TableManagementPage"; // <--- New Import
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Navigation State
  const [isOrdering, setIsOrdering] = useState(false);
  const [showMenuPage, setShowMenuPage] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [showTablePage, setShowTablePage] = useState(false); // <--- New State for Table Page

  // --- IMPORTANT STATE: STORE TARGET CATEGORY ID ---
  const [targetCategoryId, setTargetCategoryId] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  // const [showBookingModal, setShowBookingModal] = useState(false); // Can be deprecated if using TableManagementPage

  // Cart Count State
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem("fastfood_user");
    if (savedUser) setUser(JSON.parse(savedUser));

    // Initial cart count check
    updateCartCount();

    // Listen for storage events to update cart count
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
    setShowLogin(false);
  };

  const resetNavigation = () => {
    setIsOrdering(false);
    setShowMenuPage(false);
    setShowProfilePage(false);
    setShowAboutPage(false);
    setShowContactPage(false);
    setShowTablePage(false); // <--- Reset Table Page
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fastfood_user");
    setShowLogin(false);
    resetNavigation();
    setSearchText('');
  };

  // --- NAVIGATION FUNCTIONS ---
  const handleGoToMenu = (categoryId = null) => {
    resetNavigation();
    setTargetCategoryId(categoryId);
    setShowMenuPage(true);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value && !showMenuPage) {
      handleGoToMenu(null);
    }
  };

  const renderView = () => {
    // Layout content for customers
    const CustomerLayoutContent = (
      <MainLayout
        user={user}
        onLogin={() => user ? {} : setShowLogin(true)}
        onLogout={handleLogout}

        onGoHome={() => { resetNavigation(); setSearchText(''); }}
        onGoToMenu={() => handleGoToMenu(null)}
        onGoToProfile={() => {
          if (!user) setShowLogin(true);
          else { resetNavigation(); setShowProfilePage(true); }
        }}
        onGoToAbout={() => { resetNavigation(); setShowAboutPage(true); }}
        onGoToContact={() => { resetNavigation(); setShowContactPage(true); }}

        // --- NEW: Go to Table Booking ---
        onShowBooking={() => { // Using onShowBooking prop to trigger Table Page instead of Modal
             resetNavigation();
             setShowTablePage(true);
        }}
        
        // --- CART LOGIC ---
        onOpenCart={() => {
          setIsOrdering(true);
        }}
        cartCount={cartCount}
        
        onShowHistory={() => user ? setShowHistoryModal(true) : setShowLogin(true)}
        
        searchText={searchText}
        onSearch={handleSearch}
      >
        {showTablePage ? (
            <TableManagementPage 
                user={user} 
                onGoHome={() => { resetNavigation(); }} 
                onLogout={handleLogout} 
            />
        ) : showProfilePage ? (
          <ProfilePage user={user} onUserUpdated={(u) => { setUser(u); localStorage.setItem("fastfood_user", JSON.stringify(u)); }} />
        ) : showAboutPage ? (
          <AboutPage onGoToMenu={() => handleGoToMenu(null)} />
        ) : showContactPage ? (
          <ContactPage />
        ) : showMenuPage ? (
          <MenuPage
            user={user}
            onLogin={() => setShowLogin(true)}
            onOrder={() => setIsOrdering(true)}
            searchText={searchText}
            initialCategoryId={targetCategoryId}
          />
        ) : (
          <HomePage
            onGoToMenu={handleGoToMenu}
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

        // --- CASHIER CASE ---
        case "CASHIER": return <POSPage />;

        // --- CUSTOMER CASE ---
        case "CUSTOMER":
        case "GUEST":
          if (isOrdering) {
            return <CartPage onGoHome={() => setIsOrdering(false)} />;
          }
          return CustomerLayoutContent;

        default: return <div className="text-center mt-5">Vai trò không hợp lệ!</div>;
      }
    }

    if (showRegister) return <RegisterPage onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />;
    if (showLogin) return <LoginPage onLogin={handleLoginSuccess} onGuest={() => { setUser({ role: "GUEST", fullName: "Khách" }); setShowLogin(false); }} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />;

    return CustomerLayoutContent;
  };

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      {renderView()}
      <CustomerOrderHistory user={user} open={showHistoryModal} onCancel={() => setShowHistoryModal(false)} />
      {/* Removed BookingModal as we are using TableManagementPage now */}
      {/* <BookingModal open={showBookingModal} onCancel={() => setShowBookingModal(false)} user={user} /> */} 
    </div>
  );
}

export default App;