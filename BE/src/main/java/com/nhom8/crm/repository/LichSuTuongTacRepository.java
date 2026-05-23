package com.nhom8.crm.repository;

import com.nhom8.crm.entity.LichSuTuongTac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuTuongTacRepository extends JpaRepository<LichSuTuongTac, Integer> {

    // Lấy lịch sử tương tác của 1 khách hàng cụ thể, sắp xếp từ mới nhất đến cũ nhất
    List<LichSuTuongTac> findByKhachHangMaKhachHangOrderByThoiGianTaoDesc(Integer maKhachHang);

    // Lấy lịch sử tương tác do 1 nhân viên cụ thể thực hiện
    List<LichSuTuongTac> findByNhanVienMaNhanVienOrderByThoiGianTaoDesc(Integer maNhanVien);

    // Lấy tất cả tương tác, sắp xếp theo thời gian mới nhất
    List<LichSuTuongTac> findAllByOrderByThoiGianTaoDesc();
}
