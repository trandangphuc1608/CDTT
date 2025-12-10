package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "vouchers")
@Data
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // Ví dụ: SALE50

    private Integer discountPercent; // Giảm bao nhiêu % (VD: 10, 20)
    
    private LocalDate expiryDate; // Ngày hết hạn
    
    private Boolean isActive = true;
}