package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Tên chi nhánh (VD: Chi nhánh Quận 1)

    private String address; // Địa chỉ cụ thể

    private String city; // Thành phố

    private String phoneNumber; // Số điện thoại liên hệ

    private String openingHours; // Giờ mở cửa (VD: 8:00 - 22:00)

    private Boolean isActive; // Trạng thái hoạt động

    // Thêm Constructor này để tránh lỗi nếu DataSeeder có dùng
    public Branch(String name, String address, String city, String phoneNumber, Boolean isActive) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.phoneNumber = phoneNumber;
        this.isActive = isActive;
    }

    @PrePersist
    protected void onCreate() {
        if (this.isActive == null) this.isActive = true;
    }
}