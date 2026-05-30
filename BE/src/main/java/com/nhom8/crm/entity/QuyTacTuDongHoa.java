package com.nhom8.crm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "QuyTacTuDongHoa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class QuyTacTuDongHoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maQuyTac")
    private Integer maQuyTac;

    @Column(name = "tenQuyTac", nullable = false, length = 200)
    private String tenQuyTac;

    @Column(name = "loaiQuyTac", nullable = false, length = 50)
    @Builder.Default
    private String loaiQuyTac = "Kịch bản";

    @Column(name = "moTa", length = 500)
    private String moTa;

    @Column(name = "dieuKienKichHoat", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String dieuKienKichHoat;

    @Column(name = "hanhDongThucHien", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    @Builder.Default
    private String hanhDongThucHien = "[]";

    @Column(name = "giaTriDiemThaydoi")
    private Integer giaTriDiemThaydoi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maMauThongDiep")
    @JsonIgnoreProperties({
            "nhanVienTao",
            "hibernateLazyInitializer",
            "handler"
    })
    private MauThongDiep mauThongDiep;

    @Column(name = "trangThaiQuyTac", nullable = false)
    @Builder.Default
    private Boolean trangThaiQuyTac = true;

    @Column(name = "soLanThucThi", nullable = false)
    @Builder.Default
    private Integer soLanThucThi = 0;

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
