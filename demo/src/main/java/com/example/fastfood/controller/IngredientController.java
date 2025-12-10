package com.example.fastfood.controller;

import com.example.fastfood.entity.Ingredient;
import com.example.fastfood.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class IngredientController {

    @Autowired
    private IngredientRepository ingredientRepository;

    @GetMapping
    public List<Ingredient> getAll() {
        return ingredientRepository.findAll();
    }

    @PostMapping
    public Ingredient create(@RequestBody Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    @PutMapping("/{id}")
    public Ingredient update(@PathVariable Long id, @RequestBody Ingredient details) {
        Ingredient ingredient = ingredientRepository.findById(id).orElseThrow();
        ingredient.setName(details.getName());
        ingredient.setUnit(details.getUnit());
        ingredient.setQuantity(details.getQuantity());
        ingredient.setMinLimit(details.getMinLimit());
        return ingredientRepository.save(ingredient);
    }
    
    // API Nhập kho nhanh (Cộng thêm số lượng)
    @PutMapping("/{id}/import")
    public Ingredient importStock(@PathVariable Long id, @RequestParam Double amount) {
        Ingredient ingredient = ingredientRepository.findById(id).orElseThrow();
        ingredient.setQuantity(ingredient.getQuantity() + amount);
        return ingredientRepository.save(ingredient);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ingredientRepository.deleteById(id);
    }
}