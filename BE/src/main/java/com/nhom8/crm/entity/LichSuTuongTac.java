package com.nhom8.crm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "LichSuTuongTac")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LichSuTuongTac {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maTuongTac")
    private Integer maTuongTac;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maKhachHang", nullable = false)
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNhanVien")
    private NhanVien nhanVien;

    @Column(name = "loaiTuongTac", nullable = false, length = 50)
    private String loaiTuongTac;

    @Column(name = "tieuDe", length = 200)
    private String tieuDe;

    @Column(name = "noiDung", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String noiDung;

    @Column(name = "kenhLienLac", length = 50)
    private String kenhLienLac;

    @Column(name = "ketQua", length = 50)
    private String ketQua;

    @Column(name = "thoiGianTao")
    private LocalDateTime thoiGianTao;

    @Column(name = "ngayCapNhat")
    private LocalDateTime ngayCapNhat;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "LichSuTuongTac_TepDinhKem",
            joinColumns = @JoinColumn(name = "maTuongTac"),
            inverseJoinColumns = @JoinColumn(name = "maTep")
    )
    @Builder.Default
    private Set<TepDinhKem> tepDinhKems = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        thoiGianTao = LocalDateTime.now();
        ngayCapNhat = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }
}