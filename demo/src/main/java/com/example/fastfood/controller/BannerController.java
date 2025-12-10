package com.example.fastfood.controller;

import com.example.fastfood.entity.Banner;
import com.example.fastfood.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(origins = "*")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    // Lấy tất cả (cho Admin)
    @GetMapping
    public List<Banner> getAll() {
        return bannerRepository.findAll();
    }

    // Lấy banner đang hoạt động (cho HomePage)
    @GetMapping("/active")
    public List<Banner> getActive() {
        return bannerRepository.findByIsActiveTrue();
    }

    @PostMapping
    public Banner create(@RequestBody Banner banner) {
        return bannerRepository.save(banner);
    }

    @PutMapping("/{id}")
    public Banner update(@PathVariable Long id, @RequestBody Banner bannerDetails) {
        Banner banner = bannerRepository.findById(id).orElseThrow();
        banner.setTitle(bannerDetails.getTitle());
        banner.setImageUrl(bannerDetails.getImageUrl());
        banner.setLinkUrl(bannerDetails.getLinkUrl());
        banner.setIsActive(bannerDetails.getIsActive());
        return bannerRepository.save(banner);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bannerRepository.deleteById(id);
    }
}