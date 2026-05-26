package com.nhom8.crm.controller;

import com.nhom8.crm.dto.request.DongBoAPIRequest;
import com.nhom8.crm.dto.response.ApiResponse;
import com.nhom8.crm.dto.response.LichSuDongBoResponse;
import com.nhom8.crm.service.DongBoAPIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dong-bo-api")
@RequiredArgsConstructor
@Tag(name = "Đồng bộ API", description = "Đồng bộ dữ liệu khách hàng từ API bên ngoài")
public class DongBoAPIController {

    private final DongBoAPIService dongBoAPIService;

    @PostMapping("/luu-cau-hinh")
    @Operation(summary = "Lưu cấu hình đồng bộ API")
    public ResponseEntity<ApiResponse<Void>> luuCauHinh(@RequestBody DongBoAPIRequest request) {
        dongBoAPIService.luuCauHinh(request);
        return ResponseEntity.ok(ApiResponse.ok("Lưu cấu hình thành công", null));
    }

    @PostMapping("/test-ket-noi")
    @Operation(summary = "Test kết nối API bên ngoài")
    public ResponseEntity<ApiResponse<Void>> testKetNoi(@RequestBody DongBoAPIRequest request) {
        dongBoAPIService.testKetNoi(request);
        return ResponseEntity.ok(ApiResponse.ok("Test kết nối thành công", null));
    }

    @PostMapping("/dong-bo")
    @Operation(summary = "Đồng bộ dữ liệu khách hàng từ API bên ngoài")
    public ResponseEntity<ApiResponse<Void>> dongBo(@RequestBody DongBoAPIRequest request) {
        dongBoAPIService.dongBo(request);
        return ResponseEntity.ok(ApiResponse.ok("Đồng bộ dữ liệu thành công", null));
    }

    @GetMapping("/lich-su")
    @Operation(summary = "Lấy lịch sử đồng bộ API")
    public ResponseEntity<ApiResponse<List<LichSuDongBoResponse>>> getLichSu() {
        return ResponseEntity.ok(ApiResponse.ok(dongBoAPIService.getLichSu()));
    }
}