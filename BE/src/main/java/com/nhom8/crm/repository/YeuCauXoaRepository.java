package com.nhom8.crm.repository;

import com.nhom8.crm.entity.YeuCauXoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface YeuCauXoaRepository extends JpaRepository<YeuCauXoa, Integer> {
    List<YeuCauXoa> findByTrangThai(String trangThai);
    Optional<YeuCauXoa> findByKhachHang_MaKhachHangAndTrangThai(Integer maKhachHang, String trangThai);
}
