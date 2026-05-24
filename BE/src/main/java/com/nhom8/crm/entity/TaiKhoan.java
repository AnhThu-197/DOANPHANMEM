package com.nhom8.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "TaiKhoan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maTaiKhoan")
    private Integer maTaiKhoan;

    // Thay vì mapping cả Object VaiTro ngay từ đầu, bạn có thể map ID hoặc Object ManyToOne
    // Ở đây ta map ID đơn giản hoặc ManyToOne. Để chuẩn nhất ta map ManyToOne sau khi tạo VaiTro.
    // Tạm thời map Integer maVaiTro hoặc quan hệ để minh họa.
    @Column(name = "maVaiTro", nullable = false)
    private Integer maVaiTro;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "matKhau", nullable = false, length = 255)
    private String matKhau;

    @Column(name = "maXacThucOTP", length = 255)
    private String maXacThucOTP;

    @Column(name = "thoiHanOTP")
    private LocalDateTime thoiHanOTP;

    @Builder.Default
    @Column(name = "lanDangNhapSai", nullable = false)
    private Integer lanDangNhapSai = 0;

    @Column(name = "thoiGianKhoaTam")
    private LocalDateTime thoiGianKhoaTam;

    @Builder.Default
    @Column(name = "trangThai", nullable = false, length = 20)
    private String trangThai = "Hoạt động";

    @Builder.Default
    @Column(name = "ngayTao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Builder.Default
    @Column(name = "ngayCapNhat")
    private LocalDateTime ngayCapNhat = LocalDateTime.now();

    @Column(name = "lanDangNhapCuoi")
    private LocalDateTime lanDangNhapCuoi;
}
