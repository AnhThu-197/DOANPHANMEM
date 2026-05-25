// ============================================
// API SYNC PAGE
// ============================================

async function openApiIntegrationSettings() {
    await loadApiSyncHistoryFromBackend();
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <h2 class="page-title">Đồng bộ Dữ liệu Khách hàng</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 15px;">Tích hợp API với Nền tảng Thứ ba</h3>
            <p style="color: #64748b; margin-bottom: 20px;">
                Kết nối với các nền tảng marketing để tự động đồng bộ dữ liệu khách hàng vào CRM mà không cần nhập tay.
            </p>
            
            <div style="display: grid; gap: 20px;">
                ${DATA.apiIntegrations.map(api => `
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                            <div>
                                <h4 style="margin-bottom: 5px;">
                                    <i class="fas fa-${api.type === 'facebook' ? 'facebook' : api.type === 'google' ? 'google' : 'plug'}"></i>
                                    ${api.name}
                                </h4>
                                <small style="color: #64748b;">Loại: ${api.type}</small>
                            </div>
                            <span class="status ${api.status === 'active' ? 'customer' : 'lead'}" style="padding: 5px 12px;">
                                ${api.status === 'active' ? '✓ Đang hoạt động' : '○ Chưa kích hoạt'}
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">API Key / Token:</label>
                            <input type="password" id="apiKey_${api.id}" value="${api.apiKey}" 
                                   placeholder="Nhập API Key hoặc Access Token"
                                   style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px;">
                        </div>
                        
                        ${api.type === 'webhook' ? `
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Webhook URL:</label>
                                <input type="text" id="webhookUrl_${api.id}" value="${api.webhookUrl || ''}" 
                                       placeholder="https://your-crm.com/webhook/receive"
                                       style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px;">
                                <small style="color: #64748b; display: block; margin-top: 5px;">
                                    Sao chép URL này và cấu hình trong hệ thống nguồn
                                </small>
                            </div>
                        ` : ''}
                        
                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                            <button class="btn btn-primary" onclick="saveApiIntegration(${api.id})">
                                <i class="fas fa-save"></i> Lưu Cấu hình
                            </button>

                            <button class="btn btn-secondary" onclick="testApiConnection(${api.id})">
                                <i class="fas fa-plug"></i> Test Kết nối
                            </button>

                            <button class="btn btn-secondary" onclick="syncApiData(${api.id})">
                                <i class="fas fa-sync"></i> Đồng bộ Ngay
                            </button>
                        </div>
                        
                        ${api.lastSync ? `
                            <div style="margin-top: 15px; padding: 10px; background: #f1f5f9; border-radius: 5px;">
                                <small style="color: #64748b;">
                                    <i class="fas fa-clock"></i> Đồng bộ lần cuối: ${api.lastSync}
                                </small>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3 style="margin-bottom: 15px;">Lịch sử Đồng bộ</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nền tảng</th>
                        <th>Số KH mới</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${DATA.syncHistory && DATA.syncHistory.length > 0 ? DATA.syncHistory.map(sync => `
                        <tr>
                            <td>${sync.platform}</td>
                            <td><strong>${sync.newCustomers}</strong> khách hàng</td>
                            <td>${sync.timestamp}</td>
                            <td><span class="status ${sync.status === 'success' ? 'customer' : 'lead'}">${sync.status === 'success' ? 'Thành công' : 'Thất bại'}</span></td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="4" style="text-align: center; padding: 20px; color: #94a3b8;">
                                Chưa có lịch sử đồng bộ
                            </td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
    `;
}

async function loadApiSyncHistoryFromBackend() {
    try {
        if (!API_SERVICES.dongBoAPI || !API_SERVICES.dongBoAPI.history) {
            console.warn('API đồng bộ chưa sẵn sàng.');
            return;
        }

        const response = await API_SERVICES.dongBoAPI.history();

        const apiData = Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
                ? response
                : [];

        DATA.syncHistory = apiData.map(mapSyncHistoryBackendToUI);
    } catch (error) {
        console.error('Lỗi tải lịch sử đồng bộ:', error);
        if (!DATA.syncHistory) {
            DATA.syncHistory = [];
        }
    }
}

function mapSyncHistoryBackendToUI(item) {
    return {
        id: item.maLichSuDongBo,
        platform: item.tenNenTang || '',
        newCustomers: item.soKhachHangMoi || 0,
        timestamp: item.thoiGian
            ? String(item.thoiGian).replace('T', ' ').substring(0, 19)
            : '',
        status: item.trangThai === 'Thành công' || item.trangThai === 'success'
            ? 'success'
            : 'fail'
    };
}

async function saveApiIntegration(apiId) {
    const api = DATA.apiIntegrations.find(a => a.id === apiId);
    if (!api) return;

    const apiKeyInput = document.getElementById(`apiKey_${apiId}`);
    const webhookUrlInput = document.getElementById(`webhookUrl_${apiId}`);

    const payload = {
        tenNenTang: api.name,
        loaiNenTang: api.type,
        apiKey: apiKeyInput.value.trim(),
        webhookUrl: webhookUrlInput ? webhookUrlInput.value.trim() : null
    };

    if (!payload.apiKey && api.type !== 'webhook') {
        alert('⚠ Vui lòng nhập API Key / Token trước khi lưu cấu hình!');
        return;
    }

    if (api.type === 'webhook' && !payload.webhookUrl) {
    alert('⚠ Vui lòng nhập Webhook URL trước khi lưu cấu hình!');
    return;
    }

    try {
        await API_SERVICES.dongBoAPI.saveConfig(payload);

        api.apiKey = payload.apiKey;
        api.webhookUrl = payload.webhookUrl;
        api.status = 'active';

        alert(`✓ Đã lưu cấu hình cho ${api.name}`);
        openApiIntegrationSettings();
    } catch (error) {
        console.error('Lỗi lưu cấu hình API:', error);
        alert('Lưu cấu hình thất bại. Kiểm tra F12 → Network → POST /dong-bo-api/luu-cau-hinh.');
    }
}

async function testApiConnection(apiId) {
    const api = DATA.apiIntegrations.find(a => a.id === apiId);
    if (!api) return;

    const apiKeyInput = document.getElementById(`apiKey_${apiId}`);
    const webhookUrlInput = document.getElementById(`webhookUrl_${apiId}`);

    const payload = {
        tenNenTang: api.name,
        loaiNenTang: api.type,
        apiKey: apiKeyInput ? apiKeyInput.value.trim() : api.apiKey,
        webhookUrl: webhookUrlInput ? webhookUrlInput.value.trim() : api.webhookUrl
    };

    if (!payload.apiKey && api.type !== 'webhook') {
        alert('⚠ Vui lòng nhập API Key trước khi test kết nối!');
        return;
    }

    if (api.type === 'webhook' && !payload.webhookUrl) {
    alert('⚠ Vui lòng nhập Webhook URL trước khi test kết nối!');
    return;
    }

    try {
        await API_SERVICES.dongBoAPI.testConnection(payload);

        alert(`✓ Kết nối thành công với ${api.name}!`);

        api.status = 'active';
        await loadApiSyncHistoryFromBackend();
        openApiIntegrationSettings();
    } catch (error) {
        console.error('Lỗi test kết nối API:', error);
        alert('Test kết nối thất bại. Kiểm tra F12 → Network → POST /dong-bo-api/test-ket-noi.');
    }
}

async function syncApiData(apiId) {
    const api = DATA.apiIntegrations.find(a => a.id === apiId);
    if (!api) return;

    const apiKeyInput = document.getElementById(`apiKey_${apiId}`);
    const webhookUrlInput = document.getElementById(`webhookUrl_${apiId}`);

    const payload = {
        tenNenTang: api.name,
        loaiNenTang: api.type,
        apiKey: apiKeyInput ? apiKeyInput.value.trim() : api.apiKey,
        webhookUrl: webhookUrlInput ? webhookUrlInput.value.trim() : api.webhookUrl
    };

    if (!payload.apiKey && api.type !== 'webhook') {
        alert('⚠ Vui lòng nhập API Key / Token trước khi đồng bộ!');
        return;
    }

    if (api.type === 'webhook' && !payload.webhookUrl) {
    alert('⚠ Vui lòng nhập Webhook URL trước khi đồng bộ!');
    return;
    }
    
    const loadingMsg = document.createElement('div');
    loadingMsg.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 10000;">
            <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #3b82f6;"></i>
            <p style="margin-top: 15px;">Đang đồng bộ dữ liệu từ ${api.name}...</p>
        </div>
    `;
    document.body.appendChild(loadingMsg);

    try {
        await API_SERVICES.dongBoAPI.syncNow(payload);

        document.body.removeChild(loadingMsg);

        api.status = 'active';
        api.lastSync = new Date().toLocaleString('vi-VN');

        await loadCustomersFromBackend?.();
        await loadApiSyncHistoryFromBackend();

        alert(`✓ Đồng bộ thành công dữ liệu từ ${api.name}!`);
        openApiIntegrationSettings();
    } catch (error) {
        document.body.removeChild(loadingMsg);

        console.error('Lỗi đồng bộ API:', error);
        alert('Đồng bộ thất bại. Kiểm tra F12 → Network → POST /dong-bo-api/dong-bo.');
    }
}
