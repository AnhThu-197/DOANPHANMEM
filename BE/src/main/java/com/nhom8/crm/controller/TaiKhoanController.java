package com.nhom8.crm.controller;

import com.nhom8.crm.dto.request.ForgotPasswordRequest;
import com.nhom8.crm.dto.request.ResetPasswordRequest;
import com.nhom8.crm.dto.request.VerifyOtpRequest;
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

    // 6. Quên mật khẩu - Gửi OTP qua mail
    @PostMapping("/quen-mat-khau")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        taiKhoanService.sendOtp(request);
        return ResponseEntity.ok("Mã OTP xác thực đặt lại mật khẩu đã được gửi qua email của bạn.");
    }

    // 6b. Xác thực mã OTP
    @PostMapping("/xac-thuc-otp")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        taiKhoanService.verifyOtp(request);
        return ResponseEntity.ok("Mã OTP chính xác. Vui lòng tiến hành đặt lại mật khẩu mới.");
    }

    // 7. Đặt lại mật khẩu mới
    @PostMapping("/dat-lai-mat-khau")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        taiKhoanService.resetPassword(request);
        return ResponseEntity.ok("Mật khẩu mới đã được thiết lập thành công.");
    }
}
