package com.nhom8.crm.service;

import com.nhom8.crm.dto.request.DongBoAPIRequest;
import com.nhom8.crm.dto.response.LichSuDongBoResponse;
import com.nhom8.crm.entity.CauHinhDongBoAPI;
import com.nhom8.crm.entity.KhachHang;
import com.nhom8.crm.entity.LichSuDongBoAPI;
import com.nhom8.crm.entity.NguonKhachHang;
import com.nhom8.crm.repository.CauHinhDongBoAPIRepository;
import com.nhom8.crm.repository.KhachHangRepository;
import com.nhom8.crm.repository.LichSuDongBoAPIRepository;
import com.nhom8.crm.repository.NguonKhachHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DongBoAPIService {

    private final CauHinhDongBoAPIRepository cauHinhDongBoAPIRepository;
    private final LichSuDongBoAPIRepository lichSuDongBoAPIRepository;
    private final KhachHangRepository khachHangRepository;
    private final NguonKhachHangRepository nguonKhachHangRepository;

    @Transactional
    public void luuCauHinh(DongBoAPIRequest request) {
        validateRequest(request, false);

        CauHinhDongBoAPI cauHinh = cauHinhDongBoAPIRepository
                .findByLoaiNenTang(request.getLoaiNenTang())
                .orElse(new CauHinhDongBoAPI());

        cauHinh.setTenNenTang(request.getTenNenTang());
        cauHinh.setLoaiNenTang(request.getLoaiNenTang());
        cauHinh.setApiKey(trimToNull(request.getApiKey()));
        cauHinh.setWebhookUrl(trimToNull(request.getWebhookUrl()));
        cauHinh.setTrangThai(true);

        cauHinhDongBoAPIRepository.save(cauHinh);
    }

    @Transactional
    public void testKetNoi(DongBoAPIRequest request) {
        validateRequest(request, true);

        luuCauHinh(request);

        LichSuDongBoAPI lichSu = LichSuDongBoAPI.builder()
                .tenNenTang(request.getTenNenTang())
                .loaiNenTang(request.getLoaiNenTang())
                .soKhachHangMoi(0)
                .trangThai("Thành công")
                .ghiChu("Test kết nối thành công với " + request.getTenNenTang())
                .build();

        lichSuDongBoAPIRepository.save(lichSu);
    }

    @Transactional
    public void dongBo(DongBoAPIRequest request) {
        validateRequest(request, true);

        luuCauHinh(request);

        NguonKhachHang nguon = getOrCreateNguonKhachHang(request);

        String suffix = String.valueOf(System.currentTimeMillis() % 1_000_000_000);
        String email = buildDemoEmail(request.getLoaiNenTang(), suffix);
        String phone = buildDemoPhone(suffix);

        if (!khachHangRepository.findByEmailAndDaXoaFalse(email).isEmpty()
                || !khachHangRepository.findBySoDienThoaiAndDaXoaFalse(phone).isEmpty()) {
            LichSuDongBoAPI lichSuTrung = LichSuDongBoAPI.builder()
                    .tenNenTang(request.getTenNenTang())
                    .loaiNenTang(request.getLoaiNenTang())
                    .soKhachHangMoi(0)
                    .trangThai("Thành công")
                    .ghiChu("Không tạo khách hàng mới vì dữ liệu đã tồn tại.")
                    .build();

            lichSuDongBoAPIRepository.save(lichSuTrung);
            return;
        }

        KhachHang khachHang = KhachHang.builder()
                .hoTen("Lead Demo " + request.getTenNenTang())
                .email(email)
                .soDienThoai(phone)
                .congTy("Nguồn " + request.getTenNenTang())
                .chucVuTaiCongTy("Khách hàng tiềm năng")
                .trangThaiKhach("KH tiềm năng mới")
                .diemTiemNang(10)
                .soNgayDungThu(0)
                .trangThaiDungThu("Chưa dùng thử")
                .daXoa(false)
                .nguonKhachHang(nguon)
                .build();

        khachHangRepository.save(khachHang);

        LichSuDongBoAPI lichSu = LichSuDongBoAPI.builder()
                .tenNenTang(request.getTenNenTang())
                .loaiNenTang(request.getLoaiNenTang())
                .soKhachHangMoi(1)
                .trangThai("Thành công")
                .ghiChu("Đồng bộ thành công 1 khách hàng demo từ " + request.getTenNenTang())
                .build();

        lichSuDongBoAPIRepository.save(lichSu);
    }

    public List<LichSuDongBoResponse> getLichSu() {
        return lichSuDongBoAPIRepository.findTop20ByOrderByThoiGianDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private LichSuDongBoResponse toResponse(LichSuDongBoAPI item) {
        return LichSuDongBoResponse.builder()
                .maLichSuDongBo(item.getMaLichSuDongBo())
                .tenNenTang(item.getTenNenTang())
                .loaiNenTang(item.getLoaiNenTang())
                .soKhachHangMoi(item.getSoKhachHangMoi())
                .thoiGian(item.getThoiGian())
                .trangThai(item.getTrangThai())
                .ghiChu(item.getGhiChu())
                .build();
    }

    private NguonKhachHang getOrCreateNguonKhachHang(DongBoAPIRequest request) {
        String tenNguon = request.getTenNenTang();

        return nguonKhachHangRepository.findByTenNguon(tenNguon)
                .orElseGet(() -> {
                    NguonKhachHang nguon = NguonKhachHang.builder()
                            .tenNguon(tenNguon)
                            .moTa("Nguồn khách hàng đồng bộ từ " + tenNguon)
                            .loaiNguon(mapLoaiNguon(request.getLoaiNenTang()))
                            .build();

                    return nguonKhachHangRepository.save(nguon);
                });
    }

    private String mapLoaiNguon(String loaiNenTang) {
        if (loaiNenTang == null) {
            return "Khác";
        }

        String type = loaiNenTang.trim().toLowerCase();

        if (type.contains("facebook")) {
            return "Mạng xã hội";
        }

        if (type.contains("google")) {
            return "Website";
        }

        if (type.contains("webhook")) {
            return "Khác";
        }

        return "Khác";
    }

    private void validateRequest(DongBoAPIRequest request, boolean requireConnectionInfo) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu cấu hình không được để trống.");
        }

        if (isBlank(request.getTenNenTang())) {
            throw new IllegalArgumentException("Tên nền tảng không được để trống.");
        }

        if (isBlank(request.getLoaiNenTang())) {
            throw new IllegalArgumentException("Loại nền tảng không được để trống.");
        }

        if (!requireConnectionInfo) {
            return;
        }

        String type = request.getLoaiNenTang().trim().toLowerCase();

        if (type.contains("webhook")) {
            if (isBlank(request.getWebhookUrl())) {
                throw new IllegalArgumentException("Webhook URL không được để trống.");
            }
        } else {
            if (isBlank(request.getApiKey())) {
                throw new IllegalArgumentException("API Key / Token không được để trống.");
            }
        }
    }

    private String buildDemoEmail(String loaiNenTang, String suffix) {
        String type = loaiNenTang == null ? "api" : loaiNenTang.toLowerCase().replaceAll("[^a-z0-9]", "");
        if (type.isBlank()) {
            type = "api";
        }

        return type + "_lead_" + suffix + "@demo.vn";
    }

    private String buildDemoPhone(String suffix) {
        String digits = suffix.replaceAll("[^0-9]", "");

        if (digits.length() < 8) {
            digits = String.format("%08d", Integer.parseInt(digits));
        }

        if (digits.length() > 8) {
            digits = digits.substring(digits.length() - 8);
        }

        return "09" + digits;
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}