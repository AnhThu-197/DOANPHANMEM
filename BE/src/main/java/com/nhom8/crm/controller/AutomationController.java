package com.nhom8.crm.controller;

import com.nhom8.crm.dto.response.ApiResponse;
import com.nhom8.crm.entity.QuyTacTuDongHoa;
import com.nhom8.crm.exception.ResourceNotFoundException;
import com.nhom8.crm.repository.QuyTacTuDongHoaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/automation")
@RequiredArgsConstructor
@Tag(name = "Tự động hóa", description = "Quản lý kịch bản chăm sóc tự động")
@Slf4j
public class AutomationController {

    private final QuyTacTuDongHoaRepository quyTacTuDongHoaRepository;

    @GetMapping
    @Operation(summary = "Lấy tất cả kịch bản tự động hóa")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAll() {
        List<QuyTacTuDongHoa> rules = quyTacTuDongHoaRepository.findAll();
        List<Map<String, Object>> responseList = rules.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(responseList));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết kịch bản tự động hóa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getById(@PathVariable Integer id) {
        QuyTacTuDongHoa rule = quyTacTuDongHoaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kịch bản tự động hóa", id));
        return ResponseEntity.ok(ApiResponse.ok(mapToResponse(rule)));
    }

    @PostMapping
    @Operation(summary = "Tạo mới kịch bản tự động hóa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(@RequestBody Map<String, Object> payload) {
        QuyTacTuDongHoa rule = QuyTacTuDongHoa.builder()
                .tenQuyTac((String) payload.get("name"))
                .moTa((String) payload.get("description"))
                .dieuKienKichHoat((String) payload.get("trigger"))
                .loaiQuyTac("Kịch bản")
                .trangThaiQuyTac("active".equalsIgnoreCase((String) payload.get("status")))
                .hanhDongThucHien("[]")
                .soLanThucThi(0)
                .build();
        QuyTacTuDongHoa saved = quyTacTuDongHoaRepository.save(rule);
        return ResponseEntity.ok(ApiResponse.ok("Tạo kịch bản thành công", mapToResponse(saved)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật kịch bản tự động hóa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> update(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> payload) {
        QuyTacTuDongHoa rule = quyTacTuDongHoaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kịch bản tự động hóa", id));

        if (payload.containsKey("name")) {
            rule.setTenQuyTac((String) payload.get("name"));
        }
        if (payload.containsKey("description")) {
            rule.setMoTa((String) payload.get("description"));
        }
        if (payload.containsKey("trigger")) {
            rule.setDieuKienKichHoat((String) payload.get("trigger"));
        }
        if (payload.containsKey("status")) {
            rule.setTrangThaiQuyTac("active".equalsIgnoreCase((String) payload.get("status")));
        }

        QuyTacTuDongHoa saved = quyTacTuDongHoaRepository.save(rule);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật kịch bản thành công", mapToResponse(saved)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa kịch bản tự động hóa")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        QuyTacTuDongHoa rule = quyTacTuDongHoaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kịch bản tự động hóa", id));
        quyTacTuDongHoaRepository.delete(rule);
        return ResponseEntity.ok(ApiResponse.ok("Xóa kịch bản thành công", null));
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Kích hoạt kịch bản tự động hóa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> activate(@PathVariable Integer id) {
        QuyTacTuDongHoa rule = quyTacTuDongHoaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kịch bản tự động hóa", id));
        rule.setTrangThaiQuyTac(true);
        QuyTacTuDongHoa saved = quyTacTuDongHoaRepository.save(rule);
        return ResponseEntity.ok(ApiResponse.ok("Kích hoạt kịch bản thành công", mapToResponse(saved)));
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Tạm dừng kịch bản tự động hóa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deactivate(@PathVariable Integer id) {
        QuyTacTuDongHoa rule = quyTacTuDongHoaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kịch bản tự động hóa", id));
        rule.setTrangThaiQuyTac(false);
        QuyTacTuDongHoa saved = quyTacTuDongHoaRepository.save(rule);
        return ResponseEntity.ok(ApiResponse.ok("Tạm dừng kịch bản thành công", mapToResponse(saved)));
    }

    @GetMapping("/statistics")
    @Operation(summary = "Lấy thống kê kịch bản tự động hóa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics() {
        List<QuyTacTuDongHoa> rules = quyTacTuDongHoaRepository.findAll();
        long total = rules.size();
        long active = rules.stream().filter(QuyTacTuDongHoa::getTrangThaiQuyTac).count();
        long paused = total - active;

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("active", active);
        stats.put("paused", paused);
        stats.put("draft", 0);

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Lấy lịch sử thực thi kịch bản")
    public ResponseEntity<ApiResponse<List<Object>>> getExecutionHistory(@PathVariable Integer id) {
        // Trả về danh sách rỗng thay vì ném lỗi
        return ResponseEntity.ok(ApiResponse.ok(new ArrayList<>()));
    }

    private Map<String, Object> mapToResponse(QuyTacTuDongHoa rule) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", rule.getMaQuyTac());
        map.put("name", rule.getTenQuyTac());
        map.put("description", rule.getMoTa());
        map.put("trigger", rule.getDieuKienKichHoat());
        map.put("status", rule.getTrangThaiQuyTac() ? "active" : "paused");
        map.put("createdDate", rule.getNgayTao() != null ? rule.getNgayTao().toLocalDate().toString() : "");
        map.put("actions", new ArrayList<>());
        return map;
    }
}
