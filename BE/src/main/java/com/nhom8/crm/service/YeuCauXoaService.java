package com.nhom8.crm.service;

import com.nhom8.crm.entity.KhachHang;
import com.nhom8.crm.entity.NhanVien;
import com.nhom8.crm.entity.YeuCauXoa;
import com.nhom8.crm.exception.ResourceNotFoundException;
import com.nhom8.crm.repository.KhachHangRepository;
import com.nhom8.crm.repository.NhanVienRepository;
import com.nhom8.crm.repository.YeuCauXoaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class YeuCauXoaService {

    private final YeuCauXoaRepository yeuCauXoaRepository;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienRepository nhanVienRepository;
    private final KhachHangService khachHangService;

    public List<YeuCauXoa> getAll() {
        return yeuCauXoaRepository.findAll();
    }

    @Transactional
    public YeuCauXoa submitRequest(Integer maKhachHang, Integer maNhanVien, String lyDo) {
        KhachHang kh = khachHangRepository.findById(maKhachHang)
                .filter(k -> !k.getDaXoa())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", maKhachHang));

        NhanVien nv = nhanVienRepository.findById(maNhanVien)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên", maNhanVien));

        // Check if there is already a pending delete request for this customer
        yeuCauXoaRepository.findByKhachHang_MaKhachHangAndTrangThai(maKhachHang, "Chờ duyệt")
                .ifPresent(req -> {
                    throw new IllegalStateException("Khách hàng này đã có đề nghị xóa đang chờ duyệt.");
                });

        YeuCauXoa req = YeuCauXoa.builder()
                .khachHang(kh)
                .nguoiYeuCau(nv)
                .lyDo(lyDo)
                .trangThai("Chờ duyệt")
                .ngayYeuCau(LocalDateTime.now())
                .build();

        return yeuCauXoaRepository.save(req);
    }

    @Transactional
    public YeuCauXoa approveRequest(Integer maYeuCau, Integer maNguoiDuyet) {
        YeuCauXoa req = yeuCauXoaRepository.findById(maYeuCau)
                .orElseThrow(() -> new ResourceNotFoundException("Yêu cầu xóa", maYeuCau));

        if (!"Chờ duyệt".equals(req.getTrangThai())) {
            throw new IllegalStateException("Yêu cầu này đã được xử lý (trạng thái: " + req.getTrangThai() + ").");
        }

        NhanVien nguoiDuyet = nhanVienRepository.findById(maNguoiDuyet)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên duyệt", maNguoiDuyet));

        // Perform soft delete on the customer
        khachHangService.softDelete(req.getKhachHang().getMaKhachHang(), req.getLyDo());

        req.setTrangThai("Đã duyệt");
        req.setNguoiDuyet(nguoiDuyet);
        req.setNgayDuyet(LocalDateTime.now());

        return yeuCauXoaRepository.save(req);
    }

    @Transactional
    public YeuCauXoa rejectRequest(Integer maYeuCau, Integer maNguoiDuyet, String lyDoTuChoi) {
        YeuCauXoa req = yeuCauXoaRepository.findById(maYeuCau)
                .orElseThrow(() -> new ResourceNotFoundException("Yêu cầu xóa", maYeuCau));

        if (!"Chờ duyệt".equals(req.getTrangThai())) {
            throw new IllegalStateException("Yêu cầu này đã được xử lý (trạng thái: " + req.getTrangThai() + ").");
        }

        NhanVien nguoiDuyet = nhanVienRepository.findById(maNguoiDuyet)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên duyệt", maNguoiDuyet));

        req.setTrangThai("Từ chối");
        req.setNguoiDuyet(nguoiDuyet);
        req.setNgayDuyet(LocalDateTime.now());
        req.setLyDoTuChoi(lyDoTuChoi);

        return yeuCauXoaRepository.save(req);
    }
}
