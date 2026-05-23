package com.nhom8.crm.controller;

import com.nhom8.crm.dto.request.AppointmentRequest;
import com.nhom8.crm.dto.request.AppointmentResultRequest;
import com.nhom8.crm.dto.response.AppointmentResponse;
import com.nhom8.crm.service.NhacNhoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lichhen")
public class NhacNhoController {

    private final NhacNhoService service;

    @Autowired
    public NhacNhoController(NhacNhoService service) {
        this.service = service;
    }

    // 1. Tạo mới một lịch hẹn
    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse saved = service.createAppointment(request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // 2. Lấy danh sách toàn bộ lịch hẹn
    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        List<AppointmentResponse> list = service.getAllAppointments();
        return ResponseEntity.ok(list);
    }

    // 3. Xem chi tiết lịch hẹn theo mã
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable Integer id) {
        AppointmentResponse item = service.getAppointmentById(id);
        return ResponseEntity.ok(item);
    }

    // 4. Lấy danh sách lịch hẹn của một khách hàng cụ thể
    @GetMapping("/khachhang/{customerId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByCustomerId(@PathVariable Integer customerId) {
        List<AppointmentResponse> list = service.getAppointmentsByCustomerId(customerId);
        return ResponseEntity.ok(list);
    }

    // 5. Lấy danh sách lịch hẹn của một nhân viên cụ thể
    @GetMapping("/nhanvien/{employeeId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByEmployeeId(@PathVariable Integer employeeId) {
        List<AppointmentResponse> list = service.getAppointmentsByEmployeeId(employeeId);
        return ResponseEntity.ok(list);
    }

    // 6. Cập nhật thông tin lịch hẹn
    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponse> updateAppointment(@PathVariable Integer id,
                                                                 @Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse updated = service.updateAppointment(id, request);
        return ResponseEntity.ok(updated);
    }

    // 6b. Cập nhật kết quả và ghi chú lịch hẹn
    @PutMapping("/{id}/ketqua")
    public ResponseEntity<AppointmentResponse> updateAppointmentResult(@PathVariable Integer id,
                                                                        @Valid @RequestBody AppointmentResultRequest request) {
        AppointmentResponse updated = service.updateAppointmentResult(id, request);
        return ResponseEntity.ok(updated);
    }

    // 7. Xóa lịch hẹn
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {
        service.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
