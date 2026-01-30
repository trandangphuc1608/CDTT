package com.example.fastfood.controller;

import com.example.fastfood.entity.Branch;
import com.example.fastfood.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Cho phép React gọi API
@RestController
@RequestMapping("/api/branches")
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    // 1. Lấy danh sách chi nhánh
    @GetMapping
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    // 2. Thêm chi nhánh mới
    @PostMapping
    public Branch createBranch(@RequestBody Branch branch) {
        if (branch.getIsActive() == null) branch.setIsActive(true);
        return branchRepository.save(branch);
    }

    // 3. Cập nhật chi nhánh
    @PutMapping("/{id}")
    public ResponseEntity<Branch> updateBranch(@PathVariable Long id, @RequestBody Branch branchDetails) {
        return branchRepository.findById(id).map(branch -> {
            branch.setName(branchDetails.getName());
            branch.setAddress(branchDetails.getAddress());
            branch.setCity(branchDetails.getCity());
            branch.setPhoneNumber(branchDetails.getPhoneNumber());
            branch.setOpeningHours(branchDetails.getOpeningHours());
            branch.setIsActive(branchDetails.getIsActive());
            return ResponseEntity.ok(branchRepository.save(branch));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Xóa chi nhánh
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBranch(@PathVariable Long id) {
        branchRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}