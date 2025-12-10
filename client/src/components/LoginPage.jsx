import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin, onGuest, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        // Log để kiểm tra xem dữ liệu gửi đi là gì
        console.log("Đang gửi đăng nhập:", { username, password }); 
        
        const res = await axios.post('http://localhost:8081/api/auth/login', {
            username,
            password
        });
        
        console.log("Kết quả từ server:", res.data);
        onLogin(res.data);
    } catch (err) {
        console.error("Lỗi chi tiết:", err); // Xem lỗi này trong F12 -> Console

        if (err.code === "ERR_NETWORK") {
            setError("❌ Lỗi kết nối! Backend chưa chạy hoặc sai Port.");
        } else if (err.response) {
            // Lỗi do server trả về (VD: 401 Sai mật khẩu)
            setError(`❌ Server báo: ${err.response.data || "Sai thông tin"}`);
        } else {
            setError("❌ Lỗi không xác định: " + err.message);
        }
    }
};

    return (
        // Container chính: dùng position: fixed để phủ kín màn hình
        <div 
            className="d-flex justify-content-center align-items-center bg-light"
            style={{
                position: 'fixed',   // Ghim cố định
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',     // Full chiều cao màn hình
                zIndex: 9999         // Đảm bảo nổi lên trên cùng
            }}
        >
            <div className="card shadow-lg p-4 border-0" style={{ width: '400px', maxWidth: '90%', borderRadius: '15px' }}>
                <div className="text-center mb-4">
                    <div className="bg-danger text-white d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                        🍔
                    </div>
                    <h3 className="fw-bold text-dark">Đăng Nhập</h3>
                    <p className="text-muted small">Hệ thống quản lý FastFood</p>
                </div>
                
                {error && <div className="alert alert-danger p-2 text-center small mb-3">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-bold small text-uppercase text-secondary">Tài khoản</label>
                        <input 
                            className="form-control form-control-lg fs-6"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập username..."
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold small text-uppercase text-secondary">Mật khẩu</label>
                        <input 
                            type="password"
                            className="form-control form-control-lg fs-6"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập password..."
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-danger w-100 py-2 fw-bold shadow-sm mb-2">
                        ĐĂNG NHẬP
                    </button>
                    
                    {/* --- DÒNG ĐĂNG KÝ MỚI THÊM --- */}
                    <div className="text-center mb-3">
                        <span className="text-muted small">Chưa có tài khoản? </span>
                        <a 
                            href="#" 
                            className="text-danger fw-bold text-decoration-none"
                            onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}
                        >
                            Đăng ký ngay
                        </a>
                    </div>
                </form>

                <div className="text-center my-3 position-relative">
                    <hr className="text-muted"/>
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
                        HOẶC
                    </span>
                </div>

                <button onClick={onGuest} className="btn btn-outline-secondary w-100 py-2">
                    🛍️ Tiếp tục với tư cách Khách
                </button>
                
                {/* Gợi ý tài khoản để test nhanh */}
                <div className="mt-4 pt-3 border-top text-center text-muted" style={{fontSize: '0.8rem'}}>
                    <div className="row">
                        <div className="col-6 text-start ps-4">
                            <div>👮 <b>Admin:</b> admin/123</div>
                            <div>👩‍🍳 <b>Bếp:</b> bep1/123</div>
                        </div>
                        <div className="col-6 text-start">
                            <div>👩‍💼 <b>Thu ngân:</b> tn1/123</div>
                            <div>👤 <b>Khách:</b> kh1/123</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;