package com.example.fastfood.controller;

import com.example.fastfood.entity.Branch;
import com.example.fastfood.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "*")
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    // Lấy danh sách chi nhánh
    @GetMapping
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    // Thêm chi nhánh mới
    @PostMapping
    public Branch createBranch(@RequestBody Branch branch) {
        return branchRepository.save(branch);
    }

    // Cập nhật chi nhánh
    @PutMapping("/{id}")
    public Branch updateBranch(@PathVariable Long id, @RequestBody Branch branchDetails) {
        Branch branch = branchRepository.findById(id).orElseThrow();
        branch.setName(branchDetails.getName());
        branch.setAddress(branchDetails.getAddress());
        branch.setPhone(branchDetails.getPhone());
        branch.setActive(branchDetails.isActive());
        return branchRepository.save(branch);
    }

    // Xóa chi nhánh
    @DeleteMapping("/{id}")
    public void deleteBranch(@PathVariable Long id) {
        branchRepository.deleteById(id);
    }
}