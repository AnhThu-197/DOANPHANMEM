package com.nhom8.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "KhachHang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maKhachHang")
    private Integer maKhachHang;

    // Quan hệ ManyToOne: Nhiều khách hàng được phụ trách bởi một nhân viên
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiPhuTrach")
    private NhanVien nguoiPhuTrach;

    @Column(name = "maNganhNghe")
    private Integer maNganhNghe;

    @Column(name = "maNguonKH")
    private Integer maNguonKH;

    @Column(name = "maPhuongXa")
    private Integer maPhuongXa;

    @Column(name = "hoTen", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "soDienThoai", nullable = false, unique = true, length = 15)
    private String soDienThoai;

    @Column(name = "gioiTinh", length = 10)
    private String gioiTinh;

    @Column(name = "ngaySinh")
    private LocalDate ngaySinh;

    @Column(name = "congTy", length = 150)
    private String congTy;

    @Column(name = "chucVuTaiCongTy", length = 100)
    private String chucVuTaiCongTy;

    @Column(name = "websiteCongTy", length = 255)
    private String websiteCongTy;

    @Column(name = "diaChiChiTiet", length = 255)
    private String diaChiChiTiet;

    @Builder.Default
    @Column(name = "trangThaiKhach", nullable = false, length = 50)
    private String trangThaiKhach = "Người truy cập";

    @Builder.Default
    @Column(name = "diemTiemNang", nullable = false)
    private Integer diemTiemNang = 0;

    @Column(name = "ngayBatDauDungThu")
    private LocalDate ngayBatDauDungThu;

    @Builder.Default
    @Column(name = "soNgayDungThu", nullable = false)
    private Integer soNgayDungThu = 0;

    @Builder.Default
    @Column(name = "trangThaiDungThu", nullable = false, length = 30)
    private String trangThaiDungThu = "Chưa dùng thử";

    @Builder.Default
    @Column(name = "daXoa", nullable = false)
    private Boolean daXoa = false;

    @Column(name = "lyDoXoa", length = 200)
    private String lyDoXoa;

    @Column(name = "ngayXoa")
    private LocalDateTime ngayXoa;

    @Builder.Default
    @Column(name = "ngayTao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Builder.Default
    @Column(name = "ngayCapNhat")
    private LocalDateTime ngayCapNhat = LocalDateTime.now();
}
