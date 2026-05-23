package com.nhom8.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CauHinhHeThong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CauHinhHeThong {

    @Id
    @Column(name = "id")
    @Builder.Default
    private Integer id = 1; // Luôn chỉ có 1 dòng duy nhất lưu cấu hình hệ thống

    // 1. Thông tin công ty
    @Column(name = "tenCongTy", length = 200)
    @Builder.Default
    private String tenCongTy = "CÔNG TY CRM";

    @Column(name = "emailCongTy", length = 150)
    @Builder.Default
    private String emailCongTy = "contact@crm.com";

    @Column(name = "soDienThoaiCongTy", length = 20)
    @Builder.Default
    private String soDienThoaiCongTy = "0123456789";

    @Column(name = "websiteCongTy", length = 255)
    @Builder.Default
    private String websiteCongTy = "https://example.com";

    @Column(name = "diaChiCongTy", length = 500)
    @Builder.Default
    private String diaChiCongTy = "123 Đường ABC, Quận 1, TP.HCM";

    // 2. Hệ thống
    @Column(name = "muiGio", length = 50)
    @Builder.Default
    private String muiGio = "Việt Nam (GMT+7)";

    @Column(name = "dinhDangNgay", length = 50)
    @Builder.Default
    private String dinhDangNgay = "DD/MM/YYYY";

    @Column(name = "donViTienTe", length = 20)
    @Builder.Default
    private String donViTienTe = "VND (₫)";

    @Column(name = "ngonNgu", length = 50)
    @Builder.Default
    private String ngonNgu = "Tiếng Việt";

    // 3. Thông báo
    @Column(name = "thongBaoEmail")
    @Builder.Default
    private Boolean thongBaoEmail = true;

    @Column(name = "thongBaoSms")
    @Builder.Default
    private Boolean thongBaoSms = false;

    @Column(name = "thongBaoTrinhDuyet")
    @Builder.Default
    private Boolean thongBaoTrinhDuyet = true;

    // 4. Bảo mật
    @Column(name = "thoiGianHetPhien")
    @Builder.Default
    private Integer thoiGianHetPhien = 30;

    @Column(name = "soLanDangNhapSaiToiDa")
    @Builder.Default
    private Integer soLanDangNhapSaiToiDa = 5;

    @Column(name = "thoiHanMatKhau")
    @Builder.Default
    private Integer thoiHanMatKhau = 90;

    @Column(name = "xacThuc2YeuTo")
    @Builder.Default
    private Boolean xacThuc2YeuTo = false;

    // 5. Sao lưu
    @Column(name = "tuDongSaoLuu")
    @Builder.Default
    private Boolean tuDongSaoLuu = false;

    @Column(name = "tanSuatSaoLuu", length = 50)
    @Builder.Default
    private String tanSuatSaoLuu = "Hàng ngày";

    @Column(name = "ngayCapNhat")
    @Builder.Default
    private LocalDateTime ngayCapNhat = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (id == null) id = 1;
        ngayCapNhat = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }
}
