// ============================================
// CÀI ĐẶT HỆ THỐNG (ĐÃ ĐỒNG BỘ backend API)
// ============================================

async function loadSettings() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <h2 class="page-title">Cấu hình Hệ thống</h2>
        <div id="settingsLoading" style="text-align: center; padding: 40px; color: #71717a;">
            <i class="fas fa-spinner fa-spin" style="font-size: 32px; margin-bottom: 10px;"></i>
            <p>Đang tải cấu hình hệ thống từ máy chủ...</p>
        </div>
    `;

    const isApiSession = typeof AUTH !== 'undefined' && AUTH.getCurrentUser()?.authSource === 'api';

    if (isApiSession) {
        try {
            const config = await API_SERVICES.cauhinh.get();
            // Ánh xạ các thuộc tính từ DTO của Backend sang định dạng DATA.systemSettings của FE
            DATA.systemSettings = {
                companyName: config.companyName || 'CÔNG TY CRM',
                companyEmail: config.email || 'contact@crm.com',
                companyPhone: config.phone || '0123456789',
                companyWebsite: config.website || '',
                companyAddress: config.address || '123 Đường ABC, Quận 1, TP.HCM',
                timezone: config.timezone || 'Asia/Ho_Chi_Minh',
                dateFormat: config.dateFormat || 'DD/MM/YYYY',
                currency: config.currency || 'VND',
                language: config.language || 'vi',
                emailNotifications: config.emailNotifications !== false,
                smsNotifications: config.smsNotifications === true,
                browserNotifications: config.browserNotifications !== false,
                autoBackup: config.autoBackup === true,
                backupFrequency: config.backupFrequency || 'daily',
                sessionTimeout: config.sessionTimeout || 30,
                maxLoginAttempts: config.maxFailedAttempts || 5,
                passwordExpiry: config.passwordExpiryDays || 90,
                require2FA: config.twoFactorAuth === true
            };
        } catch (error) {
            console.error('Lỗi lấy cấu hình hệ thống từ Backend:', error);
            // Sẽ tự động dùng dữ liệu mặc định bên dưới nếu gặp lỗi API
        }
    }

    if (!DATA.systemSettings) {
        DATA.systemSettings = {
            companyName: 'CÔNG TY CRM', companyEmail: 'contact@crm.com',
            companyPhone: '0123456789', companyWebsite: '', companyAddress: '123 Đường ABC, Quận 1, TP.HCM',
            timezone: 'Asia/Ho_Chi_Minh', dateFormat: 'DD/MM/YYYY',
            currency: 'VND', language: 'vi',
            emailNotifications: true, smsNotifications: false, browserNotifications: true,
            autoBackup: true, backupFrequency: 'daily',
            sessionTimeout: 30, maxLoginAttempts: 5, passwordExpiry: 90, require2FA: false
        };
    }

    const s = DATA.systemSettings;

    mainContent.innerHTML = `
        <h2 class="page-title">Cấu hình Hệ thống</h2>
        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab('settings-general')">Thông tin Công ty</button>
            <button class="tab-btn" onclick="switchTab('settings-system')">Hệ thống</button>
            <button class="tab-btn" onclick="switchTab('settings-notifications')">Thông báo</button>
            <button class="tab-btn" onclick="switchTab('settings-security')">Bảo mật</button>
            <button class="tab-btn" onclick="switchTab('settings-backup')">Sao lưu</button>
        </div>

        <div id="settings-general" class="tab-content active">
            <div style="background: white; padding: 30px; border-radius: 8px;">
                <h3 style="margin-bottom: 20px; color: #2B4856;"><i class="fas fa-building"></i> Thông tin Công ty</h3>
                <form id="companyInfoForm" onsubmit="saveCompanyInfo(event)">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group"><label>Tên công ty *</label><input type="text" id="companyName" value="${s.companyName}" required></div>
                        <div class="form-group"><label>Email *</label><input type="email" id="companyEmail" value="${s.companyEmail}" required></div>
                        <div class="form-group"><label>Số điện thoại *</label><input type="tel" id="companyPhone" value="${s.companyPhone}" required></div>
                        <div class="form-group"><label>Website</label><input type="url" id="companyWebsite" value="${s.companyWebsite || ''}" placeholder="https://example.com"></div>
                    </div>
                    <div class="form-group"><label>Địa chỉ *</label><textarea id="companyAddress" rows="2" required>${s.companyAddress}</textarea></div>
                    <div class="form-actions"><button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu thay đổi</button></div>
                </form>
            </div>
        </div>

        <div id="settings-system" class="tab-content">
            <div style="background: white; padding: 30px; border-radius: 8px;">
                <h3 style="margin-bottom: 20px; color: #2B4856;"><i class="fas fa-cog"></i> Cài đặt Hệ thống</h3>
                <form id="systemSettingsForm" onsubmit="saveSystemSettings(event)">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label>Múi giờ</label>
                            <select id="timezone">
                                <option value="Asia/Ho_Chi_Minh" ${s.timezone === 'Asia/Ho_Chi_Minh' ? 'selected' : ''}>Việt Nam (GMT+7)</option>
                                <option value="Asia/Singapore" ${s.timezone === 'Asia/Singapore' ? 'selected' : ''}>Singapore (GMT+8)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Định dạng ngày</label>
                            <select id="dateFormat">
                                <option value="DD/MM/YYYY" ${s.dateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY" ${s.dateFormat === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD" ${s.dateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Đơn vị tiền tệ</label>
                            <select id="currency">
                                <option value="VND" ${s.currency === 'VND' ? 'selected' : ''}>VND (₫)</option>
                                <option value="USD" ${s.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ngôn ngữ</label>
                            <select id="language">
                                <option value="vi" ${s.language === 'vi' ? 'selected' : ''}>Tiếng Việt</option>
                                <option value="en" ${s.language === 'en' ? 'selected' : ''}>English</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions"><button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu thay đổi</button></div>
                </form>
            </div>
        </div>

        <div id="settings-notifications" class="tab-content">
            <div style="background: white; padding: 30px; border-radius: 8px;">
                <h3 style="margin-bottom: 20px; color: #2B4856;"><i class="fas fa-bell"></i> Cài đặt Thông báo</h3>
                <form id="notificationSettingsForm" onsubmit="saveNotificationSettings(event)">
                    <div style="display: grid; gap: 20px;">
                        ${[
                            { id: 'emailNotifications', label: 'Thông báo Email', desc: 'Gửi thông báo qua email khi có sự kiện quan trọng', checked: s.emailNotifications },
                            { id: 'smsNotifications', label: 'Thông báo SMS', desc: 'Gửi thông báo qua SMS (cần cấu hình SMS Gateway)', checked: s.smsNotifications },
                            { id: 'browserNotifications', label: 'Thông báo Trình duyệt', desc: 'Hiển thị thông báo trên trình duyệt', checked: s.browserNotifications !== false }
                        ].map(n => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 8px;">
                                <div>
                                    <strong style="display: block; margin-bottom: 5px;">${n.label}</strong>
                                    <small style="color: #64748b;">${n.desc}</small>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="${n.id}" ${n.checked ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                    <div class="form-actions" style="margin-top: 20px;"><button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu thay đổi</button></div>
                </form>
            </div>
        </div>

        <div id="settings-security" class="tab-content">
            <div style="background: white; padding: 30px; border-radius: 8px;">
                <h3 style="margin-bottom: 20px; color: #2B4856;"><i class="fas fa-shield-alt"></i> Cài đặt Bảo mật</h3>
                <form id="securitySettingsForm" onsubmit="saveSecuritySettings(event)">
                    <div style="display: grid; gap: 20px;">
                        <div class="form-group"><label>Thời gian hết phiên (phút)</label><input type="number" id="sessionTimeout" value="${s.sessionTimeout}" min="5" max="120"></div>
                        <div class="form-group"><label>Số lần đăng nhập sai tối đa</label><input type="number" id="maxLoginAttempts" value="${s.maxLoginAttempts}" min="3" max="10"></div>
                        <div class="form-group"><label>Thời hạn mật khẩu (ngày)</label><input type="number" id="passwordExpiry" value="${s.passwordExpiry}" min="0" max="365"></div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 8px;">
                            <div>
                                <strong style="display: block; margin-bottom: 5px;">Xác thực 2 yếu tố (2FA)</strong>
                                <small style="color: #64748b;">Bật xác thực 2 lớp cho tất cả người dùng</small>
                            </div>
                            <label class="switch"><input type="checkbox" id="require2FA" ${s.require2FA ? 'checked' : ''}><span class="slider"></span></label>
                        </div>
                    </div>
                    <div class="form-actions" style="margin-top: 20px;"><button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu thay đổi</button></div>
                </form>
            </div>
        </div>

        <div id="settings-backup" class="tab-content">
            <div style="background: white; padding: 30px; border-radius: 8px;">
                <h3 style="margin-bottom: 20px; color: #2B4856;"><i class="fas fa-database"></i> Sao lưu & Khôi phục</h3>
                <form id="backupSettingsForm" onsubmit="saveBackupSettings(event)">
                    <div style="display: grid; gap: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 8px;">
                            <div>
                                <strong style="display: block; margin-bottom: 5px;">Tự động sao lưu</strong>
                                <small style="color: #64748b;">Tự động sao lưu dữ liệu theo lịch</small>
                            </div>
                            <label class="switch"><input type="checkbox" id="autoBackup" ${s.autoBackup ? 'checked' : ''}><span class="slider"></span></label>
                        </div>
                        <div class="form-group">
                            <label>Tần suất sao lưu</label>
                            <select id="backupFrequency">
                                <option value="hourly"  ${s.backupFrequency === 'hourly'  ? 'selected' : ''}>Mỗi giờ</option>
                                <option value="daily"   ${s.backupFrequency === 'daily'   ? 'selected' : ''}>Hàng ngày</option>
                                <option value="weekly"  ${s.backupFrequency === 'weekly'  ? 'selected' : ''}>Hàng tuần</option>
                                <option value="monthly" ${s.backupFrequency === 'monthly' ? 'selected' : ''}>Hàng tháng</option>
                            </select>
                        </div>
                        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                            <h4 style="margin-bottom: 15px; color: #1e40af;">Sao lưu dữ liệu hệ thống</h4>
                            <button type="button" class="btn btn-primary" onclick="createBackup()"><i class="fas fa-download"></i> Tạo và tải bản sao lưu</button>
                        </div>
                        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                            <h4 style="margin-bottom: 15px; color: #92400e;">Khôi phục dữ liệu hệ thống</h4>
                            <input type="file" id="restoreFile" accept=".json" style="margin-bottom: 10px;">
                            <button type="button" class="btn btn-secondary" onclick="restoreBackup()"><i class="fas fa-upload"></i> Khôi phục dữ liệu</button>
                        </div>
                    </div>
                    <div class="form-actions" style="margin-top: 20px;"><button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu cấu hình sao lưu</button></div>
                </form>
            </div>
        </div>
    `;
}

// ---- Helpers đồng bộ hóa dữ liệu lên Backend ----

async function saveAllSettingsToBackend() {
    const isApiSession = typeof AUTH !== 'undefined' && AUTH.getCurrentUser()?.authSource === 'api';
    if (!isApiSession) return true;

    const s = DATA.systemSettings;
    const payload = {
        companyName: s.companyName,
        email: s.companyEmail,
        phone: s.companyPhone,
        website: s.companyWebsite,
        address: s.companyAddress,
        timezone: s.timezone,
        dateFormat: s.dateFormat,
        currency: s.currency,
        language: s.language,
        emailNotifications: s.emailNotifications,
        smsNotifications: s.smsNotifications,
        browserNotifications: s.browserNotifications,
        sessionTimeout: s.sessionTimeout,
        maxFailedAttempts: s.maxLoginAttempts,
        passwordExpiryDays: s.passwordExpiry,
        twoFactorAuth: s.require2FA,
        autoBackup: s.autoBackup,
        backupFrequency: s.backupFrequency
    };

    try {
        await API_SERVICES.cauhinh.update(payload);
        return true;
    } catch (err) {
        console.error('Lỗi khi đồng bộ cấu hình lên máy chủ:', err);
        alert('❌ Lưu cấu hình lên máy chủ thất bại: ' + (err.message || 'Lỗi hệ thống'));
        return false;
    }
}

// ---- Form handlers (từ settings-handlers.js) ----

async function saveCompanyInfo(event) {
    event.preventDefault();
    const saveBtn = event.target.querySelector('button[type="submit"]');
    const origHtml = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

    DATA.systemSettings.companyName    = document.getElementById('companyName').value.trim();
    DATA.systemSettings.companyEmail   = document.getElementById('companyEmail').value.trim();
    DATA.systemSettings.companyPhone   = document.getElementById('companyPhone').value.trim();
    DATA.systemSettings.companyWebsite = document.getElementById('companyWebsite').value.trim();
    DATA.systemSettings.companyAddress = document.getElementById('companyAddress').value.trim();

    const ok = await saveAllSettingsToBackend();
    if (ok) {
        DATA.addAuditLog('UPDATE_COMPANY_INFO', 'Cập nhật thông tin công ty', AUTH.getCurrentUser().id);
        alert('✓ Đã lưu thông tin công ty thành công!');
    }
    
    saveBtn.disabled = false;
    saveBtn.innerHTML = origHtml;
}

async function saveSystemSettings(event) {
    event.preventDefault();
    const saveBtn = event.target.querySelector('button[type="submit"]');
    const origHtml = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

    DATA.systemSettings.timezone   = document.getElementById('timezone').value;
    DATA.systemSettings.dateFormat = document.getElementById('dateFormat').value;
    DATA.systemSettings.currency   = document.getElementById('currency').value;
    DATA.systemSettings.language   = document.getElementById('language').value;

    const ok = await saveAllSettingsToBackend();
    if (ok) {
        DATA.addAuditLog('UPDATE_SYSTEM_SETTINGS', 'Cập nhật cài đặt hệ thống', AUTH.getCurrentUser().id);
        alert('✓ Đã lưu cài đặt hệ thống thành công!');
    }

    saveBtn.disabled = false;
    saveBtn.innerHTML = origHtml;
}

async function saveNotificationSettings(event) {
    event.preventDefault();
    const saveBtn = event.target.querySelector('button[type="submit"]');
    const origHtml = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

    DATA.systemSettings.emailNotifications   = document.getElementById('emailNotifications').checked;
    DATA.systemSettings.smsNotifications     = document.getElementById('smsNotifications').checked;
    DATA.systemSettings.browserNotifications = document.getElementById('browserNotifications').checked;

    const ok = await saveAllSettingsToBackend();
    if (ok) {
        DATA.addAuditLog('UPDATE_NOTIFICATION_SETTINGS', 'Cập nhật cài đặt thông báo', AUTH.getCurrentUser().id);
        alert('✓ Đã lưu cài đặt thông báo thành công!');
    }

    saveBtn.disabled = false;
    saveBtn.innerHTML = origHtml;
}

async function saveSecuritySettings(event) {
    event.preventDefault();
    const saveBtn = event.target.querySelector('button[type="submit"]');
    const origHtml = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

    DATA.systemSettings.sessionTimeout    = parseInt(document.getElementById('sessionTimeout').value);
    DATA.systemSettings.maxLoginAttempts  = parseInt(document.getElementById('maxLoginAttempts').value);
    DATA.systemSettings.passwordExpiry    = parseInt(document.getElementById('passwordExpiry').value);
    DATA.systemSettings.require2FA        = document.getElementById('require2FA').checked;

    const ok = await saveAllSettingsToBackend();
    if (ok) {
        DATA.addAuditLog('UPDATE_SECURITY_SETTINGS', 'Cập nhật cài đặt bảo mật', AUTH.getCurrentUser().id);
        alert('✓ Đã lưu cài đặt bảo mật thành công!');
    }

    saveBtn.disabled = false;
    saveBtn.innerHTML = origHtml;
}

async function saveBackupSettings(event) {
    event.preventDefault();
    const saveBtn = event.target.querySelector('button[type="submit"]');
    const origHtml = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

    DATA.systemSettings.autoBackup       = document.getElementById('autoBackup').checked;
    DATA.systemSettings.backupFrequency  = document.getElementById('backupFrequency').value;

    const ok = await saveAllSettingsToBackend();
    if (ok) {
        DATA.addAuditLog('UPDATE_BACKUP_SETTINGS', 'Cập nhật cài đặt sao lưu', AUTH.getCurrentUser().id);
        alert('✓ Đã lưu cấu hình sao lưu thành công!');
    }

    saveBtn.disabled = false;
    saveBtn.innerHTML = origHtml;
}

async function createBackup() {
    const isApiSession = typeof AUTH !== 'undefined' && AUTH.getCurrentUser()?.authSource === 'api';
    
    if (isApiSession) {
        try {
            const backupBtn = document.querySelector('button[onclick="createBackup()"]');
            const origHtml = backupBtn.innerHTML;
            backupBtn.disabled = true;
            backupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...';

            const downloadUrl = API_CLIENT.buildUrl(API_ENDPOINTS.cauhinh.backup);
            const response = await fetch(downloadUrl, {
                headers: API_CLIENT.buildHeaders()
            });
            if (!response.ok) throw new Error('Lấy tệp sao lưu từ máy chủ thất bại!');
            
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            const datetime = new Date().toISOString().replace(/[:.]/g, '-');
            link.download = `crm-database-backup-${datetime}.json`;
            link.click();

            DATA.addAuditLog('CREATE_BACKUP', 'Tạo bản sao lưu dữ liệu toàn diện (Máy chủ)', AUTH.getCurrentUser().id);
            alert('✓ Đã tạo và tải xuống bản sao lưu cơ sở dữ liệu toàn diện từ máy chủ thành công!');
            
            backupBtn.disabled = false;
            backupBtn.innerHTML = origHtml;
        } catch (err) {
            console.error('Lỗi khi tải bản sao lưu hệ thống:', err);
            alert('❌ Tạo bản sao lưu thất bại: ' + err.message);
        }
    } else {
        // Dự phòng: Sao lưu mock
        const backupData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            data: {
                customers: DATA.customers,
                interactions: DATA.interactions,
                campaigns: DATA.campaigns,
                messageTemplates: DATA.messageTemplates,
                auditLogs: DATA.auditLogs,
                systemSettings: DATA.systemSettings
            }
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `crm-backup-mock-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        DATA.addAuditLog('CREATE_BACKUP', 'Tạo bản sao lưu dữ liệu (Mock)', AUTH.getCurrentUser().id);
        alert('✓ Đã tải bản sao lưu dữ liệu giả lập!');
    }
}

async function restoreBackup() {
    const fileInput = document.getElementById('restoreFile');
    const file = fileInput.files[0];
    if (!file) { alert('⚠ Vui lòng chọn file sao lưu!'); return; }
    if (!confirm('⚠ CẢNH BÁO: Khôi phục sẽ ghi đè toàn bộ dữ liệu cấu hình hệ thống!\n\nBạn có chắc chắn muốn tiếp tục?')) return;

    const isApiSession = typeof AUTH !== 'undefined' && AUTH.getCurrentUser()?.authSource === 'api';
    
    if (isApiSession) {
        try {
            const restoreBtn = document.querySelector('button[onclick="restoreBackup()"]');
            const origHtml = restoreBtn.innerHTML;
            restoreBtn.disabled = true;
            restoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang khôi phục...';

            await API_SERVICES.cauhinh.restore(file);
            
            DATA.addAuditLog('RESTORE_BACKUP', `Khôi phục dữ liệu từ ${file.name} (Máy chủ)`, AUTH.getCurrentUser().id);
            alert('✓ Khôi phục cơ sở dữ liệu hệ thống từ tệp sao lưu thành công!\n\nHệ thống sẽ tự động tải lại trang.');
            location.reload();
        } catch (err) {
            console.error('Lỗi khôi phục cơ sở dữ liệu từ tệp:', err);
            alert('❌ Khôi phục dữ liệu thất bại: ' + (err.message || 'Vui lòng kiểm tra lại tệp sao lưu.'));
            
            const restoreBtn = document.querySelector('button[onclick="restoreBackup()"]');
            restoreBtn.disabled = false;
            restoreBtn.innerHTML = '<i class="fas fa-upload"></i> Khôi phục dữ liệu';
        }
    } else {
        // Dự phòng: Khôi phục mock
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const backupData = JSON.parse(e.target.result);
                if (!backupData.data || !backupData.version) throw new Error('File sao lưu không hợp lệ!');
                if (backupData.data.customers)       DATA.customers       = backupData.data.customers;
                if (backupData.data.interactions)    DATA.interactions    = backupData.data.interactions;
                if (backupData.data.campaigns)       DATA.campaigns       = backupData.data.campaigns;
                if (backupData.data.messageTemplates) DATA.messageTemplates = backupData.data.messageTemplates;
                if (backupData.data.systemSettings)  DATA.systemSettings  = backupData.data.systemSettings;
                DATA.addAuditLog('RESTORE_BACKUP', `Khôi phục từ mock ${file.name}`, AUTH.getCurrentUser().id);
                alert('✓ Đã khôi phục dữ liệu giả lập thành công!\n\nTrang sẽ được tải lại.');
                location.reload();
            } catch (error) {
                alert('✗ Lỗi khi khôi phục mock: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}
