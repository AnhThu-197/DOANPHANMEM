package com.nhom8.crm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CauHinhDongBoAPI")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CauHinhDongBoAPI {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maCauHinh")
    private Integer maCauHinh;

    @Column(name = "tenNenTang", nullable = false, length = 100)
    private String tenNenTang;

    @Column(name = "loaiNenTang", nullable = false, length = 50)
    private String loaiNenTang;

    @Column(name = "apiKey", length = 500)
    private String apiKey;

    @Column(name = "webhookUrl", length = 500)
    private String webhookUrl;

    @Column(name = "trangThai", nullable = false)
    @Builder.Default
    private Boolean trangThai = true;

    @Column(name = "ngayTao")
    private LocalDateTime ngayTao;

    @Column(name = "ngayCapNhat")
    private LocalDateTime ngayCapNhat;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
        ngayCapNhat = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }
}