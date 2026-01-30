package com.example.fastfood.controller;

import com.example.fastfood.entity.Favorite;
import com.example.fastfood.entity.Product;
import com.example.fastfood.entity.User;
import com.example.fastfood.repository.FavoriteRepository;
import com.example.fastfood.repository.ProductRepository;
import com.example.fastfood.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteRepository favoriteRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    // 1. Lấy danh sách yêu thích của User
    @GetMapping("/{userId}")
    public List<Product> getFavorites(@PathVariable Long userId) {
        return favoriteRepo.findProductsByUserId(userId);
    }

    // 2. Kiểm tra xem món này đã thích chưa
    @GetMapping("/check/{userId}/{productId}")
    public boolean checkFavorite(@PathVariable Long userId, @PathVariable Long productId) {
        return favoriteRepo.existsByUserIdAndProductId(userId, productId);
    }

    // 3. Thích / Bỏ thích (Toggle)
    @PostMapping("/toggle/{userId}/{productId}")
    public String toggleFavorite(@PathVariable Long userId, @PathVariable Long productId) {
        if (favoriteRepo.existsByUserIdAndProductId(userId, productId)) {
            // Nếu đã thích rồi -> Xóa đi
            favoriteRepo.deleteByUserIdAndProductId(userId, productId);
            return "REMOVED";
        } else {
            // Nếu chưa thích -> Thêm vào
            Favorite fav = new Favorite();
            
            // Tìm User và Product từ DB (Giả sử ID luôn đúng để code ngắn gọn)
            User user = userRepo.findById(userId).orElse(null);
            Product product = productRepo.findById(productId).orElse(null);

            if (user != null && product != null) {
                fav.setUser(user);
                fav.setProduct(product);
                favoriteRepo.save(fav);
                return "ADDED";
            } else {
                return "ERROR: User or Product not found";
            }
        }
    }
}