package com.example.fastfood.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cấu hình: Khi frontend gọi đường dẫn /images/ten_file.jpg
        // Backend sẽ tìm file đó trong thư mục "uploads" nằm ở gốc dự án
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:uploads/");
    }
}