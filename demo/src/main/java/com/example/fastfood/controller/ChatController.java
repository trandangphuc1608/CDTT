package com.example.fastfood.controller;

import com.example.fastfood.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class ChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, String> payload) {
        String question = payload.get("message");
        String answer = geminiService.getAnswer(question);
        return ResponseEntity.ok(Map.of("reply", answer));
    }
}