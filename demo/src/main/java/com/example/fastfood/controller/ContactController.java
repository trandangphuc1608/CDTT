package com.example.fastfood.controller;

import com.example.fastfood.entity.Contact;
import com.example.fastfood.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Cho phép React gọi API
@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    // 1. Lấy danh sách phản hồi (Mới nhất lên đầu)
    @GetMapping
    public List<Contact> getAllContacts() {
        return contactRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
    }

    // 2. Gửi phản hồi mới (Từ trang chủ React)
    @PostMapping
    public Contact createContact(@RequestBody Contact contact) {
        // React gửi lên: { name, email, message }
        // Backend tự thêm: createdAt, status="NEW"
        return contactRepository.save(contact);
    }

    // 3. Đánh dấu đã đọc / Cập nhật trạng thái
    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateStatus(@PathVariable Long id, @RequestBody Contact details) {
        return contactRepository.findById(id).map(contact -> {
            if (details.getStatus() != null) {
                contact.setStatus(details.getStatus());
            }
            return ResponseEntity.ok(contactRepository.save(contact));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Xóa phản hồi
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {
        contactRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}