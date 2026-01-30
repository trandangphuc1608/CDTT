package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Tên khách hàng

    private String email; // Email liên hệ

    @Column(columnDefinition = "TEXT")
    private String message; // Nội dung tin nhắn

    private LocalDateTime createdAt; // Ngày gửi

    private String status; // Trạng thái: NEW (Mới), READ (Đã đọc), REPLIED (Đã trả lời)

    // Constructor cho DataSeeder (nếu cần)
    public Contact(String name, String email, String message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "NEW";
    }
}