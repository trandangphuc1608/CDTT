package com.example.fastfood.controller;

import com.example.fastfood.entity.Product;
import com.example.fastfood.entity.ProductIngredient;
import com.example.fastfood.entity.Ingredient;
import com.example.fastfood.repository.ProductRepository;
import com.example.fastfood.repository.ProductIngredientRepository;
import com.example.fastfood.repository.IngredientRepository;

import jakarta.transaction.Transactional; // Import Transactional cho việc lưu công thức

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map; // <--- ĐÂY LÀ THƯ VIỆN BẠN ĐANG THIẾU
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductIngredientRepository productIngredientRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    // Đường dẫn lưu ảnh (Bạn có thể cấu hình trong application.properties)
    private final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow();
        
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setDescription(productDetails.getDescription());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());
        product.setIsAvailable(productDetails.getIsAvailable());

        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    // --- API UPLOAD ẢNH ---
    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        // Tạo thư mục nếu chưa có
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Tạo tên file ngẫu nhiên để tránh trùng
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        
        // Lưu file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Trả về URL (Giả sử bạn đã cấu hình static resource handler)
        // Trong môi trường dev đơn giản, trả về đường dẫn tương đối
        return "http://localhost:8081/uploads/" + fileName; 
    }

    // --- CÁC API VỀ CÔNG THỨC (RECIPE) ---

    // API Lấy công thức của 1 món
    @GetMapping("/{id}/ingredients")
    public List<ProductIngredient> getIngredients(@PathVariable Long id) {
        return productIngredientRepository.findByProductId(id);
    }

    // API Cập nhật công thức cho món ăn
    @PostMapping("/{id}/ingredients")
    @Transactional
    public ResponseEntity<?> updateRecipe(@PathVariable Long id, @RequestBody List<Map<String, Object>> ingredientsData) {
        Product product = productRepository.findById(id).orElseThrow();

        // 1. Xóa công thức cũ
        productIngredientRepository.deleteByProductId(id);

        // 2. Thêm công thức mới
        for (Map<String, Object> item : ingredientsData) {
            // Ép kiểu dữ liệu từ JSON gửi lên
            Long ingredientId = Long.valueOf(item.get("ingredientId").toString());
            Double quantity = Double.valueOf(item.get("quantity").toString());

            Ingredient ingredient = ingredientRepository.findById(ingredientId).orElseThrow();

            ProductIngredient pi = new ProductIngredient();
            pi.setProduct(product);
            pi.setIngredient(ingredient);
            pi.setQuantityNeeded(quantity);
            
            productIngredientRepository.save(pi);
        }
        return ResponseEntity.ok("Cập nhật công thức thành công!");
    }
}