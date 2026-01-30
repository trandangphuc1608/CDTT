// src/utils/animationUtils.js

export const runFlyingEffect = (e, targetCartId = 'floating-cart-icon', productImageSrc) => {
    // 1. Xác định vị trí nút bấm (Điểm bắt đầu)
    const startRect = e.target.getBoundingClientRect();
    
    // 2. Xác định vị trí giỏ hàng (Điểm kết thúc)
    const cartElement = document.getElementById(targetCartId);
    if (!cartElement) return;
    const endRect = cartElement.getBoundingClientRect();

    // 3. Tạo một ảnh clone tạm thời
    const flyingItem = document.createElement('img');
    flyingItem.src = productImageSrc || 'https://cdn-icons-png.flaticon.com/512/3081/3081098.png'; // Ảnh mặc định nếu ko có
    flyingItem.style.position = 'fixed';
    flyingItem.style.width = '50px';
    flyingItem.style.height = '50px';
    flyingItem.style.borderRadius = '50%';
    flyingItem.style.objectFit = 'cover';
    flyingItem.style.zIndex = '9999';
    flyingItem.style.pointerEvents = 'none'; // Để không chặn click chuột
    flyingItem.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)'; // Hiệu ứng bay mượt
    
    // Đặt vị trí ban đầu
    flyingItem.style.left = `${startRect.left}px`;
    flyingItem.style.top = `${startRect.top}px`;

    document.body.appendChild(flyingItem);

    // 4. Kích hoạt bay sau 50ms (để trình duyệt kịp render vị trí đầu)
    setTimeout(() => {
        flyingItem.style.left = `${endRect.left + 10}px`; // +10 để vào giữa icon
        flyingItem.style.top = `${endRect.top + 10}px`;
        flyingItem.style.width = '20px'; // Thu nhỏ dần khi bay vào
        flyingItem.style.height = '20px';
        flyingItem.style.opacity = '0.5';
    }, 50);

    // 5. Dọn dẹp sau khi bay xong (0.8s)
    setTimeout(() => {
        if (document.body.contains(flyingItem)) {
            document.body.removeChild(flyingItem);
        }
        // Thêm hiệu ứng rung giỏ hàng
        cartElement.style.transform = 'scale(1.2)';
        setTimeout(() => cartElement.style.transform = 'scale(1)', 150);
    }, 800);
};