package com.nhom8.crm.repository;

import com.nhom8.crm.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {
    
    // Tìm tài khoản theo email (dùng cho đăng nhập, check trùng)
    Optional<TaiKhoan> findByEmail(String email);
    
    // Kiểm tra email đã tồn tại hay chưa
    boolean existsByEmail(String email);
}
