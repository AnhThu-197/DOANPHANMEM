package com.nhom8.crm.controller;

import com.nhom8.crm.dto.response.ApiResponse;
import com.nhom8.crm.entity.YeuCauXoa;
import com.nhom8.crm.service.YeuCauXoaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/khach-hang/yeu-cau-xoa")
@RequiredArgsConstructor
@Tag(name = "Yêu cầu xóa", description = "Quản lý yêu cầu xóa khách hàng")
public class YeuCauXoaController {

    private final YeuCauXoaService yeuCauXoaService;

    @GetMapping
    @Operation(summary = "Lấy danh sách yêu cầu xóa")
    public ResponseEntity<ApiResponse<List<YeuCauXoa>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(yeuCauXoaService.getAll()));
    }

    @PostMapping
    @Operation(summary = "Gửi yêu cầu xóa khách hàng")
    public ResponseEntity<ApiResponse<YeuCauXoa>> submitRequest(
            @RequestBody Map<String, Object> body) {
        
        Integer maKhachHang = ((Number) body.get("customerId")).intValue();
        Integer maNhanVien = ((Number) body.get("requestedById")).intValue();
        String lyDo = (String) body.get("reason");

        YeuCauXoa response = yeuCauXoaService.submitRequest(maKhachHang, maNhanVien, lyDo);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Gửi yêu cầu xóa thành công", response));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Duyệt yêu cầu xóa")
    public ResponseEntity<ApiResponse<YeuCauXoa>> approveRequest(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {

        Integer maNguoiDuyet = ((Number) body.get("maNguoiDuyet")).intValue();

        YeuCauXoa response = yeuCauXoaService.approveRequest(id, maNguoiDuyet);

        return ResponseEntity.ok(ApiResponse.ok("Đã duyệt yêu cầu xóa", response));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Từ chối yêu cầu xóa")
    public ResponseEntity<ApiResponse<YeuCauXoa>> rejectRequest(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {

        Integer maNguoiDuyet = ((Number) body.get("maNguoiDuyet")).intValue();
        String lyDoTuChoi = (String) body.get("reason");

        YeuCauXoa response = yeuCauXoaService.rejectRequest(id, maNguoiDuyet, lyDoTuChoi);

        return ResponseEntity.ok(ApiResponse.ok("Đã từ chối yêu cầu xóa", response));
    }
}
