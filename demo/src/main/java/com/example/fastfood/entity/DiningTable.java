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
    private String name;    // Ví dụ: Bàn 1
    private Integer capacity; // Số ghế: 4
    private String status;  // AVAILABLE, OCCUPIED
}