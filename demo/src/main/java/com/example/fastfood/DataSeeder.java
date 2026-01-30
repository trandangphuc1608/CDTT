package com.example.fastfood;

import com.example.fastfood.entity.*;
import com.example.fastfood.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

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
    private DiningTableRepository tableRepository; 

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

            // Sửa lỗi BigDecimal ở đây (Dùng Double chuẩn)
            addProduct("Burger Bò Mỹ", "Bò nướng lửa hồng", 55000.0, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", savedCategory);
            addProduct("Gà Rán", "Da giòn", 35000.0, "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec", savedCategory);
            addProduct("Cơm Gà Giòn", "Cơm dẻo gà thơm", 45000.0, "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d", savedCategory);
        }

        // --- 3. TẠO KHO ---
        if (ingredientRepository.count() == 0) {
            System.out.println("--- Đang tạo Nguyên liệu... ---");
            createIngredient("Thịt Bò", "kg", 50.0, 5.0);
            createIngredient("Vỏ Bánh", "cái", 100.0, 10.0);
            createIngredient("Phô Mai", "lát", 50.0, 5.0);
            createIngredient("Tôm", "kg", 20.0, 2.0);
            createIngredient("Gà", "kg", 50.0, 5.0);
            createIngredient("Gạo", "kg", 100.0, 10.0);
            createIngredient("Khoai Tây", "kg", 50.0, 5.0);
        }

        // --- 4. TẠO BÀN ĂN ---
        if (tableRepository.count() == 0) {
            System.out.println("--- Đang tạo Bàn ăn... ---");
            for (int i = 1; i <= 10; i++) {
                DiningTable t = new DiningTable();
                t.setName("Bàn " + i);
                t.setCapacity(4);
                t.setStatus("AVAILABLE");
                tableRepository.save(t);
            }
        }
    }

    // --- CÁC HÀM PHỤ TRỢ (Dùng Setter để tránh lỗi Constructor) ---
    
    private void createUser(String username, String password, String fullName, String role) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(password); // Lưu ý: Nếu dùng Spring Security thật thì phải mã hóa
        u.setFullName(fullName);
        u.setRole(role);
        userRepository.save(u);
    }

    private void addProduct(String name, String desc, Double price, String img, Category category) {
        Product p = new Product();
        p.setName(name); 
        p.setDescription(desc); 
        p.setPrice(price); // Đã sửa thành Double
        p.setImageUrl(img); 
        p.setIsAvailable(true); 
        p.setCategory(category);
        productRepository.save(p);
    }

    private void createIngredient(String name, String unit, Double quantity, Double minThreshold) {
        Ingredient i = new Ingredient();
        i.setName(name);
        i.setUnit(unit);
        i.setQuantity(quantity);
        i.setMinThreshold(minThreshold);
        ingredientRepository.save(i);
    }
}