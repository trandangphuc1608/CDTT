package com.example.fastfood.repository;

import com.example.fastfood.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Có thể thêm hàm tìm theo số điện thoại nếu cần
}