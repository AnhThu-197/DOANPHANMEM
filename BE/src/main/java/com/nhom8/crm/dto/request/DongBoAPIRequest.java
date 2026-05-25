package com.nhom8.crm.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DongBoAPIRequest {

    private String tenNenTang;

    private String loaiNenTang;

    private String apiKey;

    private String webhookUrl;
}