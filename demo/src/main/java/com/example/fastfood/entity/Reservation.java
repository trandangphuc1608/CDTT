package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String phoneNumber;
    private String email;

    private LocalDateTime bookingTime; // Thời gian khách đến
    private Integer guestCount;        // Số lượng khách
    private String note;               // Ghi chú thêm

    private String status = "PENDING"; // PENDING (Chờ duyệt), CONFIRMED (Đã xác nhận), CANCELLED (Hủy)

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Liên kết với tài khoản (nếu có)
}