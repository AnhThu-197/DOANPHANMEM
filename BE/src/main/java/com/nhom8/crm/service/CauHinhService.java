package com.nhom8.crm.service;

import com.nhom8.crm.dto.request.SystemConfigRequest;
import com.nhom8.crm.dto.response.SystemConfigResponse;
import org.springframework.web.multipart.MultipartFile;

public interface CauHinhService {
    SystemConfigResponse getConfig();
    SystemConfigResponse updateConfig(SystemConfigRequest request);
    byte[] executeManualBackup();
    void restoreData(MultipartFile file);
}
