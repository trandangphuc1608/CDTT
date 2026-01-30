import React from 'react';
import Draggable from 'react-draggable';
import { useNavigate } from 'react-router-dom';

const FloatingCart = ({ cartCount }) => {
    const navigate = useNavigate();

    return (
        // Dùng z-index cực cao để luôn nổi trên cùng
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            <Draggable>
                <div 
                    id="floating-cart-icon" // ID quan trọng để hiệu ứng bay tìm thấy đích đến
                    onClick={() => navigate('/cart')}
                    className="shadow-lg"
                    style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#ffc107', // Màu vàng đặc trưng
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'grab', // Con trỏ hình bàn tay nắm
                        position: 'relative',
                        border: '3px solid white'
                    }}
                >
                    {/* Icon Giỏ hàng */}
                    <i className="bi bi-cart-fill fs-4 text-dark"></i>

                    {/* Badge số lượng */}
                    {cartCount > 0 && (
                        <span 
                            className="badge bg-danger rounded-pill"
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                fontSize: '12px',
                                border: '2px solid white'
                            }}
                        >
                            {cartCount}
                        </span>
                    )}
                </div>
            </Draggable>
        </div>
    );
};

export default FloatingCart;