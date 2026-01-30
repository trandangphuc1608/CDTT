package com.example.fastfood.repository;

import com.example.fastfood.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // 🔴 SỬA DÒNG NÀY: Đổi OrderByOrderDateDesc -> OrderByCreatedAtDesc
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 2. Tìm đơn hàng theo User (chung chung)
    List<Order> findByUserId(Long userId);

    // 3. Đếm số lượng đơn theo trạng thái
    long countByStatus(String status);

    // 4. Tính tổng doanh thu
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.status = :status")
    Double sumTotalAmountByStatus(@Param("status") String status);

    // 5. Biểu đồ doanh thu
    @Query(value = "SELECT DATE_FORMAT(created_at, '%d/%m') as dateStr, SUM(total_price) as revenue " +
                   "FROM orders " +
                   "WHERE status = 'COMPLETED' " +
                   "AND created_at >= DATE(NOW()) - INTERVAL 7 DAY " +
                   "GROUP BY DATE_FORMAT(created_at, '%d/%m') " +
                   "ORDER BY MIN(created_at) ASC", nativeQuery = true)
    List<Object[]> getRevenueLast7Days();
}