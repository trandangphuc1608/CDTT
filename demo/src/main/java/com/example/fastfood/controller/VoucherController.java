package com.example.fastfood.controller;

import com.example.fastfood.entity.Voucher;
import com.example.fastfood.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*") // Cho phép React truy cập
@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {

    @Autowired
    private VoucherRepository voucherRepository;

    // 1. Lấy tất cả voucher
    @GetMapping
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    // 2. Tạo voucher mới
    @PostMapping
    public Voucher createVoucher(@RequestBody Voucher voucher) {
        // Mặc định là đang hoạt động nếu không gửi lên
        if (voucher.getIsActive() == null) voucher.setIsActive(true);
        return voucherRepository.save(voucher);
    }

    // 3. Cập nhật voucher
    @PutMapping("/{id}")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable Long id, @RequestBody Voucher voucherDetails) {
        return voucherRepository.findById(id).map(voucher -> {
            voucher.setCode(voucherDetails.getCode());
            voucher.setDiscountPercent(voucherDetails.getDiscountPercent());
            voucher.setExpirationDate(voucherDetails.getExpirationDate());
            voucher.setQuantity(voucherDetails.getQuantity());
            voucher.setIsActive(voucherDetails.getIsActive());
            return ResponseEntity.ok(voucherRepository.save(voucher));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Xóa voucher
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Long id) {
        voucherRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // 5. Kiểm tra mã giảm giá (Dành cho lúc thanh toán)
    @PostMapping("/check")
    public ResponseEntity<?> checkVoucher(@RequestBody Voucher request) {
        // Tìm voucher theo code
        return voucherRepository.findByCode(request.getCode()).map(voucher -> {
            // Kiểm tra ngày hết hạn
            if (voucher.getExpirationDate() != null && voucher.getExpirationDate().isBefore(LocalDate.now())) {
                return ResponseEntity.badRequest().body("Mã giảm giá đã hết hạn!");
            }
            // Kiểm tra số lượng
            if (voucher.getQuantity() != null && voucher.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body("Mã giảm giá đã hết lượt sử dụng!");
            }
            // Kiểm tra trạng thái
            if (!voucher.getIsActive()) {
                return ResponseEntity.badRequest().body("Mã giảm giá đang bị khóa!");
            }
            
            return ResponseEntity.ok(voucher);
        }).orElse(ResponseEntity.badRequest().body("Mã giảm giá không tồn tại!"));
    }
}