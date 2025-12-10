package com.example.fastfood.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "product_ingredients")
@Data
public class ProductIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với Món ăn (VD: Burger)
    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore // Tránh vòng lặp
    private Product product;

    // Liên kết với Nguyên liệu (VD: Thịt bò)
    @ManyToOne
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    private Double quantityNeeded; // Số lượng cần (VD: 0.1 kg)
}