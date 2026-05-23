package com.nhom8.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResultRequest {

    @NotBlank(message = "Kết quả không được để trống")
    private String result; // 'success', 'busy', 'rejected', or 'Thành công', 'Khách bận', 'Khách từ chối'

    @NotBlank(message = "Ghi chú kết quả không được để trống")
    private String resultNotes; // Chi tiết ghi chú kết quả cuộc hẹn
}
