package com.nhom8.crm.controller;

import com.nhom8.crm.entity.TaiKhoan;
import com.nhom8.crm.service.TaiKhoanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/taikhoan")
public class TaiKhoanController {

    private final TaiKhoanService taiKhoanService;

    @Autowired
    public TaiKhoanController(TaiKhoanService taiKhoanService) {
        this.taiKhoanService = taiKhoanService;
    }

    // 1. Lấy danh sách toàn bộ tài khoản
    @GetMapping
    public ResponseEntity<List<TaiKhoan>> getAllTaiKhoans() {
        List<TaiKhoan> list = taiKhoanService.getAllTaiKhoans();
        return ResponseEntity.ok(list);
    }

    // 2. Lấy chi tiết tài khoản theo ID
    @GetMapping("/{id}")
    public ResponseEntity<TaiKhoan> getTaiKhoanById(@PathVariable Integer id) {
        TaiKhoan taiKhoan = taiKhoanService.getTaiKhoanById(id);
        return ResponseEntity.ok(taiKhoan);
    }

    // 3. Tạo mới một tài khoản
    @PostMapping
    public ResponseEntity<TaiKhoan> createTaiKhoan(@Valid @RequestBody TaiKhoan taiKhoan) {
        TaiKhoan saved = taiKhoanService.createTaiKhoan(taiKhoan);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // 4. Cập nhật thông tin tài khoản
    @PutMapping("/{id}")
    public ResponseEntity<TaiKhoan> updateTaiKhoan(@PathVariable Integer id, @Valid @RequestBody TaiKhoan taiKhoan) {
        TaiKhoan updated = taiKhoanService.updateTaiKhoan(id, taiKhoan);
        return ResponseEntity.ok(updated);
    }

    // 5. Xóa tài khoản
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaiKhoan(@PathVariable Integer id) {
        taiKhoanService.deleteTaiKhoan(id);
        return ResponseEntity.noContent().build();
    }
}
