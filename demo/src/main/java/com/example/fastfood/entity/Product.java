package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double price;

    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    // Thêm trường trạng thái để quản lý Bật/Tắt món
    private Boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // 👇 QUAN TRỌNG: fetch = EAGER để luôn tải danh sách công thức
    // mappedBy = "product" phải khớp với biến 'product' trong ProductIngredient.java
    @OneToMany(mappedBy = "product", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ProductIngredient> productIngredients;
}