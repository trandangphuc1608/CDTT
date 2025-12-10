package com.example.fastfood.repository;

import com.example.fastfood.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Tìm lịch sử đặt bàn của 1 user (để hiển thị cho khách xem lại)
    List<Reservation> findByUserIdOrderByBookingTimeDesc(Long userId);
}