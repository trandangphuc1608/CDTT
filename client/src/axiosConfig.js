import axios from 'axios';

// -----------------------------------------------------------------------------
// CẤU HÌNH ĐƯỜNG DẪN SERVER (API)
// -----------------------------------------------------------------------------
// Cách dùng: Muốn dùng cái nào thì bỏ comment dòng đó, và comment dòng còn lại.

// 🟢 1. Dùng Server Online (Render) - Đang bật
//axios.defaults.baseURL = 'https://fastfood-backend-elvz.onrender.com';

// 🟠 2. Dùng Server Local (Ở nhà) - Đang tắt
axios.defaults.baseURL = 'http://localhost:8081';

// -----------------------------------------------------------------------------
// (Tùy chọn) Cấu hình thêm tự động gửi Token nếu có đăng nhập
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');