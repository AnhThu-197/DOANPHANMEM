package com.nhom8.crm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "YeuCauXoa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class YeuCauXoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maYeuCau")
    private Integer maYeuCau;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maKhachHang", nullable = false)
    @JsonIgnoreProperties({"nguoiPhuTrach", "nganhNghe", "nguonKhachHang", "phuongXa", "hibernateLazyInitializer", "handler"})
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiYeuCau", nullable = false)
    @JsonIgnoreProperties({"taiKhoan", "phuongXa", "hibernateLazyInitializer", "handler"})
    private NhanVien nguoiYeuCau;

    @Column(name = "lyDo", nullable = false, length = 500)
    private String lyDo;

    @Column(name = "ngayYeuCau")
    @Builder.Default
    private LocalDateTime ngayYeuCau = LocalDateTime.now();

    @Column(name = "trangThai", nullable = false, length = 50)
    @Builder.Default
    private String trangThai = "Chờ duyệt";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNguoiDuyet")
    @JsonIgnoreProperties({"taiKhoan", "phuongXa", "hibernateLazyInitializer", "handler"})
    private NhanVien nguoiDuyet;

    @Column(name = "ngayDuyet")
    private LocalDateTime ngayDuyet;

    @Column(name = "lyDoTuChoi", length = 500)
    private String lyDoTuChoi;

    @PrePersist
    protected void onCreate() {
        if (ngayYeuCau == null) {
            ngayYeuCau = LocalDateTime.now();
        }
        if (trangThai == null) {
            trangThai = "Chờ duyệt";
        }
    }
}
