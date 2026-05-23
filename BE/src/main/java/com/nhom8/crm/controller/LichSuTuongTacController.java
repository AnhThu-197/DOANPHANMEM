package com.nhom8.crm.controller;

import com.nhom8.crm.dto.request.InteractionRequest;
import com.nhom8.crm.dto.response.InteractionResponse;
import com.nhom8.crm.service.LichSuTuongTacService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tuongtac")
public class LichSuTuongTacController {

    private final LichSuTuongTacService service;

    @Autowired
    public LichSuTuongTacController(LichSuTuongTacService service) {
        this.service = service;
    }

    // 1. Lấy danh sách toàn bộ tương tác trên hệ thống
    @GetMapping
    public ResponseEntity<List<InteractionResponse>> getAllInteractions() {
        List<InteractionResponse> list = service.getAllInteractions();
        return ResponseEntity.ok(list);
    }

    // 2. Lấy danh sách lịch sử tương tác của một khách hàng cụ thể
    @GetMapping("/khachhang/{customerId}")
    public ResponseEntity<List<InteractionResponse>> getInteractionsByCustomerId(@PathVariable Integer customerId) {
        List<InteractionResponse> list = service.getInteractionsByCustomerId(customerId);
        return ResponseEntity.ok(list);
    }

    // 3. Thêm một tương tác mới
    @PostMapping
    public ResponseEntity<InteractionResponse> addInteraction(@Valid @RequestBody InteractionRequest request) {
        InteractionResponse saved = service.addInteraction(request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
