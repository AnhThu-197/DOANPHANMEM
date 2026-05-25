package com.nhom8.crm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "LichSuDongBoAPI")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LichSuDongBoAPI {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maLichSuDongBo")
    private Integer maLichSuDongBo;

    @Column(name = "tenNenTang", nullable = false, length = 100)
    private String tenNenTang;

    @Column(name = "loaiNenTang", nullable = false, length = 50)
    private String loaiNenTang;

    @Column(name = "soKhachHangMoi", nullable = false)
    @Builder.Default
    private Integer soKhachHangMoi = 0;

    @Column(name = "thoiGian")
    private LocalDateTime thoiGian;

    @Column(name = "trangThai", nullable = false, length = 50)
    private String trangThai;

    @Column(name = "ghiChu", length = 500)
    private String ghiChu;

    @PrePersist
    protected void onCreate() {
        if (thoiGian == null) {
            thoiGian = LocalDateTime.now();
        }
    }
}