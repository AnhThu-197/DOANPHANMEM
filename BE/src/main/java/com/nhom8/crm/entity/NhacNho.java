package com.nhom8.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "NhacNho")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class NhacNho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maNhacNho")
    private Integer maNhacNho;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maKhachHang", nullable = false)
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNhanVien", nullable = false)
    private NhanVien nhanVien;

    @Column(name = "tieuDe", nullable = false, length = 200)
    private String tieuDe;

    @Column(name = "moTa", length = 500)
    private String moTa;

    @Builder.Default
    @Column(name = "loaiNhacNho", length = 50)
    private String loaiNhacNho = "Gọi điện";

    @Column(name = "thoiGianNhac", nullable = false)
    private LocalDateTime thoiGianNhac;

    @Builder.Default
    @Column(name = "nhacTruocPhut")
    private Integer nhacTruocPhut = 30;

    @Builder.Default
    @Column(name = "trangThaiNhacNho", nullable = false, length = 50)
    private String trangThaiNhacNho = "Chờ xử lý";

    @Column(name = "ketQua", length = 50)
    private String ketQua;

    @Column(name = "ghiChuKetQua", length = 500)
    private String ghiChuKetQua;

    @Builder.Default
    @Column(name = "ngayTao", nullable = false, updatable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Builder.Default
    @Column(name = "ngayCapNhat")
    private LocalDateTime ngayCapNhat = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (ngayTao == null) {
            ngayTao = LocalDateTime.now();
        }
        ngayCapNhat = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }
}
