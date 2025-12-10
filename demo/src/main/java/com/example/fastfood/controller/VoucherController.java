package com.example.fastfood.controller;

import com.example.fastfood.entity.Voucher;
import com.example.fastfood.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "*")
public class VoucherController {

    @Autowired
    private VoucherRepository voucherRepository;

    @GetMapping
    public List<Voucher> getAll() {
        return voucherRepository.findAll();
    }

    @PostMapping
    public Voucher create(@RequestBody Voucher voucher) {
        return voucherRepository.save(voucher);
    }

    @PutMapping("/{id}")
    public Voucher update(@PathVariable Long id, @RequestBody Voucher voucherDetails) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow();
        
        voucher.setCode(voucherDetails.getCode());
        voucher.setDiscountPercent(voucherDetails.getDiscountPercent());
        voucher.setExpiryDate(voucherDetails.getExpiryDate());
        voucher.setIsActive(voucherDetails.getIsActive());
        
        return voucherRepository.save(voucher);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        voucherRepository.deleteById(id);
    }

    // API Kiểm tra mã giảm giá (Dùng cho POS)
    @GetMapping("/check/{code}")
    public ResponseEntity<?> checkVoucher(@PathVariable String code) {
        Voucher voucher = voucherRepository.findByCode(code).orElse(null);
        
        if (voucher == null || !voucher.getIsActive()) {
            return ResponseEntity.badRequest().body("Mã không tồn tại hoặc đã bị khóa!");
        }
        
        if (voucher.getExpiryDate() != null && voucher.getExpiryDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Mã đã hết hạn!");
        }

        return ResponseEntity.ok(voucher);
    }
}