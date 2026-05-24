package com.nhom8.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "NhanVien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class NhanVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maNhanVien")
    private Integer maNhanVien;

    // Quan hệ 1-1 với TaiKhoan (Một Nhân viên có duy nhất một Tài khoản)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maTaiKhoan", nullable = false, unique = true)
    private TaiKhoan taiKhoan;

    @Column(name = "hoTen", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "soDienThoai", length = 15)
    private String soDienThoai;

    @Column(name = "chucVu", length = 100)
    private String chucVu;

    @Column(name = "anhDaiDien", length = 255)
    private String anhDaiDien;

    // Map mã Phường Xã đơn giản bằng ID hoặc ManyToOne tùy chọn. Ở đây dùng ID minh họa.
    @Column(name = "maPhuongXa")
    private Integer maPhuongXa;

    @Column(name = "diaChiChiTiet", length = 255)
    private String diaChiChiTiet;

    @Column(name = "ngaySinh")
    private LocalDate ngaySinh;

    @Column(name = "gioiTinh", length = 10)
    private String gioiTinh;

    @Column(name = "ngayVaoLam")
    private LocalDate ngayVaoLam;

    @Column(name = "ghiChu", length = 500)
    private String ghiChu;

    @Builder.Default
    @Column(name = "ngayTao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Builder.Default
    @Column(name = "ngayCapNhat")
    private LocalDateTime ngayCapNhat = LocalDateTime.now();
}
