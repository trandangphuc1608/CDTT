package com.example.fastfood.controller;

import com.example.fastfood.entity.*;
import com.example.fastfood.repository.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductIngredientRepository productIngredientRepository; 

    @Autowired
    private IngredientRepository ingredientRepository; 

    // --- DTO CLASSES ---
    @Data
    public static class OrderRequest {
        private Long userId;
        private String customerName;
        private String phone;
        private String address;
        private List<CartItem> items;
        // 👇 [QUAN TRỌNG] Thêm trường này để nhận diện VNPAY/CASH
        private String paymentMethod; 
    }

    @Data
    public static class CartItem {
        private Long productId;
        private int quantity;
    }

    // 1. Lấy tất cả đơn hàng
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // 2. Tạo đơn hàng mới (Đã sửa logic nhận diện VNPAY)
    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        try {
            System.out.println("--- BẮT ĐẦU TẠO ĐƠN ---");
            System.out.println("Khách: " + request.getCustomerName());

            Order order = new Order();

            // 1. XỬ LÝ USER
            if (request.getUserId() != null) {
                User user = userRepository.findById(request.getUserId()).orElse(null);
                if (user != null) {
                    order.setUser(user); 
                } else {
                    order.setUser(null); 
                }
            }
            
            // 2. GÁN THÔNG TIN KHÁC
            order.setCustomerName(request.getCustomerName() != null ? request.getCustomerName() : "Khách vãng lai");
            order.setPhone(request.getPhone() != null ? request.getPhone() : "");
            order.setAddress(request.getAddress() != null ? request.getAddress() : "");
            order.setCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
            
            // 👇 [SỬA ĐOẠN NÀY] Xử lý Payment Method & Status
            String method = request.getPaymentMethod();
            
            // Nếu method null thì mặc định là CASH
            String finalMethod = (method != null && !method.isEmpty()) ? method : "CASH";
            order.setPaymentMethod(finalMethod);

            if ("VNPAY".equals(finalMethod)) {
                // Nếu là VNPAY (API này được gọi từ trang PaymentReturn sau khi thanh toán xong)
                // -> Set trạng thái PROCESSING (Đang xử lý) luôn
                order.setStatus("PROCESSING");
            } else {
                // Nếu là Tiền mặt -> PENDING (Chờ xác nhận)
                order.setStatus("PENDING");
            }

            order.setTotalPrice(0.0);

            Order savedOrder = orderRepository.save(order);

            // 3. XỬ LÝ MÓN ĂN
            BigDecimal totalAmount = BigDecimal.ZERO;

            if (request.getItems() != null) {
                for (CartItem itemReq : request.getItems()) {
                    Product product = productRepository.findById(itemReq.getProductId()).orElse(null);
                    
                    if (product == null) continue; 

                    OrderDetail detail = new OrderDetail();
                    detail.setOrder(savedOrder);
                    detail.setProduct(product);
                    detail.setQuantity(itemReq.getQuantity());
                    detail.setPrice(product.getPrice()); 

                    orderDetailRepository.save(detail);
                    
                    totalAmount = totalAmount.add(BigDecimal.valueOf(product.getPrice()).multiply(BigDecimal.valueOf(itemReq.getQuantity())));
                }
            }

            savedOrder.setTotalPrice(totalAmount.doubleValue());
            orderRepository.save(savedOrder);

            System.out.println("--- TẠO ĐƠN THÀNH CÔNG ID: " + savedOrder.getId() + " (" + order.getPaymentMethod() + ") ---");
            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(500).body("Lỗi Server Backend: " + e.getMessage());
        }
    }

    // 3. Cập nhật trạng thái & TRỪ KHO (GIỮ NGUYÊN KHÔNG SỬA)
    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status"); 
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + id));

        String oldStatus = order.getStatus();

        if ("PENDING".equals(oldStatus) && ("PROCESSING".equals(newStatus) || "COMPLETED".equals(newStatus))) {
            List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());

            for (OrderDetail detail : orderDetails) {
                Product product = detail.getProduct();
                int quantityOrdered = detail.getQuantity();

                List<ProductIngredient> recipe = productIngredientRepository.findByProduct_Id(product.getId());

                for (ProductIngredient pi : recipe) {
                    Ingredient warehouseItem = pi.getIngredient();
                    double totalNeeded = pi.getQuantityNeeded() * quantityOrdered;

                    if (warehouseItem.getQuantity() < totalNeeded) {
                        return ResponseEntity.badRequest().body(
                            "Kho không đủ nguyên liệu: " + warehouseItem.getName()
                        );
                    }
                    warehouseItem.setQuantity(warehouseItem.getQuantity() - totalNeeded);
                    ingredientRepository.save(warehouseItem);
                }
            }
        }
        
        order.setStatus(newStatus);
        return ResponseEntity.ok(orderRepository.save(order));
    }

    // 4. Lịch sử đơn hàng
    @GetMapping("/my-orders/{userId}")
    public List<Order> getMyOrders(@PathVariable Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // 5. Thống kê Dashboard
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long pending = orderRepository.countByStatus("PENDING");
        long completed = orderRepository.countByStatus("COMPLETED");
        
        Double revenue = orderRepository.sumTotalAmountByStatus("COMPLETED");
        if (revenue == null) revenue = 0.0;

        Map<String, Object> response = new HashMap<>();
        response.put("pendingOrders", pending);
        response.put("completedOrders", completed);
        response.put("totalRevenue", revenue);
        
        return ResponseEntity.ok(response);
    }

    // 6. Biểu đồ doanh thu
    @GetMapping("/revenue-chart")
    public ResponseEntity<List<Map<String, Object>>> getRevenueChart() {
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
        return ResponseEntity.ok(result);
    }
}