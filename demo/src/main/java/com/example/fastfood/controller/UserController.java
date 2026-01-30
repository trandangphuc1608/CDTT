package com.example.fastfood.controller;

import com.example.fastfood.entity.User;
import com.example.fastfood.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Lấy danh sách
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. Tạo mới
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // 3. Cập nhật thông tin (ĐÃ SỬA: Thêm cập nhật Avatar)
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        // Tìm user cũ trong DB
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        
        // Cập nhật các thông tin cơ bản
        user.setFullName(userDetails.getFullName());
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        
        // --- QUAN TRỌNG: Kiểm tra và lưu Avatar ---
        // Nếu Frontend gửi lên chuỗi avatar (link ảnh), hãy lưu nó vào
        if (userDetails.getAvatar() != null && !userDetails.getAvatar().isEmpty()) {
            user.setAvatar(userDetails.getAvatar());
        }
        
        // Cập nhật mật khẩu nếu có
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        
        // Lưu xuống DB
        return userRepository.save(user);
    }

    // 4. Xóa
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    // 5. Upload Avatar
    @PostMapping("/upload-avatar")
    public String uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            // Tạo thư mục uploads nếu chưa có
            Path uploadPath = Paths.get("uploads/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file ngẫu nhiên
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            
            // Lưu file
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            
            // Trả về đường dẫn HTTP
            return "/images/" + fileName; 
        } catch (IOException e) {
            e.printStackTrace();
            return "Lỗi upload: " + e.getMessage();
        }
    }
}