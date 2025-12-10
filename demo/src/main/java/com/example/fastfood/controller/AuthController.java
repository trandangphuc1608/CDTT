package com.example.fastfood.controller;

import com.example.fastfood.entity.User;
import com.example.fastfood.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // --- 1. API ĐĂNG KÝ (THÊM MỚI) ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Kiểm tra trùng username
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại!");
        }

        // Mặc định role là CUSTOMER nếu không gửi lên
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        // Lưu user mới vào database
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // --- 2. API ĐĂNG NHẬP (GIỮ NGUYÊN CODE CỦA BẠN ĐÃ CHẠY ĐƯỢC) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");
        
        System.out.println("Đang thử đăng nhập: " + username + " / " + password);
        
        User user = userRepository.findByUsername(username).orElse(null);

        // Kiểm tra user có tồn tại và mật khẩu có đúng không
        if (user != null && user.getPassword().equals(password)) {
            // Trả về thông tin user (trừ password)
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("fullName", user.getFullName());
            response.put("role", user.getRole());
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Sai tên đăng nhập hoặc mật khẩu!");
        }
    }
}