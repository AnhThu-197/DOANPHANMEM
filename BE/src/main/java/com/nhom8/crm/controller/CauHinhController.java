package com.nhom8.crm.controller;

import com.nhom8.crm.dto.request.SystemConfigRequest;
import com.nhom8.crm.dto.response.SystemConfigResponse;
import com.nhom8.crm.service.CauHinhService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/cauhinh")
public class CauHinhController {

    private final CauHinhService cauHinhService;

    @Autowired
    public CauHinhController(CauHinhService cauHinhService) {
        this.cauHinhService = cauHinhService;
    }

    // 1. Lấy thông tin cấu hình hiện tại của hệ thống
    @GetMapping
    public ResponseEntity<SystemConfigResponse> getConfig() {
        SystemConfigResponse response = cauHinhService.getConfig();
        return ResponseEntity.ok(response);
    }

    // 2. Cập nhật thông tin cấu hình hệ thống
    @PutMapping
    public ResponseEntity<SystemConfigResponse> updateConfig(@Valid @RequestBody SystemConfigRequest request) {
        SystemConfigResponse response = cauHinhService.updateConfig(request);
        return ResponseEntity.ok(response);
    }

    // 3. Tải bản sao lưu cơ sở dữ liệu hệ thống (Backup)
    @GetMapping("/backup")
    public ResponseEntity<byte[]> downloadBackup() {
        byte[] backupBytes = cauHinhService.executeManualBackup();
        
        String datetime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = "backup_crm_" + datetime + ".json";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(backupBytes);
    }

    // 4. Khôi phục cơ sở dữ liệu hệ thống từ tệp tin sao lưu (Restore)
    @PostMapping("/restore")
    public ResponseEntity<String> restoreBackup(@RequestParam("file") MultipartFile file) {
        cauHinhService.restoreData(file);
        return ResponseEntity.ok("Khôi phục dữ liệu hệ thống từ bản sao lưu thành công!");
    }
}
