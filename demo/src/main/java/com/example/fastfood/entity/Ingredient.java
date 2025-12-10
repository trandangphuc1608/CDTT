package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ingredients")
@Data
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Tên nguyên liệu (VD: Thịt bò, Bột mì)

    private String unit; // Đơn vị tính (VD: kg, lít, cái)

    private Double quantity; // Số lượng tồn kho

    private Double minLimit; // Mức cảnh báo (Nếu tồn kho < mức này sẽ báo đỏ)
    
    // Constructor mặc định
    public Ingredient() {}

    // Constructor có tham số để tạo nhanh
    public Ingredient(String name, String unit, Double quantity, Double minLimit) {
        this.name = name;
        this.unit = unit;
        this.quantity = quantity;
        this.minLimit = minLimit;
    }
}