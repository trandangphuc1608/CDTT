package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "banners")
@Data
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // Tiêu đề banner (VD: Khuyến mãi mùa hè)
    private String imageUrl;    // Đường dẫn ảnh
    private String linkUrl;     // Link khi bấm vào (VD: /menu)
    private Boolean isActive = true; // Trạng thái hiển thị
}