package com.example.fastfood.repository;

import com.example.fastfood.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Tự động có các hàm: findAll, findById, save, delete...
    
    // Viết thêm hàm tìm món theo danh mục nếu cần:
    List<Product> findByCategoryId(Long categoryId);
}