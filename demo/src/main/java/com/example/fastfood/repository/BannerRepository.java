package com.example.fastfood.repository;

import com.example.fastfood.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    // Tìm các banner đang kích hoạt để hiện ra trang chủ
    List<Banner> findByIsActiveTrue();
}