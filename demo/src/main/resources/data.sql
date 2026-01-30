-- 1. NẠP DỮ LIỆU USER
INSERT IGNORE INTO users (username, password, full_name, role) VALUES 
('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQiy38C', 'Quản Trị Viên', 'ADMIN'),
('tn1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQiy38C', 'Thu Ngân A', 'CASHIER'),
('bep1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQiy38C', 'Đầu Bếp Trưởng', 'KITCHEN'),
('kh1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQiy38C', 'Khách hàng VIP', 'CUSTOMER');

-- 2. NẠP DANH MỤC
INSERT IGNORE INTO categories (id, name, description, is_active) VALUES 
(1, 'Burger & Cơm', 'Các món chính ngon tuyệt', true),
(2, 'Gà Rán', 'Gà rán giòn tan thấm vị', true),
(3, 'Thức Uống', 'Nước ngọt và trà giải nhiệt', true),
(4, 'Món Ăn Kèm', 'Khoai tây, Salad các loại', true);

-- 3. NẠP MENU MÓN ĂN (Đã xóa chú thích ở giữa để tránh lỗi)
INSERT IGNORE INTO products (name, description, price, image_url, is_available, category_id) VALUES 
('Burger Bò Phô Mai', 'Bò nướng lửa hồng kẹp phô mai tan chảy', 55000, 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', true, 1),
('Burger Tôm Giòn', 'Nhân tôm tươi chiên xù giòn rụm', 60000, 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', true, 1),
('Cơm Gà Giòn', 'Cơm dẻo ăn kèm đùi gà chiên mắm', 45000, 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', true, 1),
('Đùi Gà Truyền Thống', 'Đùi gà tẩm bột chiên giòn rụm', 35000, 'https://cdn-icons-png.flaticon.com/512/1057/1057392.png', true, 2),
('Cánh Gà Sốt Cay', 'Cánh gà phủ sốt cay Hàn Quốc', 38000, 'https://cdn-icons-png.flaticon.com/512/1057/1057392.png', true, 2),
('Gà Viên Popcorn', 'Gà viên nhỏ ăn vặt cực cuốn', 30000, 'https://cdn-icons-png.flaticon.com/512/1057/1057392.png', true, 2),
('Pepsi Tươi', 'Ly lớn sảng khoái', 15000, 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png', true, 3),
('Trà Đào Cam Sả', 'Thanh mát giải nhiệt', 25000, 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png', true, 3),
('Khoai Tây Chiên', 'Chiên vàng giòn chấm tương ớt', 20000, 'https://cdn-icons-png.flaticon.com/512/1046/1046786.png', true, 4),
('Salad Cá Ngừ', 'Rau xanh tươi mát kèm cá ngừ', 35000, 'https://cdn-icons-png.flaticon.com/512/1046/1046786.png', true, 4);