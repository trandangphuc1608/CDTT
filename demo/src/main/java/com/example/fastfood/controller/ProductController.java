package com.example.fastfood.controller;

import com.example.fastfood.entity.*;
import com.example.fastfood.repository.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository; // Cần cái này để tìm danh mục

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private ProductIngredientRepository productIngredientRepository;

    // --- DTO: Class phụ để hứng dữ liệu từ React gửi lên ---
    @Data
    public static class ProductRequest {
        private String name;
        private Double price;
        private String description;
        private String imageUrl;
        private Long categoryId; // React gửi categoryId (số)
        private Boolean isAvailable;
    }

    // 1. Lấy danh sách món ăn
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 2. Lấy chi tiết 1 món ăn
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. THÊM MÓN ĂN (Đã sửa để nhận categoryId)
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest request) {
        Product p = new Product();
        p.setName(request.getName());
        p.setPrice(request.getPrice());
        p.setDescription(request.getDescription());
        p.setImageUrl(request.getImageUrl());
        p.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);

        // Xử lý Category
        if (request.getCategoryId() != null) {
            Category c = categoryRepository.findById(request.getCategoryId()).orElse(null);
            p.setCategory(c);
        }

        return ResponseEntity.ok(productRepository.save(p));
    }

    // 4. SỬA MÓN ĂN (Thêm hàm này)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ID: " + id));

        p.setName(request.getName());
        p.setPrice(request.getPrice());
        p.setDescription(request.getDescription());
        p.setImageUrl(request.getImageUrl());
        
        if (request.getIsAvailable() != null) {
            p.setIsAvailable(request.getIsAvailable());
        }

        // Cập nhật Category nếu có thay đổi
        if (request.getCategoryId() != null) {
            Category c = categoryRepository.findById(request.getCategoryId()).orElse(null);
            p.setCategory(c);
        }

        return ResponseEntity.ok(productRepository.save(p));
    }

    // 5. XÓA MÓN ĂN (Thêm hàm này)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok("Đã xóa thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể xóa món này (do đã có đơn hàng hoặc công thức liên quan)");
        }
    }

    // 6. Upload ảnh món ăn
    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get("uploads/");
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        Files.copy(file.getInputStream(), path.resolve(fileName));
        return "/uploads/" + fileName;
    }

    // ==========================================
    // CÁC HÀM XỬ LÝ CÔNG THỨC (GIỮ NGUYÊN)
    // ==========================================
    
    @PostMapping("/{productId}/ingredients")
    @Transactional
    public ResponseEntity<?> addIngredientToProduct(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> payload
    ) {
        try {
            Long ingredientId = Long.valueOf(payload.get("ingredientId").toString());
            Double quantity = Double.valueOf(payload.get("quantity").toString());

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Món ăn không tồn tại"));

            Ingredient ingredient = ingredientRepository.findById(ingredientId)
                    .orElseThrow(() -> new RuntimeException("Nguyên liệu không tồn tại"));

            // Kiểm tra xem đã có nguyên liệu này trong món chưa, nếu có thì update
            ProductIngredient link = productIngredientRepository.findByProduct_Id(productId).stream()
                    .filter(pi -> pi.getIngredient().getId().equals(ingredientId))
                    .findFirst()
                    .orElse(new ProductIngredient());

            link.setProduct(product);
            link.setIngredient(ingredient);
            link.setQuantityNeeded(quantity);

            productIngredientRepository.save(link);

            return ResponseEntity.ok("Đã cập nhật công thức!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    @DeleteMapping("/{productId}/ingredients/{ingredientId}")
    @Transactional
    public ResponseEntity<?> removeIngredientFromProduct(@PathVariable Long productId, @PathVariable Long ingredientId) {
        List<ProductIngredient> list = productIngredientRepository.findByProduct_Id(productId);
        for (ProductIngredient pi : list) {
            if (pi.getIngredient().getId().equals(ingredientId)) {
                productIngredientRepository.delete(pi);
                return ResponseEntity.ok("Đã xóa nguyên liệu khỏi công thức");
            }
        }
        return ResponseEntity.badRequest().body("Không tìm thấy nguyên liệu trong món này");
    }
}