package com.nhom8.crm.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LichSuDongBoResponse {

    private Integer maLichSuDongBo;

    private String tenNenTang;

    private String loaiNenTang;

    private Integer soKhachHangMoi;

    private LocalDateTime thoiGian;

    private String trangThai;

    private String ghiChu;
}