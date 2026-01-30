package com.example.fastfood.repository;

import com.example.fastfood.entity.ProductIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductIngredientRepository extends JpaRepository<ProductIngredient, Long> {
    
    // 👇 PHẢI VIẾT Y HỆT NHƯ THẾ NÀY (Có dấu gạch dưới _Id)
    List<ProductIngredient> findByProduct_Id(Long productId);
}