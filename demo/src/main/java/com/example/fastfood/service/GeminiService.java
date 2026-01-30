package com.example.fastfood.service;

import com.example.fastfood.entity.Product;
import com.example.fastfood.repository.ProductRepository;
import jakarta.annotation.PostConstruct; // Nếu báo lỗi dòng này, đổi thành javax.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Autowired
    private ProductRepository productRepository;

    // 👇 CHỨC NĂNG MỚI: Tự động in ra danh sách Model khả dụng khi chạy server
    //@PostConstruct
//     public void printAvailableModels() {
//         System.out.println("----- 🔍 ĐANG KIỂM TRA CÁC MODEL GEMINI KHẢ DỤNG -----");
//         try {
//             RestTemplate restTemplate = new RestTemplate();
//             // Gọi API lấy danh sách model
//             String url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey;
//             String result = restTemplate.getForObject(url, String.class);
            
//             // In kết quả ra màn hình console
//             System.out.println("✅ DANH SÁCH MODEL CỦA BẠN:");
//             System.out.println(result); 
//             System.out.println("👉 Hãy copy một 'name' trong danh sách trên (VD: models/gemini-1.5-flash) để điền vào application.properties");
//         } catch (Exception e) {
//             System.err.println("❌ Không lấy được danh sách model: " + e.getMessage());
//         }
//         System.out.println("------------------------------------------------------");
//     }

    public String getAnswer(String userQuestion) {
        // 1. Lấy dữ liệu Menu từ Database
        List<Product> products = productRepository.findAll();
        
        // Tạo chuỗi menu để "dạy" AI
        String menuContext = products.isEmpty() ? "Hiện tại quán chưa có món nào." : 
            products.stream()
                .map(p -> String.format("- %s: %s vnđ", p.getName(), p.getPrice()))
                .collect(Collectors.joining("\n"));

        // 2. Tạo kịch bản (Prompt)
        String prompt = String.format(
            "Bạn là trợ lý ảo của quán FastFood. Dưới đây là Menu quán:\n%s\n\n" +
            "Khách hàng hỏi: \"%s\"\n" +
            "Yêu cầu: Trả lời ngắn gọn, vui vẻ, có emoji. Nếu khách hỏi món không có trong menu, hãy gợi ý món khác tương tự.",
            menuContext, userQuestion
        );

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // --- TẠO JSON BODY BẰNG JAVA MAP (An toàn 100%) ---
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(content));
            // ---------------------------------------------------

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            // Tạo URL (Thêm log để debug)
            String finalUrl = apiUrl + "?key=" + apiKey;
            System.out.println("👉 Đang gọi Gemini API tại: " + finalUrl); 

            // Gửi request
            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, entity, Map.class);
            
            // Xử lý kết quả trả về
            Map<String, Object> body = response.getBody();
            if (body == null) return "AI không phản hồi.";

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            if (candidates == null || candidates.isEmpty()) return "AI đang suy nghĩ...";

            Map<String, Object> contentRes = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentRes.get("parts");
            
            return (String) parts.get(0).get("text");

        } catch (HttpClientErrorException e) {
            // In lỗi chi tiết từ Google ra Console màu đỏ
            System.err.println("❌ LỖI GOOGLE API: " + e.getResponseBodyAsString());
            return "Lỗi kết nối AI: " + e.getStatusText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Xin lỗi, hệ thống AI đang bận. Bạn thử lại sau nhé! 🍔";
        }
    }
}