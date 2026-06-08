package com.nhom8.crm.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

/**
 * EmailService — KHÔNG dùng @Async để lỗi nổi lên rõ ràng khi debug.
 * Sau khi xác nhận email hoạt động, có thể thêm @Async lại.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    // ----------------------------------------------------------------
    // Core gửi email — đồng bộ, lỗi nổi lên rõ ràng
    // ----------------------------------------------------------------
    private void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        log.info("📧 Gửi email tới: [{}] | Tiêu đề: [{}]", toEmail, subject);
        log.info("📧 SMTP config: host=smtp.gmail.com, port=587, user={}", fromEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            log.info("📧 Đang kết nối SMTP và gửi...");
            mailSender.send(message);
            log.info("✅ Gửi email THÀNH CÔNG tới: {}", toEmail);

        } catch (org.springframework.mail.MailAuthenticationException e) {
            log.error("❌ LỖI XÁC THỰC SMTP: Sai username/password hoặc App Password hết hạn");
            log.error("   → Vào https://myaccount.google.com/apppasswords để tạo App Password mới");
            log.error("   Chi tiết: {}", e.getMessage());
            throw new RuntimeException("SMTP Authentication failed: " + e.getMessage(), e);

        } catch (org.springframework.mail.MailSendException e) {
            log.error("❌ LỖI GỬI EMAIL: {}", e.getMessage());
            log.error("   Chi tiết:", e);
            throw new RuntimeException("Mail send failed: " + e.getMessage(), e);

        } catch (Exception e) {
            log.error("❌ LỖI KHÔNG XÁC ĐỊNH khi gửi email: {} - {}", 
                      e.getClass().getSimpleName(), e.getMessage());
            log.error("   Chi tiết:", e);
            throw new RuntimeException("Email error: " + e.getMessage(), e);
        }
    }

    // ----------------------------------------------------------------
    // Gửi OTP
    // ----------------------------------------------------------------
    public void sendOtpEmail(String toEmail, String otp) {
        String html =
            "<!DOCTYPE html><html><head><meta charset='utf-8'><style>" +
            "body{font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px}" +
            ".box{max-width:480px;margin:0 auto;background:#fff;border-radius:10px;" +
            "border:1px solid #e2e8f0;padding:30px;text-align:center}" +
            ".otp{font-size:36px;font-weight:bold;color:#0284c7;letter-spacing:10px;" +
            "background:#f0f9ff;padding:16px;border-radius:8px;margin:20px 0;" +
            "font-family:monospace;border:2px dashed #0284c7}" +
            "</style></head><body>" +
            "<div class='box'>" +
            "<h2 style='color:#1e293b'>Ma OTP Xac Thuc</h2>" +
            "<p>Ma OTP dat lai mat khau cua ban:</p>" +
            "<div class='otp'>" + otp + "</div>" +
            "<p style='color:#64748b;font-size:13px'>Ma co hieu luc trong <b>5 phut</b>." +
            " Khong chia se ma nay cho bat ky ai.</p>" +
            "<hr style='border:none;border-top:1px solid #e2e8f0;margin:20px 0'/>" +
            "<p style='color:#94a3b8;font-size:12px'>He thong CRM Nhom 8</p>" +
            "</div></body></html>";

        sendHtmlEmail(toEmail, "[CRM Nhom 8] Ma OTP dat lai mat khau", html);
    }

    // ----------------------------------------------------------------
    // Gửi thông điệp marketing
    // ----------------------------------------------------------------
    public void sendEmail(String toEmail, String subject, String content) {
        String body = content
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\n", "<br/>");

        String html =
            "<!DOCTYPE html><html><head><meta charset='utf-8'><style>" +
            "body{font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px}" +
            ".box{max-width:560px;margin:0 auto;background:#fff;border-radius:10px;" +
            "border:1px solid #e2e8f0;overflow:hidden}" +
            ".hdr{background:#2b4856;padding:24px;text-align:center;color:#fff}" +
            ".hdr h1{margin:0;font-size:18px}" +
            ".body{padding:28px;color:#334155;font-size:15px;line-height:1.7}" +
            ".ftr{background:#f8fafc;padding:16px;text-align:center;font-size:12px;" +
            "color:#94a3b8;border-top:1px solid #e2e8f0}" +
            "</style></head><body>" +
            "<div class='box'>" +
            "<div class='hdr'><h1>" + subject + "</h1></div>" +
            "<div class='body'>" + body + "</div>" +
            "<div class='ftr'>Email tu he thong CRM Nhom 8 &copy; 2026</div>" +
            "</div></body></html>";

        sendHtmlEmail(toEmail, subject, html);
    }

    // ----------------------------------------------------------------
    // Gửi nhắc nhở
    // ----------------------------------------------------------------
    public void sendReminderEmail(String toEmail, String customerName, String reminderTitle) {
        String html =
            "<!DOCTYPE html><html><head><meta charset='utf-8'><style>" +
            "body{font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px}" +
            ".box{max-width:480px;margin:0 auto;background:#fff;border-radius:10px;" +
            "border:1px solid #e2e8f0;padding:30px}" +
            ".card{background:#fffbeb;border-left:4px solid #d97706;border-radius:6px;" +
            "padding:14px;margin:16px 0}" +
            "</style></head><body>" +
            "<div class='box'>" +
            "<h2 style='color:#1e293b'>Nhac Nho Cong Viec</h2>" +
            "<p>Ban co lich hen can xu ly:</p>" +
            "<div class='card'>" +
            "<b>" + reminderTitle + "</b><br/>" +
            "Khach hang: " + customerName +
            "</div>" +
            "<p style='color:#64748b;font-size:13px'>Vui long dang nhap CRM de xu ly.</p>" +
            "<hr style='border:none;border-top:1px solid #e2e8f0;margin:20px 0'/>" +
            "<p style='color:#94a3b8;font-size:12px'>He thong CRM Nhom 8</p>" +
            "</div></body></html>";

        sendHtmlEmail(toEmail, "[CRM] Nhac nho: " + reminderTitle, html);
    }

    // ----------------------------------------------------------------
    // Gửi email kích hoạt dùng thử
    // ----------------------------------------------------------------
    public void sendTrialActivationEmail(String toEmail, String customerName, int durationDays) {
        String html =
            "<!DOCTYPE html><html><head><meta charset='utf-8'><style>" +
            "body{font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px}" +
            ".box{max-width:520px;margin:0 auto;background:#fff;border-radius:10px;" +
            "border:1px solid #e2e8f0;padding:30px}" +
            ".hdr{text-align:center;color:#0284c7;margin-bottom:20px}" +
            ".badge{display:inline-block;background:#e0f2fe;color:#0369a1;" +
            "padding:6px 12px;border-radius:999px;font-weight:bold;font-size:14px}" +
            ".details{background:#f1f5f9;border-radius:8px;padding:20px;margin:20px 0}" +
            ".details table{width:100%;border-collapse:collapse}" +
            ".details td{padding:8px 0;font-size:14px;color:#334155}" +
            ".details td.lbl{font-weight:bold;width:140px;color:#475569}" +
            ".btn-box{text-align:center;margin-top:25px}" +
            ".btn{display:inline-block;background:#0284c7;color:#fff;padding:12px 24px;" +
            "text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px}" +
            "</style></head><body>" +
            "<div class='box'>" +
            "<div class='hdr'>" +
            "<h2 style='margin:0 0 10px 0;'>Kích Hoạt Dùng Thử Thành Công</h2>" +
            "<span class='badge'>Hệ thống CRM Nhóm 8</span>" +
            "</div>" +
            "<p>Kính chào quý khách <b>" + customerName + "</b>,</p>" +
            "<p>Yêu cầu đăng ký dùng thử phần mềm của quý khách đã được duyệt và kích hoạt thành công trên hệ thống. Dưới đây là thông tin chi tiết:</p>" +
            "<div class='details'>" +
            "<table>" +
            "<tr><td class='lbl'>Khách hàng:</td><td>" + customerName + "</td></tr>" +
            "<tr><td class='lbl'>Thời gian dùng thử:</td><td><b>" + durationDays + " ngày</b></td></tr>" +
            "<tr><td class='lbl'>Trạng thái:</td><td style='color:#16a34a;font-weight:bold'>Đang dùng thử</td></tr>" +
            "</table>" +
            "</div>" +
            "<p>Trong quá trình dùng thử, nếu quý khách cần bất kỳ sự hỗ trợ nào về tính năng hoặc giải pháp, vui lòng liên hệ nhân viên phụ trách hoặc phản hồi lại email này.</p>" +
            "<div class='btn-box'>" +
            "<a href='#' class='btn'>Truy cập hệ thống CRM</a>" +
            "</div>" +
            "<hr style='border:none;border-top:1px solid #e2e8f0;margin:35px 0 20px 0'/>" +
            "<p style='color:#94a3b8;font-size:12px;text-align:center'>Email được gửi tự động từ hệ thống CRM Nhóm 8 &copy; 2026</p>" +
            "</div></body></html>";

        sendHtmlEmail(toEmail, "[CRM] Kich hoat dung thu phan mem thanh cong", html);
    }

    // ----------------------------------------------------------------
    // Gửi email gia hạn dùng thử
    // ----------------------------------------------------------------
    public void sendTrialExtensionEmail(String toEmail, String customerName, int newDurationDays) {
        String html =
            "<!DOCTYPE html><html><head><meta charset='utf-8'><style>" +
            "body{font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px}" +
            ".box{max-width:520px;margin:0 auto;background:#fff;border-radius:10px;" +
            "border:1px solid #e2e8f0;padding:30px}" +
            ".hdr{text-align:center;color:#0284c7;margin-bottom:20px}" +
            ".badge{display:inline-block;background:#e0f2fe;color:#0369a1;" +
            "padding:6px 12px;border-radius:999px;font-weight:bold;font-size:14px}" +
            ".details{background:#f1f5f9;border-radius:8px;padding:20px;margin:20px 0}" +
            ".details table{width:100%;border-collapse:collapse}" +
            ".details td{padding:8px 0;font-size:14px;color:#334155}" +
            ".details td.lbl{font-weight:bold;width:140px;color:#475569}" +
            ".btn-box{text-align:center;margin-top:25px}" +
            ".btn{display:inline-block;background:#0284c7;color:#fff;padding:12px 24px;" +
            "text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px}" +
            "</style></head><body>" +
            "<div class='box'>" +
            "<div class='hdr'>" +
            "<h2 style='margin:0 0 10px 0;'>Gia Hạn Dùng Thử Thành Công</h2>" +
            "<span class='badge'>Hệ thống CRM Nhóm 8</span>" +
            "</div>" +
            "<p>Kính chào quý khách <b>" + customerName + "</b>,</p>" +
            "<p>Thời gian dùng thử phần mềm của quý khách đã được gia hạn thành công. Dưới đây là thông tin gia hạn chi tiết:</p>" +
            "<div class='details'>" +
            "<table>" +
            "<tr><td class='lbl'>Khách hàng:</td><td>" + customerName + "</td></tr>" +
            "<tr><td class='lbl'>Thời gian dùng thử mới:</td><td><b>" + newDurationDays + " ngày</b></td></tr>" +
            "<tr><td class='lbl'>Trạng thái:</td><td style='color:#0284c7;font-weight:bold'>Đã gia hạn</td></tr>" +
            "</table>" +
            "</div>" +
            "<p>Nếu quý khách cần hỗ trợ thêm thông tin hoặc tư vấn giải pháp, vui lòng liên hệ nhân viên phụ trách hoặc phản hồi lại email này.</p>" +
            "<div class='btn-box'>" +
            "<a href='#' class='btn'>Truy cập hệ thống CRM</a>" +
            "</div>" +
            "<hr style='border:none;border-top:1px solid #e2e8f0;margin:35px 0 20px 0'/>" +
            "<p style='color:#94a3b8;font-size:12px;text-align:center'>Email được gửi tự động từ hệ thống CRM Nhóm 8 &copy; 2026</p>" +
            "</div></body></html>";

        sendHtmlEmail(toEmail, "[CRM] Gia han dung thu phan mem thanh cong", html);
    }
}
