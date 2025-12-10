package com.example.fastfood.controller;

import com.example.fastfood.entity.DiningTable;
import com.example.fastfood.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class TableController {

    @Autowired
    private TableRepository tableRepository;

    @GetMapping
    public List<DiningTable> getAll() {
        return tableRepository.findAll();
    }

    @PostMapping
    public DiningTable create(@RequestBody DiningTable table) {
        return tableRepository.save(table);
    }

    @PutMapping("/{id}/status")
    public DiningTable updateStatus(@PathVariable Long id, @RequestParam String status) {
        DiningTable table = tableRepository.findById(id).orElseThrow();
        table.setStatus(status);
        return tableRepository.save(table);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        tableRepository.deleteById(id);
    }
}