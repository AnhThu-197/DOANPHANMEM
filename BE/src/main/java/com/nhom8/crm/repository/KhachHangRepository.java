package com.nhom8.crm.repository;

import com.nhom8.crm.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {

    // Tìm các khách hàng chưa bị xóa
    List<KhachHang> findByDaXoaFalse();

    // Tìm khách hàng theo email
    Optional<KhachHang> findByEmail(String email);

    // Tìm khách hàng theo số điện thoại
    Optional<KhachHang> findBySoDienThoai(String soDienThoai);

    // Kiểm tra trùng lặp email hoặc SĐT
    boolean existsByEmail(String email);
    boolean existsBySoDienThoai(String soDienThoai);
}
