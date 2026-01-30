package com.example.fastfood.controller;

import com.example.fastfood.entity.Reservation;
import com.example.fastfood.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Cho phép React gọi API
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    // 1. Lấy danh sách đặt bàn (Sắp xếp mới nhất lên đầu)
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "reservationTime"));
    }

    // 2. Tạo đơn đặt bàn mới (Khách hàng gửi lên)
    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        // Mặc định trạng thái là PENDING (Chờ xác nhận)
        reservation.setStatus("PENDING");
        return reservationRepository.save(reservation);
    }

    // 3. Cập nhật trạng thái (Admin xác nhận hoặc hủy)
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateStatus(@PathVariable Long id, @RequestBody Reservation details) {
        return reservationRepository.findById(id).map(reservation -> {
            // Chỉ cho phép sửa trạng thái và ghi chú
            if (details.getStatus() != null) reservation.setStatus(details.getStatus());
            if (details.getNote() != null) reservation.setNote(details.getNote());
            
            return ResponseEntity.ok(reservationRepository.save(reservation));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Xóa đơn đặt bàn
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}