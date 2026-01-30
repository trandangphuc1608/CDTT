package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String customerName; // Tên khách hàng

    // 🔴 BỔ SUNG 2 TRƯỜNG NÀY ĐỂ KHỚP VỚI CONTROLLER 👇
    private String phone;        // Số điện thoại
    private String address;      // Địa chỉ giao hàng
    // ---------------------------------------------------

    private Double totalPrice;   // Tổng tiền
    
    private String status;       // Trạng thái (PENDING, PROCESSING...)
    
    private LocalDateTime createdAt; // Ngày tạo đơn
    
    private String paymentMethod; // CASH hoặc VNPAY

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;
    
    // Hàm này giúp tự động gán ngày giờ khi tạo đơn (nếu Controller quên set)
    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}