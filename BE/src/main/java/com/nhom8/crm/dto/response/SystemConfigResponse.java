package com.nhom8.crm.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemConfigResponse {
    private String companyName;
    private String email;
    private String phone;
    private String website;
    private String address;

    private String timezone;
    private String dateFormat;
    private String currency;
    private String language;

    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean browserNotifications;

    private Integer sessionTimeout;
    private Integer maxFailedAttempts;
    private Integer passwordExpiryDays;
    private Boolean twoFactorAuth;

    private Boolean autoBackup;
    private String backupFrequency;
    
    private LocalDateTime updatedAt;
}
