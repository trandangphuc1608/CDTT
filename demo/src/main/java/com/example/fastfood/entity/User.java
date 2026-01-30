package com.example.fastfood.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // Import thư viện này để tránh lỗi lặp JSON
import jakarta.persistence.*;
import java.util.List;

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

    private String email;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String avatar;

    // 👇👇👇 THÊM MỚI: Mối quan hệ với bảng Order 👇👇👇
    // mappedBy = "user": Tên biến "user" bên file Order.java
    @OneToMany(mappedBy = "user") 
    @JsonIgnore // Quan trọng: Ngắt vòng lặp JSON khi lấy thông tin User
    private List<Order> orders;

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

    // --- GETTERS AND SETTERS ---

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

    // Getter & Setter cho danh sách Orders
    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}