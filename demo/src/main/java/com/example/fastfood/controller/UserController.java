package com.example.fastfood.controller;

import com.example.fastfood.entity.User;
import com.example.fastfood.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Lấy danh sách tất cả user
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. Tạo user mới (Nhân viên/Khách hàng)
    @PostMapping
    public User createUser(@RequestBody User user) {
        // Lưu ý: Trong thực tế nên mã hóa password tại đây
        return userRepository.save(user);
    }

    // 3. Cập nhật thông tin user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow();
        user.setFullName(userDetails.getFullName());
        user.setUsername(userDetails.getUsername());
        user.setRole(userDetails.getRole());
        
        // Nếu có gửi password mới thì cập nhật, không thì giữ nguyên
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        
        return userRepository.save(user);
    }

    // 4. Xóa user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}