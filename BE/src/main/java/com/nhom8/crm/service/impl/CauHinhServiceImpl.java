package com.nhom8.crm.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.nhom8.crm.dto.request.SystemConfigRequest;
import com.nhom8.crm.dto.response.SystemConfigResponse;
import com.nhom8.crm.entity.*;
import com.nhom8.crm.repository.*;
import com.nhom8.crm.service.CauHinhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CauHinhServiceImpl implements CauHinhService {

    private final CauHinhRepository repository;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienRepository nhanVienRepository;
    private final NhacNhoRepository nhacNhoRepository;
    private final MauThongDiepRepository mauThongDiepRepository;
    private final LichSuTuongTacRepository interactionRepository;

    @Autowired
    public CauHinhServiceImpl(CauHinhRepository repository,
                               KhachHangRepository khachHangRepository,
                               NhanVienRepository nhanVienRepository,
                               NhacNhoRepository nhacNhoRepository,
                               MauThongDiepRepository mauThongDiepRepository,
                               LichSuTuongTacRepository interactionRepository) {
        this.repository = repository;
        this.khachHangRepository = khachHangRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.nhacNhoRepository = nhacNhoRepository;
        this.mauThongDiepRepository = mauThongDiepRepository;
        this.interactionRepository = interactionRepository;
    }

    @Override
    @Transactional
    public SystemConfigResponse getConfig() {
        CauHinhHeThong entity = repository.findById(1).orElseGet(() -> {
            CauHinhHeThong defaults = CauHinhHeThong.builder().id(1).build();
            return repository.save(defaults);
        });
        return convertToResponse(entity);
    }

    @Override
    @Transactional
    public SystemConfigResponse updateConfig(SystemConfigRequest request) {
        CauHinhHeThong entity = repository.findById(1).orElseGet(() -> 
            CauHinhHeThong.builder().id(1).build()
        );

        if (request.getCompanyName() != null) entity.setTenCongTy(request.getCompanyName());
        if (request.getEmail() != null) entity.setEmailCongTy(request.getEmail());
        if (request.getPhone() != null) entity.setSoDienThoaiCongTy(request.getPhone());
        if (request.getWebsite() != null) entity.setWebsiteCongTy(request.getWebsite());
        if (request.getAddress() != null) entity.setDiaChiCongTy(request.getAddress());

        if (request.getTimezone() != null) entity.setMuiGio(request.getTimezone());
        if (request.getDateFormat() != null) entity.setDinhDangNgay(request.getDateFormat());
        if (request.getCurrency() != null) entity.setDonViTienTe(request.getCurrency());
        if (request.getLanguage() != null) entity.setNgonNgu(request.getLanguage());

        if (request.getEmailNotifications() != null) entity.setThongBaoEmail(request.getEmailNotifications());
        if (request.getSmsNotifications() != null) entity.setThongBaoSms(request.getSmsNotifications());
        if (request.getBrowserNotifications() != null) entity.setThongBaoTrinhDuyet(request.getBrowserNotifications());

        if (request.getSessionTimeout() != null) entity.setThoiGianHetPhien(request.getSessionTimeout());
        if (request.getMaxFailedAttempts() != null) entity.setSoLanDangNhapSaiToiDa(request.getMaxFailedAttempts());
        if (request.getPasswordExpiryDays() != null) entity.setThoiHanMatKhau(request.getPasswordExpiryDays());
        if (request.getTwoFactorAuth() != null) entity.setXacThuc2YeuTo(request.getTwoFactorAuth());

        if (request.getAutoBackup() != null) entity.setTuDongSaoLuu(request.getAutoBackup());
        if (request.getBackupFrequency() != null) entity.setTanSuatSaoLuu(request.getBackupFrequency());

        entity.setNgayCapNhat(LocalDateTime.now());
        CauHinhHeThong saved = repository.save(entity);

        return convertToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] executeManualBackup() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            Map<String, Object> dbBackup = new HashMap<>();
            
            // Backup configurations
            dbBackup.put("system_config", repository.findAll());
            // Backup clients & employees
            dbBackup.put("employees", nhanVienRepository.findAll());
            dbBackup.put("customers", khachHangRepository.findAll());
            // Backup templates
            dbBackup.put("templates", mauThongDiepRepository.findAll());
            // Backup interactions & appointments
            dbBackup.put("interactions", interactionRepository.findAll());
            dbBackup.put("appointments", nhacNhoRepository.findAll());

            String jsonString = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(dbBackup);
            return jsonString.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo bản sao lưu hệ thống: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void restoreData(MultipartFile file) {
        try {
            String jsonContent = new String(file.getBytes(), StandardCharsets.UTF_8);
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            Map<String, Object> dbBackup = mapper.readValue(jsonContent, Map.class);
            if (dbBackup == null || !dbBackup.containsKey("system_config")) {
                throw new IllegalArgumentException("Định dạng tệp sao lưu không hợp lệ!");
            }

            // Thực hiện ghi nhận nhật ký khôi phục hoặc khôi phục dữ liệu cấu hình
            // Để an toàn, chúng ta khôi phục cấu hình hệ thống
            List<?> configsRaw = (List<?>) dbBackup.get("system_config");
            if (configsRaw != null && !configsRaw.isEmpty()) {
                String configJson = mapper.writeValueAsString(configsRaw.get(0));
                CauHinhHeThong restoredConfig = mapper.readValue(configJson, CauHinhHeThong.class);
                restoredConfig.setId(1);
                restoredConfig.setNgayCapNhat(LocalDateTime.now());
                repository.save(restoredConfig);
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khôi phục dữ liệu từ bản sao lưu: " + e.getMessage(), e);
        }
    }

    private SystemConfigResponse convertToResponse(CauHinhHeThong entity) {
        return SystemConfigResponse.builder()
                .companyName(entity.getTenCongTy())
                .email(entity.getEmailCongTy())
                .phone(entity.getSoDienThoaiCongTy())
                .website(entity.getWebsiteCongTy())
                .address(entity.getDiaChiCongTy())
                .timezone(entity.getMuiGio())
                .dateFormat(entity.getDinhDangNgay())
                .currency(entity.getDonViTienTe())
                .language(entity.getNgonNgu())
                .emailNotifications(entity.getThongBaoEmail())
                .smsNotifications(entity.getThongBaoSms())
                .browserNotifications(entity.getThongBaoTrinhDuyet())
                .sessionTimeout(entity.getThoiGianHetPhien())
                .maxFailedAttempts(entity.getSoLanDangNhapSaiToiDa())
                .passwordExpiryDays(entity.getThoiHanMatKhau())
                .twoFactorAuth(entity.getXacThuc2YeuTo())
                .autoBackup(entity.getTuDongSaoLuu())
                .backupFrequency(entity.getTanSuatSaoLuu())
                .updatedAt(entity.getNgayCapNhat())
                .build();
    }
}
