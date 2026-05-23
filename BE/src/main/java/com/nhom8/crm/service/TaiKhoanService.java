package com.nhom8.crm.service;

import com.nhom8.crm.entity.TaiKhoan;
import java.util.List;

public interface TaiKhoanService {
    List<TaiKhoan> getAllTaiKhoans();
    TaiKhoan getTaiKhoanById(Integer id);
    TaiKhoan createTaiKhoan(TaiKhoan taiKhoan);
    TaiKhoan updateTaiKhoan(Integer id, TaiKhoan taiKhoan);
    void deleteTaiKhoan(Integer id);
}
