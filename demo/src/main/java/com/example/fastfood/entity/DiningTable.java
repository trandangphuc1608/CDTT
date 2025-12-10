package com.example.fastfood.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dining_tables")
@Data
public class DiningTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // VD: Bàn 1, Bàn 2

    private Integer capacity; // Số ghế (VD: 4, 6)

    // AVAILABLE (Trống), BOOKED (Đã đặt), OCCUPIED (Đang dùng)
    private String status = "AVAILABLE"; 
    
    public DiningTable() {}
    
    public DiningTable(String name, Integer capacity, String status) {
        this.name = name;
        this.capacity = capacity;
        this.status = status;
    }
}