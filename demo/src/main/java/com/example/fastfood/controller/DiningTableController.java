package com.example.fastfood.controller;

import com.example.fastfood.entity.DiningTable;
import com.example.fastfood.repository.DiningTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Cho phép React gọi API
@RestController
@RequestMapping("/api/tables")
public class DiningTableController {

    @Autowired
    private DiningTableRepository diningTableRepository;

    // 1. Lấy danh sách bàn
    @GetMapping
    public List<DiningTable> getAllTables() {
        // Sắp xếp theo ID hoặc Tên nếu muốn
        return diningTableRepository.findAll();
    }

    // 2. Thêm bàn mới
    @PostMapping
    public DiningTable createTable(@RequestBody DiningTable table) {
        return diningTableRepository.save(table);
    }

    // 3. Cập nhật thông tin bàn (Tên, Trạng thái)
    @PutMapping("/{id}")
    public ResponseEntity<DiningTable> updateTable(@PathVariable Long id, @RequestBody DiningTable tableDetails) {
        return diningTableRepository.findById(id).map(table -> {
            table.setName(tableDetails.getName());
            table.setCapacity(tableDetails.getCapacity());
            table.setStatus(tableDetails.getStatus());
            return ResponseEntity.ok(diningTableRepository.save(table));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Xóa bàn
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        diningTableRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // 5. API Đổi trạng thái nhanh (VD: Khi khách vào ngồi hoặc thanh toán xong)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return diningTableRepository.findById(id).map(table -> {
            table.setStatus(status);
            diningTableRepository.save(table);
            return ResponseEntity.ok("Cập nhật trạng thái thành công: " + status);
        }).orElse(ResponseEntity.notFound().build());
    }
}