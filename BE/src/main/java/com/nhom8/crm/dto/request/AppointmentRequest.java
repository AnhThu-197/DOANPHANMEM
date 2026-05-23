package com.nhom8.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentRequest {

    @NotNull(message = "Mã khách hàng không được để trống")
    private Integer customerId;

    @NotNull(message = "Mã nhân viên không được để trống")
    private Integer employeeId;

    @NotBlank(message = "Tiêu đề lịch hẹn không được để trống")
    private String title;

    @NotBlank(message = "Loại lịch hẹn không được để trống")
    private String type; // 'call', 'email', 'meeting', 'video', etc.

    @NotBlank(message = "Ngày hẹn không được để trống")
    private String date; // định dạng YYYY-MM-DD

    @NotBlank(message = "Giờ hẹn không được để trống")
    private String time; // định dạng HH:mm

    @Builder.Default
    private Integer reminderBefore = 30; // số phút nhắc trước

    private String notes; // Mô tả lịch hẹn

    private String status; // Trạng thái lịch hẹn (scheduled, completed, cancelled, v.v.)
    
    private String result; // Kết quả cuộc hẹn (Thành công, Khách bận, Khách từ chối)

    private String resultNotes; // Ghi chú kết quả cuộc hẹn (ghiChuKetQua trong DB)
}
