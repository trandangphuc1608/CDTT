package com.example.fastfood.controller;

import com.example.fastfood.entity.*;
import com.example.fastfood.repository.IngredientRepository;
import com.example.fastfood.repository.OrderRepository;
import com.example.fastfood.repository.ProductRepository;
import com.example.fastfood.repository.UserRepository;
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
    private UserRepository userRepository;

    // 1. API Lấy tất cả đơn hàng (Dành cho Thu ngân & Bếp)
    // Sửa lại: Sắp xếp theo ID giảm dần để đơn mới nhất lên đầu (An toàn hơn createdAt)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // 2. API Tạo đơn hàng mới
    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        Order order = new Order();
        
        // Lưu User nếu có (Khách hàng đã đăng nhập)
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            order.setUser(user);
        }

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn!"));
            
            // LOGIC TRỪ KHO (Giữ nguyên)
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
            
            // Tính tổng tiền
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }

        order.setItems(items);
        order.setTotalAmount(total); // <--- TÊN TRƯỜNG LÀ totalAmount
        order.setStatus("PENDING");  // <--- Mặc định trạng thái là Chờ xác nhận
        
        // Nếu Entity có trường createdAt, hãy set ở đây (hoặc dùng @PrePersist trong Entity)
        // order.setCreatedAt(new Date()); 

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // 3. API Lấy đơn hàng đang chờ (Dành cho Bếp)
    @GetMapping("/pending")
    public List<Order> getPendingOrders() {
        return orderRepository.findAll().stream()
                .filter(o -> !o.getStatus().equals("COMPLETED") && !o.getStatus().equals("PAID") && !o.getStatus().equals("CANCELLED"))
                .toList();
    }
    
    // 4. API Cập nhật trạng thái đơn (Thu ngân bấm "Thu tiền", Bếp bấm "Xong")
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // 5. API Thống kê
    @GetMapping("/stats")
    public StatsResponse getStats() {
        BigDecimal revenue = orderRepository.sumTotalRevenue();
        return new StatsResponse(
            revenue != null ? revenue : BigDecimal.ZERO, 
            orderRepository.countCompletedOrders(), 
            orderRepository.countPendingOrders()
        );
    }

    // 6. API Biểu đồ doanh thu
    @GetMapping("/revenue-chart")
    public List<Map<String, Object>> getRevenueChart() {
        List<Object[]> data = orderRepository.getRevenueLast7Days();
        List<Map<String, Object>> result = new ArrayList<>();
        if (data != null) {
            for (Object[] row : data) {
                Map<String, Object> map = new HashMap<>();
                map.put("date", row[0]);
                map.put("revenue", row[1]);
                result.add(map);
            }
        }
        return result;
    }

    // 7. API Lịch sử đơn hàng của tôi (Dành cho Khách hàng)
    @GetMapping("/my-orders/{userId}")
    public List<Order> getMyOrders(@PathVariable Long userId) {
        // Lưu ý: Đảm bảo OrderRepository có method này
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // --- DTO CLASSES ---
    @Data
    public static class OrderRequest {
        private Long userId; 
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