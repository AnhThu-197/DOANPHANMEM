package com.nhom8.crm.service;

import com.nhom8.crm.entity.KhachHang;
import java.util.List;

public interface KhachHangService {
    List<KhachHang> getAllKhachHangs();
    List<KhachHang> getActiveKhachHangs();
    KhachHang getKhachHangById(Integer id);
    KhachHang createKhachHang(KhachHang khachHang);
    KhachHang updateKhachHang(Integer id, KhachHang khachHang);
    void softDeleteKhachHang(Integer id, String lyDo);
    void deleteKhachHangPermanently(Integer id);
}
