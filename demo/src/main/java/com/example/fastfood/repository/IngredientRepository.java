package com.example.fastfood.repository;

import com.example.fastfood.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    // Có thể thêm hàm tìm theo tên nếu cần
    boolean existsByName(String name);
}