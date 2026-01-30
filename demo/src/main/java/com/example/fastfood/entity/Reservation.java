package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName; // Tên khách hàng
    
    private String phoneNumber; // Số điện thoại
    
    private LocalDateTime reservationTime; // Ngày giờ đặt (VD: 2024-02-20T18:30:00)
    
    private Integer numberOfPeople; // Số lượng người
    
    @Column(columnDefinition = "TEXT")
    private String note; // Ghi chú thêm
    
    // Trạng thái: PENDING (Chờ), CONFIRMED (Đã nhận), CANCELLED (Hủy)
    private String status; 
    
    private LocalDateTime createdAt; // Ngày tạo đơn

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "PENDING";
    }
}