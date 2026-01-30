package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor; // Thêm dòng này
import lombok.Data;
import lombok.NoArgsConstructor; // Thêm dòng này

@Entity
@Table(name = "ingredients")
@Data
@AllArgsConstructor // 👇 Tự động tạo constructor đầy đủ tham số
@NoArgsConstructor  // 👇 Tự động tạo constructor rỗng
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double quantity;

    private String unit;

    @Column(name = "min_threshold")
    private Double minThreshold = 5.0; 
}