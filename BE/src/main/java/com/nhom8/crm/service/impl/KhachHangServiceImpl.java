package com.nhom8.crm.service.impl;

import com.nhom8.crm.entity.KhachHang;
import com.nhom8.crm.exception.ResourceNotFoundException;
import com.nhom8.crm.repository.KhachHangRepository;
import com.nhom8.crm.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KhachHangServiceImpl implements KhachHangService {

    private final KhachHangRepository khachHangRepository;

    @Autowired
    public KhachHangServiceImpl(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    @Override
    public List<KhachHang> getAllKhachHangs() {
        return khachHangRepository.findAll();
    }

    @Override
    public List<KhachHang> getActiveKhachHangs() {
        return khachHangRepository.findByDaXoaFalse();
    }

    @Override
    public KhachHang getKhachHangById(Integer id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng với mã: " + id));
    }

    @Override
    public KhachHang createKhachHang(KhachHang khachHang) {
        if (khachHangRepository.existsByEmail(khachHang.getEmail())) {
            throw new IllegalArgumentException("Email khách hàng này đã tồn tại!");
        }
        if (khachHangRepository.existsBySoDienThoai(khachHang.getSoDienThoai())) {
            throw new IllegalArgumentException("Số điện thoại khách hàng này đã tồn tại!");
        }
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgayCapNhat(LocalDateTime.now());
        khachHang.setDaXoa(false);
        return khachHangRepository.save(khachHang);
    }

    @Override
    public KhachHang updateKhachHang(Integer id, KhachHang updateInfo) {
        KhachHang existing = getKhachHangById(id);

        existing.setHoTen(updateInfo.getHoTen());
        existing.setGioiTinh(updateInfo.getGioiTinh());
        existing.setNgaySinh(updateInfo.getNgaySinh());
        existing.setCongTy(updateInfo.getCongTy());
        existing.setChucVuTaiCongTy(updateInfo.getChucVuTaiCongTy());
        existing.setWebsiteCongTy(updateInfo.getWebsiteCongTy());
        existing.setDiaChiChiTiet(updateInfo.getDiaChiChiTiet());
        existing.setTrangThaiKhach(updateInfo.getTrangThaiKhach());
        existing.setDiemTiemNang(updateInfo.getDiemTiemNang());
        existing.setTrangThaiDungThu(updateInfo.getTrangThaiDungThu());
        existing.setNgayCapNhat(LocalDateTime.now());

        return khachHangRepository.save(existing);
    }

    @Override
    public void softDeleteKhachHang(Integer id, String lyDo) {
        KhachHang existing = getKhachHangById(id);
        existing.setDaXoa(true);
        existing.setLyDoXoa(lyDo);
        existing.setNgayXoa(LocalDateTime.now());
        existing.setNgayCapNhat(LocalDateTime.now());
        khachHangRepository.save(existing);
    }

    @Override
    public void deleteKhachHangPermanently(Integer id) {
        KhachHang existing = getKhachHangById(id);
        khachHangRepository.delete(existing);
    }
}
