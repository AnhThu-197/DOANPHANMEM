package com.nhom8.crm.service;

import com.nhom8.crm.dto.request.ForgotPasswordRequest;
import com.nhom8.crm.dto.request.ResetPasswordRequest;
import com.nhom8.crm.dto.request.VerifyOtpRequest;
import com.nhom8.crm.entity.TaiKhoan;
import java.util.List;

public interface TaiKhoanService {
    List<TaiKhoan> getAllTaiKhoans();
    TaiKhoan getTaiKhoanById(Integer id);
    TaiKhoan createTaiKhoan(TaiKhoan taiKhoan);
    TaiKhoan updateTaiKhoan(Integer id, TaiKhoan taiKhoan);
    void deleteTaiKhoan(Integer id);
    void sendOtp(ForgotPasswordRequest request);
    void verifyOtp(VerifyOtpRequest request);
    void resetPassword(ResetPasswordRequest request);
}
