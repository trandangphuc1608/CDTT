package com.example.fastfood.controller;

import com.example.fastfood.entity.Reservation;
import com.example.fastfood.entity.User;
import com.example.fastfood.repository.ReservationRepository;
import com.example.fastfood.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    // API Khách đặt bàn
    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation, @RequestParam(required = false) Long userId) {
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            reservation.setUser(user);
        }
        return reservationRepository.save(reservation);
    }

    // API Lấy danh sách đặt bàn của user
    @GetMapping("/my-reservations/{userId}")
    public List<Reservation> getMyReservations(@PathVariable Long userId) {
        return reservationRepository.findByUserIdOrderByBookingTimeDesc(userId);
    }
    
    // API Lấy tất cả (Dành cho Admin sau này)
    @GetMapping
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public Reservation updateStatus(@PathVariable Long id, @RequestParam String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt bàn!"));
        
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }
}