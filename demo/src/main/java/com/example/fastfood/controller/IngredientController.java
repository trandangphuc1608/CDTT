package com.example.fastfood.controller;

import com.example.fastfood.entity.Ingredient;
import com.example.fastfood.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ingredients")
@CrossOrigin(origins = "*")
public class IngredientController {

    @Autowired
    private IngredientRepository ingredientRepository;

    // 1. Lấy danh sách nguyên liệu
    @GetMapping
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    // 2. Thêm mới nguyên liệu
    @PostMapping
    public ResponseEntity<?> createIngredient(@RequestBody Ingredient ingredient) {
        if (ingredientRepository.existsByName(ingredient.getName())) {
            return ResponseEntity.badRequest().body("Tên nguyên liệu đã tồn tại!");
        }
        // Mặc định cảnh báo nếu còn dưới 5 đơn vị
        if (ingredient.getMinThreshold() == null) ingredient.setMinThreshold(5.0);
        if (ingredient.getQuantity() == null) ingredient.setQuantity(0.0);
        
        return ResponseEntity.ok(ingredientRepository.save(ingredient));
    }

    // 3. Cập nhật thông tin (Tên, Đơn vị, Mức cảnh báo)
    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> updateIngredient(@PathVariable Long id, @RequestBody Ingredient details) {
        return ingredientRepository.findById(id).map(ingredient -> {
            ingredient.setName(details.getName());
            ingredient.setUnit(details.getUnit());
            ingredient.setMinThreshold(details.getMinThreshold());
            // Lưu ý: Không cho sửa số lượng tồn kho ở đây (phải dùng API nhập kho riêng)
            
            return ResponseEntity.ok(ingredientRepository.save(ingredient));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Xóa nguyên liệu (QUAN TRỌNG: ĐÃ SỬA LỖI 500)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIngredient(@PathVariable Long id) {
        if (!ingredientRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            ingredientRepository.deleteById(id);
            return ResponseEntity.ok("Đã xóa thành công");
        } catch (Exception e) {
            // Bắt lỗi ràng buộc khóa ngoại (Foreign Key) nếu nguyên liệu đang dùng trong món ăn
            return ResponseEntity.badRequest().body("Không thể xóa: Nguyên liệu này đang được dùng trong công thức món ăn!");
        }
    }

    // 5. Nhập thêm hàng vào kho (Cộng dồn số lượng)
    @PostMapping("/{id}/import")
    public ResponseEntity<?> importStock(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        Double amount = payload.get("amount");
        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest().body("Số lượng nhập phải lớn hơn 0");
        }

        return ingredientRepository.findById(id).map(ingredient -> {
            ingredient.setQuantity(ingredient.getQuantity() + amount);
            ingredientRepository.save(ingredient);
            return ResponseEntity.ok("Đã nhập thêm " + amount + " " + ingredient.getUnit());
        }).orElse(ResponseEntity.notFound().build());
    }
}