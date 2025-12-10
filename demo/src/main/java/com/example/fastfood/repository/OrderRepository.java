package com.example.fastfood.repository;

import com.example.fastfood.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // 1. Tổng doanh thu (Chỉ tính đơn đã hoàn thành)
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'COMPLETED'")
    BigDecimal sumTotalRevenue();

    // 2. Đếm số đơn đã hoàn thành
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'COMPLETED'")
    Long countCompletedOrders();

    // 3. Đếm số đơn đang chờ (Pending hoặc Preparing)
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'PENDING' OR o.status = 'PREPARING'")
    Long countPendingOrders();

    // 4. [MỚI] Lấy doanh thu 7 ngày gần nhất (Dùng SQL thuần của MySQL)
    // DATE_FORMAT(created_at, '%d/%m') sẽ chuyển ngày thành dạng "29/11"
    @Query(value = "SELECT DATE_FORMAT(created_at, '%d/%m') as date, SUM(total_amount) as revenue " +
                   "FROM orders " +
                   "WHERE status = 'COMPLETED' " +
                   "GROUP BY DATE_FORMAT(created_at, '%d/%m') " +
                   "ORDER BY MIN(created_at) ASC LIMIT 7", nativeQuery = true)
    List<Object[]> getRevenueLast7Days();

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}