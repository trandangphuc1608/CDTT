package com.example.fastfood.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // Import thư viện này
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "product_ingredients")
@Data
public class ProductIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity_needed")
    private Double quantityNeeded;

    // 👇 CÁI NÀY PHẢI CÓ @JsonIgnore (Để tránh vòng lặp)
    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore 
    private Product product;

    // 👇 CÁI NÀY TUYỆT ĐỐI "KHÔNG" ĐƯỢC CÓ @JsonIgnore
    // Nếu bạn lỡ tay thêm @JsonIgnore vào đây thì tên nguyên liệu sẽ bị mất
    @ManyToOne
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient; 
}