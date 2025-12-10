import React, { useState, useEffect } from "react";
import POSView from "./components/POSView";
import KitchenView from "./components/KitchenView"; // <--- Import Kitchen
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage"; // <--- Import Register
import AdminDashboard from "./components/AdminDashboard";
import HomePage from "./components/HomePage";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // State cho form đăng ký

  useEffect(() => {
    const savedUser = localStorage.getItem("fastfood_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("fastfood_user", JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fastfood_user");
    setShowLogin(false);
  };

  const renderView = () => {
    if (user) {
        switch (user.role) {
          case "ADMIN": return <AdminDashboard onLogout={handleLogout} />;
          case "KITCHEN": return <KitchenView />; // <--- Hiển thị Bếp
          case "CASHIER": return <POSView />;
          case "CUSTOMER": 
          case "GUEST": 
            // Nếu là khách -> Vẫn hiện trang chủ, nhưng HomePage sẽ tự nhận diện user để hiện nút Lịch sử
            return <HomePage onLogin={() => {}} />; 
          default: return <div className="text-center mt-5">Vai trò không hợp lệ!</div>;
        }
    }

    if (showRegister) {
        return <RegisterPage onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />;
    }

    if (showLogin) {
        return <LoginPage 
            onLogin={handleLoginSuccess} 
            onGuest={() => { setUser({ role: "GUEST", fullName: "Khách" }); setShowLogin(false); }}
            // Bạn cần sửa thêm LoginPage để có nút "Chưa có tài khoản? Đăng ký" gọi prop này
            onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} 
        />;
    }

    return <HomePage onLogin={() => setShowLogin(true)} />;
  };

  // Logic full màn hình cho Admin và Kitchen
  const isFullPage = (user && (user.role === 'ADMIN' || user.role === 'KITCHEN')) || (!user && !showLogin && !showRegister);

  if (isFullPage) {
      return renderView();
  }

  return (
    <div className="container-fluid py-3 bg-light min-vh-100">
      {/* Chỉ hiện Navbar đơn giản nếu không phải Admin/Kitchen */}
      {user && user.role !== 'ADMIN' && user.role !== 'KITCHEN' && user.role !== 'CUSTOMER' && (
        <nav className="navbar navbar-light bg-white shadow-sm mb-4 px-4 rounded justify-content-between">
          <div className="d-flex align-items-center">
            <span className="navbar-brand fw-bold text-danger fs-3 me-3">🍔 FASTFOOD</span>
            <span className="badge bg-secondary">
              Xin chào, {user.fullName} ({user.role})
            </span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Đăng xuất 🚪</button>
        </nav>
      )}

      <div className="px-2">
        {renderView()}
      </div>
    </div>
  );
}

export default App;