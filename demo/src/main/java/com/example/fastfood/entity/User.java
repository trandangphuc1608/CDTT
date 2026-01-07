package com.example.fastfood.entity;

import jakarta.persistence.*; // Spring Boot 3 dùng jakarta.persistence
// Nếu bạn dùng Spring Boot 2 thì đổi thành javax.persistence

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String fullName;
    private String role; // ADMIN, CASHIER, KITCHEN, CUSTOMER

    // --- CÁC TRƯỜNG MỚI THÊM ---
    private String email;

    @Lob // Báo hiệu đây là dữ liệu lớn
    @Column(columnDefinition = "TEXT") // Hoặc LONGTEXT để lưu chuỗi Base64 dài hoặc URL dài
    private String avatar;

    // --- CONSTRUCTOR ---
    public User() {
    }

    public User(String username, String password, String fullName, String role, String email, String avatar) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.email = email;
        this.avatar = avatar;
    }

    // --- GETTERS AND SETTERS (BẮT BUỘC PHẢI CÓ) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // --- GETTER/SETTER CHO EMAIL & AVATAR ---
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}