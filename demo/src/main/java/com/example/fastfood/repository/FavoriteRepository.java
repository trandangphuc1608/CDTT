package com.example.fastfood.repository;

import com.example.fastfood.entity.Favorite;
import com.example.fastfood.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional; // Dùng để xóa dữ liệu

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // Lấy danh sách sản phẩm mà user đã thích
    @Query("SELECT f.product FROM Favorite f WHERE f.user.id = :userId")
    List<Product> findProductsByUserId(Long userId);

    // Kiểm tra xem đã thích chưa
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    // Xóa khỏi danh sách yêu thích (Cần @Transactional và @Modifying để xóa)
    @Modifying
    @Transactional
    void deleteByUserIdAndProductId(Long userId, Long productId);
}