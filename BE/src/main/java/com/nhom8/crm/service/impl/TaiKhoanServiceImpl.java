package com.nhom8.crm.service.impl;

import com.nhom8.crm.entity.TaiKhoan;
import com.nhom8.crm.exception.ResourceNotFoundException;
import com.nhom8.crm.repository.TaiKhoanRepository;
import com.nhom8.crm.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaiKhoanServiceImpl implements TaiKhoanService {

    private final TaiKhoanRepository taiKhoanRepository;

    @Autowired
    public TaiKhoanServiceImpl(TaiKhoanRepository taiKhoanRepository) {
        this.taiKhoanRepository = taiKhoanRepository;
    }

    @Override
    public List<TaiKhoan> getAllTaiKhoans() {
        return taiKhoanRepository.findAll();
    }

    @Override
    public TaiKhoan getTaiKhoanById(Integer id) {
        return taiKhoanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với mã: " + id));
    }

    @Override
    public TaiKhoan createTaiKhoan(TaiKhoan taiKhoan) {
        if (taiKhoanRepository.existsByEmail(taiKhoan.getEmail())) {
            throw new IllegalArgumentException("Email này đã tồn tại trong hệ thống!");
        }
        taiKhoan.setNgayTao(LocalDateTime.now());
        taiKhoan.setNgayCapNhat(LocalDateTime.now());
        return taiKhoanRepository.save(taiKhoan);
    }

    @Override
    public TaiKhoan updateTaiKhoan(Integer id, TaiKhoan updateInfo) {
        TaiKhoan existing = getTaiKhoanById(id);
        
        // Cập nhật các trường
        existing.setMaVaiTro(updateInfo.getMaVaiTro());
        existing.setTrangThai(updateInfo.getTrangThai());
        existing.setNgayCapNhat(LocalDateTime.now());
        
        // Mật khẩu chỉ cập nhật nếu có thay đổi và không rỗng
        if (updateInfo.getMatKhau() != null && !updateInfo.getMatKhau().trim().isEmpty()) {
            existing.setMatKhau(updateInfo.getMatKhau());
        }

        return taiKhoanRepository.save(existing);
    }

    @Override
    public void deleteTaiKhoan(Integer id) {
        TaiKhoan existing = getTaiKhoanById(id);
        taiKhoanRepository.delete(existing);
    }
}
