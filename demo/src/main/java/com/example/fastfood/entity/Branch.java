package com.example.fastfood.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "branches")
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;      // Tên chi nhánh (VD: Chi nhánh Quận 1)
    private String address;   // Địa chỉ
    private String phone;     // Số điện thoại
    private boolean active = true; // Trạng thái hoạt động

    public Branch() {}

    public Branch(String name, String address, String phone, boolean active) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.active = active;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}