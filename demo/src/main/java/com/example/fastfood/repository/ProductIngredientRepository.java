package com.example.fastfood.repository;

import com.example.fastfood.entity.ProductIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductIngredientRepository extends JpaRepository<ProductIngredient, Long> {
    List<ProductIngredient> findByProductId(Long productId);
    void deleteByProductId(Long productId); // Dùng để reset công thức cũ khi cập nhật
}