package com.example.fastfood.controller;

import com.example.fastfood.entity.*;
import com.example.fastfood.repository.IngredientRepository;
import com.example.fastfood.repository.OrderRepository;
import com.example.fastfood.repository.ProductRepository;
import com.example.fastfood.repository.UserRepository; // <--- Import UserRepo
import jakarta.transaction.Transactional;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private IngredientRepository ingredientRepository;
    
    @Autowired
    private UserRepository userRepository; // <--- Inject UserRepository

    // API Tạo đơn hàng mới
    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        Order order = new Order();
        
        // --- LOGIC MỚI: LƯU USER NẾU CÓ ---
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            order.setUser(user);
        }
        // ----------------------------------

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn!"));
            
            // LOGIC TRỪ KHO
            if (product.getIngredients() != null && !product.getIngredients().isEmpty()) {
                for (ProductIngredient pi : product.getIngredients()) {
                    Ingredient warehouseItem = pi.getIngredient();
                    double totalNeeded = pi.getQuantityNeeded() * itemRequest.getQuantity();
                    
                    if (warehouseItem.getQuantity() < totalNeeded) {
                        return ResponseEntity.badRequest().body("Xin lỗi, hết nguyên liệu: " + warehouseItem.getName());
                    }
                    
                    warehouseItem.setQuantity(warehouseItem.getQuantity() - totalNeeded);
                    ingredientRepository.save(warehouseItem);
                }
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setOrder(order);
            
            items.add(orderItem);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }

        order.setItems(items);
        order.setTotalAmount(total);
        
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // ... (Giữ nguyên các API getPending, updateStatus, stats, chart, all...)
    @GetMapping("/pending")
    public List<Order> getPendingOrders() {
        return orderRepository.findAll().stream().filter(o -> !o.getStatus().equals("COMPLETED")).toList();
    }
    
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @GetMapping("/stats")
    public StatsResponse getStats() {
        BigDecimal revenue = orderRepository.sumTotalRevenue();
        return new StatsResponse(revenue != null ? revenue : BigDecimal.ZERO, orderRepository.countCompletedOrders(), orderRepository.countPendingOrders());
    }

    @GetMapping("/revenue-chart")
    public List<Map<String, Object>> getRevenueChart() {
        List<Object[]> data = orderRepository.getRevenueLast7Days();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : data) {
            Map<String, Object> map = new HashMap<>();
            map.put("date", row[0]);
            map.put("revenue", row[1]);
            result.add(map);
        }
        return result;
    }

    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // API Lịch sử đơn hàng của tôi
    @GetMapping("/my-orders/{userId}")
    public List<Order> getMyOrders(@PathVariable Long userId) {
        // Bây giờ Order đã có User, lệnh này sẽ chạy đúng
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // --- DTO CLASSES ---
    @Data
    public static class OrderRequest {
        private Long userId; // <--- THÊM TRƯỜNG NÀY ĐỂ NHẬN ID TỪ FRONTEND
        private List<CartItem> items;
    }

    @Data
    public static class CartItem {
        private Long productId;
        private Integer quantity;
    }

    @Data
    static class StatsResponse {
        private BigDecimal totalRevenue;
        private Long completedOrders;
        private Long pendingOrders;
        public StatsResponse(BigDecimal totalRevenue, Long completedOrders, Long pendingOrders) {
            this.totalRevenue = totalRevenue;
            this.completedOrders = completedOrders;
            this.pendingOrders = pendingOrders;
        }
    }
}