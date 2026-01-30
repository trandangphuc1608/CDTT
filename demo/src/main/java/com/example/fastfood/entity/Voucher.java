package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // Mã giảm giá (VD: SALE50)

    private Double discountPercent; // Giảm bao nhiêu % (VD: 10.0)
    
    private LocalDate expirationDate; // Ngày hết hạn
    
    private Integer quantity; // Số lượng mã
    
    private Boolean isActive; // Còn hiệu lực không
}