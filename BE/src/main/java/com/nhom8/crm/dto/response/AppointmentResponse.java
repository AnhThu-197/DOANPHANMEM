package com.nhom8.crm.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Integer id;
    private Integer customerId;
    private String customerName;
    private Integer employeeId;
    private String employeeName;
    private String title;
    private String type; // 'call', 'email', 'meeting', 'video', etc.
    private String date; // YYYY-MM-DD
    private String time; // HH:mm
    private Integer reminderBefore;
    private String notes;
    private String status; // 'scheduled', 'completed', 'cancelled'
    private String result; // 'Thành công', 'Khách bận', 'Khách từ chối'
    private String resultNotes; // Ghi chú kết quả cuộc hẹn (ghiChuKetQua trong DB)
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
