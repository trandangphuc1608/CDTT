package com.example.fastfood.repository;

import com.example.fastfood.entity.DiningTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableRepository extends JpaRepository<DiningTable, Long> {
}