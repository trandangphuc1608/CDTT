package com.example.fastfood;

import com.example.fastfood.entity.*;
import com.example.fastfood.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private IngredientRepository ingredientRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TableRepository tableRepository; // Khai báo Repository ở đây (cấp class)

    @Override
    public void run(String... args) throws Exception {
        // --- 1. TẠO USER NẾU CHƯA CÓ ---
        if (userRepository.count() == 0) {
            System.out.println("--- Đang tạo User mẫu... ---");
            createUser("admin", "123", "Quản Trị Viên", "ADMIN");
            createUser("tn1", "123", "Thu Ngân A", "CASHIER");
            createUser("bep1", "123", "Đầu Bếp Trưởng", "KITCHEN");
            createUser("kh1", "123", "Khách hàng VIP", "CUSTOMER");
            System.out.println("--- Tạo User xong! ---");
        }

        // --- 2. TẠO MENU ---
        if (categoryRepository.count() == 0) {
            Category mainMenu = new Category();
            mainMenu.setName("Menu Chính");
            mainMenu.setDescription("Các món ngon nhất");
            mainMenu.setIsActive(true);
            Category savedCategory = categoryRepository.save(mainMenu);

            addProduct("Burger Bò Mỹ", "Bò nướng lửa hồng", 55000, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", savedCategory);
            addProduct("Gà Rán", "Da giòn", 35000, "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec", savedCategory);
        }

        // --- 3. TẠO KHO ---
        if (ingredientRepository.count() == 0) {
             ingredientRepository.save(new Ingredient("Thịt Bò", "kg", 50.0, 10.0));
             ingredientRepository.save(new Ingredient("Vỏ Bánh", "cái", 100.0, 20.0));
        }

        // --- 4. TẠO BÀN ĂN (Logic này phải nằm TRONG hàm run) ---
        if (tableRepository.count() == 0) {
            System.out.println("--- Đang tạo dữ liệu Bàn ăn... ---");
            for (int i = 1; i <= 10; i++) {
                tableRepository.save(new DiningTable("Bàn " + i, 4, "AVAILABLE"));
            }
        }
    }

    // --- CÁC HÀM PHỤ TRỢ (HELPER METHODS) ---
    
    private void createUser(String username, String password, String fullName, String role) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(password);
        u.setFullName(fullName);
        u.setRole(role);
        userRepository.save(u);
    }

    private void addProduct(String name, String desc, double price, String img, Category category) {
        Product p = new Product();
        p.setName(name); 
        p.setDescription(desc); 
        p.setPrice(BigDecimal.valueOf(price));
        p.setImageUrl(img); 
        p.setIsAvailable(true); 
        p.setCategory(category);
        productRepository.save(p);
    }
}