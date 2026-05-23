package com.nhom8.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InteractionRequest {

    @NotNull(message = "Mã khách hàng không được để trống")
    private Integer customerId;

    private Integer employeeId;

    @NotBlank(message = "Loại tương tác không được để trống")
    private String type; // 'call', 'email', 'meeting', 'message'

    @NotBlank(message = "Nội dung tương tác không được để trống")
    private String content;

    private String notes; // Ghi chú thêm hoặc kết quả
}
