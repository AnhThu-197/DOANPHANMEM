// ============================================
// MESSAGES PAGE (REAL BACKEND API INTEGRATION)
// ============================================

function getMessageHistory() {
    if (!DATA.messageHistory) DATA.messageHistory = [];
    return DATA.messageHistory;
}

async function loadSendMessage() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    const user = AUTH.getCurrentUser();
    const canManageTemplates = user && (user.role === 'manager' || user.role === 'admin' || user.role === 'MANAGER' || user.role === 'ADMIN');

    if (isApiSession) {
        // Show loading state
        content.innerHTML = `
            <div class="page-header">
                <div>
                    <h1>Thông điệp</h1>
                    <p>Gửi thông điệp cho khách hàng và quản lý mẫu nội dung.</p>
                </div>
                <button class="btn btn-primary" onclick="openSendMessageModal()">
                    <i class="fas fa-paper-plane"></i> Gửi thông điệp
                </button>
            </div>
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab('messagesSendTab')">Lịch sử gửi</button>
                ${canManageTemplates ? '<button class="tab-btn" onclick="switchTab(\'messageTemplatesTab\')">Mẫu thông điệp</button>' : ''}
            </div>
            <div id="messagesSendTab" class="tab-content active">
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #0284c7;"></i>
                    <p style="margin-top: 10px; color: #64748b;">Đang tải dữ liệu từ máy chủ...</p>
                </div>
            </div>
        `;

        try {
            // Load sent history and templates
            const [historyResponse, templatesResponse] = await Promise.all([
                API_SERVICES.thongDiep.getHistory(),
                API_SERVICES.thongDiep.getTemplates()
            ]);

            const messages = historyResponse.data || historyResponse || [];
            const templates = templatesResponse.data || templatesResponse || [];

            // Store globally
            window.CURRENT_MESSAGES = messages;
            window.CURRENT_TEMPLATES = templates;

            renderMessagesUI(messages, templates, isApiSession, canManageTemplates);

        } catch (error) {
            console.error('Error loading messages:', error);
            document.getElementById('messagesSendTab').innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #ef4444;"></i>
                    <p style="margin-top: 10px; color: #ef4444; font-weight: 600;">Không thể tải dữ liệu: ${error.message || 'Lỗi kết nối'}</p>
                    <button class="btn btn-secondary" onclick="loadSendMessage()" style="margin-top: 10px; padding: 6px 12px; font-size: 12px;">Thử lại</button>
                </div>
            `;
        }
    } else {
        // Local mock session
        // Filter messageHistory to only show messages assigned to the current employee
        let messages = getMessageHistory();
        const currentUserId = user?.id;
        if (currentUserId) {
            messages = messages.filter(m => !m.employeeId || Number(m.employeeId) === Number(currentUserId));
        }
        
        renderMessagesUI(messages, DATA.messageTemplates, isApiSession, canManageTemplates);
    }
}

function renderMessagesUI(messages, templates, isApiSession, canManageTemplates) {
    const content = document.getElementById('mainContent');
    if (!content) return;

    // Filter sent messages by assigned employee (current user) if role is employee/staff
    const user = AUTH.getCurrentUser();
    const role = user?.role || user?.vaiTro || '';
    const isEmployee = role.toUpperCase().trim() === 'EMPLOYEE' || role.toUpperCase().trim() === 'NHAN_VIEN';
    
    // For local mock mode, we already filtered it. For API mode:
    let displayMessages = messages;
    if (isApiSession && isEmployee) {
        const employeeId = user?.employeeId || user?.maNhanVien;
        if (employeeId) {
            displayMessages = messages.filter(m => m.nhanVien && Number(m.nhanVien.maNhanVien) === Number(employeeId));
        }
    }

    content.innerHTML = `
        <div class="page-header">
            <div>
                <h1>Thông điệp</h1>
                <p>Gửi thông điệp cho khách hàng và quản lý mẫu nội dung.</p>
            </div>
            <button class="btn btn-primary" onclick="openSendMessageModal()">
                <i class="fas fa-paper-plane"></i> Gửi thông điệp
            </button>
        </div>

        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab('messagesSendTab')">Lịch sử gửi</button>
            ${canManageTemplates ? '<button class="tab-btn" onclick="switchTab(\'messageTemplatesTab\')">Mẫu thông điệp</button>' : ''}
        </div>

        <div id="messagesSendTab" class="tab-content active">
            <div class="data-table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Khách hàng</th>
                            <th>Nhân viên gửi</th>
                            <th>Kênh</th>
                            <th>Nội dung</th>
                            <th>Trạng thái</th>
                            <th>Ngày gửi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${displayMessages.length ? displayMessages.map(message => {
                            const customerName = message.khachHang?.hoTen || message.customerName || 'Không rõ';
                            const employeeName = message.nhanVien?.hoTen || message.employeeName || 'Hệ thống';
                            const channel = message.kenhGui || message.channel || message.type || 'Email';
                            
                            let dateStr = '';
                            const rawDate = message.thoiGianGui || message.sentDate || '';
                            if (rawDate) {
                                if (rawDate.includes('T')) {
                                    const dt = new Date(rawDate);
                                    dateStr = `${dt.toLocaleDateString('vi-VN')} ${dt.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}`;
                                } else {
                                    dateStr = rawDate;
                                }
                            }

                            const status = message.trangThaiGui || message.status || 'Đã gửi';
                            const badgeClass = status === 'Thất bại' ? 'status-badge rejected' : (status === 'Chờ xử lý' || status === 'scheduled' ? 'status-badge lead' : 'status-badge customer');

                            return `
                                <tr>
                                    <td><strong>${customerName}</strong></td>
                                    <td>${employeeName}</td>
                                    <td><span class="interaction-type-badge ${channel.toLowerCase()}">${channel}</span></td>
                                    <td style="max-width: 300px; white-space: normal; word-wrap: break-word;">
                                        ${message.tieuDe || message.subject ? `<strong>${message.tieuDe || message.subject}</strong><br>` : ''}
                                        <small>${message.noiDung || message.content || ''}</small>
                                        ${message.lyDoThatBai ? `<br><span style="color:#ef4444; font-size:11px;">Lỗi: ${message.lyDoThatBai}</span>` : ''}
                                    </td>
                                    <td><span class="${badgeClass}">${status}</span></td>
                                    <td>${dateStr}</td>
                                </tr>
                            `;
                        }).join('') : `
                            <tr>
                                <td colspan="6" style="text-align:center; padding:30px; color:#94a3b8;">Chưa có lịch sử gửi thông điệp nào.</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>

        ${canManageTemplates ? `
            <div id="messageTemplatesTab" class="tab-content">
                <div class="table-container">
                    <div class="table-header">
                        <h3>Mẫu thông điệp</h3>
                        <button class="btn-add" onclick="openTemplateModal()">
                            <i class="fas fa-plus"></i> Thêm mẫu
                        </button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên mẫu</th>
                                <th>Loại</th>
                                <th>Nội dung</th>
                                <th>Lượt dùng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${templates.length ? templates.map(template => {
                                const tid = template.maMau || template.id;
                                const name = template.tieuDe || template.name || '';
                                const type = template.loaiThongDiep || template.type || 'Email';
                                const content = template.noiDung || template.content || '';
                                const uses = template.luotSuDung !== undefined ? template.luotSuDung : 0;

                                return `
                                    <tr>
                                        <td><strong>${name}</strong></td>
                                        <td><span class="interaction-type-badge ${type.toLowerCase()}">${type}</span></td>
                                        <td style="max-width: 350px; white-space: normal; word-wrap: break-word;">${content.slice(0, 80)}${content.length > 80 ? '...' : ''}</td>
                                        <td><strong>${uses}</strong></td>
                                        <td>
                                            <button class="btn-edit" onclick="editTemplate(${tid})">Sửa</button>
                                            <button class="btn-delete" onclick="deleteTemplate(${tid})">Xóa</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('') : `
                                <tr>
                                    <td colspan="5" style="text-align:center; padding:20px; color:#94a3b8;">Chưa có mẫu thông điệp nào.</td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        ` : ''}
    `;
}

function openSendMessageModal() {
    const modal = document.getElementById('sendMessageModal');
    const form = document.getElementById('sendMessageForm');
    if (!modal || !form) return;

    form.reset();
    populateCustomerDropdown('messageCustomer');
    populateTemplateDropdown('messageTemplate');

    const customerSelect = document.getElementById('messageCustomer');
    const templateSelect = document.getElementById('messageTemplate');

    const updateContent = () => {
        const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
        const templates = isApiSession ? (window.CURRENT_TEMPLATES || []) : DATA.messageTemplates;
        const template = templates.find(item => Number(item.maMau || item.id) === Number(templateSelect.value));
        if (!template) return;

        const customerId = Number(customerSelect.value);
        const customer = isApiSession
            ? (window.CURRENT_CUSTOMERS || []).find(item => Number(item.maKhachHang || item.id) === customerId)
            : DATA.customers.find(item => Number(item.id) === customerId);

        const content = (template.noiDung || template.content || '')
            .replaceAll('{customerName}', customer?.hoTen || customer?.name || '')
            .replaceAll('{hoTen}', customer?.hoTen || customer?.name || '')
            .replaceAll('{date}', new Date().toLocaleDateString('vi-VN'))
            .replaceAll('{time}', new Date().toLocaleTimeString('vi-VN'));

        document.getElementById('messageContent').value = content;
        document.getElementById('messageType').value = (template.loaiThongDiep || template.type || 'email').toLowerCase();
    };

    if (templateSelect) {
        templateSelect.onchange = updateContent;
    }
    if (customerSelect) {
        customerSelect.onchange = updateContent;
    }

    const scheduleCheckbox = document.getElementById('messageSchedule');
    const scheduleTime = document.getElementById('scheduleTime');
    if (scheduleCheckbox && scheduleTime) {
        scheduleCheckbox.onchange = function () {
            scheduleTime.style.display = this.checked ? 'block' : 'none';
        };
        scheduleTime.style.display = 'none';
    }

    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

function openTemplateModal() {
    const modal = document.getElementById('templateModal');
    const form = document.getElementById('templateForm');
    if (!modal || !form) return;

    form.reset();
    delete modal.dataset.templateId;

    const title = document.getElementById('templateModalTitle');
    if (title) title.textContent = 'Thêm Mẫu Thông điệp';

    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

function editTemplate(id) {
    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    const templates = isApiSession ? (window.CURRENT_TEMPLATES || []) : DATA.messageTemplates;
    const template = templates.find(item => Number(item.maMau || item.id) === Number(id));
    if (!template) return;

    openTemplateModal();

    const modal = document.getElementById('templateModal');
    const title = document.getElementById('templateModalTitle');
    if (modal) modal.dataset.templateId = id;
    if (title) title.textContent = 'Cập nhật Mẫu Thông điệp';

    document.getElementById('templateName').value = template.tieuDe || template.name || '';
    document.getElementById('templateType').value = (template.loaiThongDiep || template.type || 'email').toLowerCase();
    document.getElementById('templateContent').value = template.noiDung || template.content || '';
}

async function saveTemplate(e) {
    if (e) e.preventDefault();

    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    const modal = document.getElementById('templateModal');
    const templateId = modal ? modal.dataset.templateId : null;
    
    const payload = {
        name: document.getElementById('templateName')?.value.trim(),
        type: document.getElementById('templateType')?.value,
        content: document.getElementById('templateContent')?.value.trim()
    };

    if (!payload.name || !payload.type || !payload.content) {
        alert('Vui lòng nhập đầy đủ thông tin mẫu.');
        return;
    }

    if (isApiSession) {
        try {
            if (templateId) {
                await API_SERVICES.thongDiep.updateTemplate(Number(templateId), payload);
                alert('✓ Cập nhật mẫu tin nhắn thành công!');
            } else {
                await API_SERVICES.thongDiep.createTemplate(payload);
                alert('✓ Tạo mẫu tin nhắn thành công!');
            }
            closeModal('templateModal');
            loadSendMessage();
        } catch (error) {
            console.error('Error saving template:', error);
            alert('❌ Lỗi: ' + (error.response?.data?.message || error.message || 'Không thể lưu mẫu'));
        }
    } else {
        // Mock save
        if (templateId) {
            const template = DATA.messageTemplates.find(item => Number(item.id) === Number(templateId));
            if (template) {
                template.name = payload.name;
                template.type = payload.type;
                template.content = payload.content;
            }
        } else {
            const nextId = Math.max(0, ...DATA.messageTemplates.map(item => Number(item.id) || 0)) + 1;
            DATA.messageTemplates.push({
                id: nextId,
                ...payload,
                createdDate: new Date().toISOString().split('T')[0]
            });
        }
        closeModal('templateModal');
        loadSendMessage();
    }
}

async function deleteTemplate(id) {
    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    const templates = isApiSession ? (window.CURRENT_TEMPLATES || []) : DATA.messageTemplates;
    const template = templates.find(item => Number(item.maMau || item.id) === Number(id));
    if (!template || !confirm(`Xóa mẫu "${template.tieuDe || template.name}"?`)) return;

    if (isApiSession) {
        try {
            await API_SERVICES.thongDiep.deleteTemplate(id);
            alert('✓ Xóa mẫu tin nhắn thành công!');
            loadSendMessage();
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('❌ Lỗi: ' + (error.message || 'Không thể xóa mẫu'));
        }
    } else {
        DATA.messageTemplates = DATA.messageTemplates.filter(item => Number(item.id) !== Number(id));
        loadSendMessage();
    }
}

async function sendMessage(e) {
    if (e) e.preventDefault();

    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    const customerId = Number(document.getElementById('messageCustomer')?.value);
    const type = document.getElementById('messageType')?.value || 'email';
    const content = document.getElementById('messageContent')?.value.trim();
    const scheduled = !!document.getElementById('messageSchedule')?.checked;

    if (!customerId || !content) {
        alert('Vui lòng chọn khách hàng và nhập nội dung.');
        return;
    }

    const templateId = document.getElementById('messageTemplate')?.value || '';
    let promoTitle = document.getElementById('messagePromoTitle')?.value.trim() || '';
    
    if (!promoTitle && templateId) {
        const templates = isApiSession ? (window.CURRENT_TEMPLATES || []) : DATA.messageTemplates;
        const template = templates.find(item => Number(item.maMau || item.id) === Number(templateId));
        if (template) {
            promoTitle = template.tieuDe || template.name || 'Thông điệp Marketing';
        }
    }
    if (!promoTitle) {
        promoTitle = 'Thông điệp Marketing';
    }

    if (isApiSession) {
        const payload = {
            customerId: String(customerId),
            type: type,
            content: content,
            templateId: templateId,
            promoTitle: promoTitle,
            promoCode: document.getElementById('messagePromoCode')?.value.trim() || '',
            promoDescription: document.getElementById('messagePromoDescription')?.value.trim() || '',
            promoExpiry: document.getElementById('messagePromoExpiry')?.value || '',
            promoLink: document.getElementById('messagePromoLink')?.value.trim() || ''
        };

        const submitBtn = e.target.querySelector('button[type="submit"]') || document.querySelector('#sendMessageForm button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Gửi';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        }

        try {
            await API_SERVICES.thongDiep.send(payload);
            closeModal('sendMessageModal');
            loadSendMessage();
            alert('✓ Đã gửi/lên lịch thông điệp thành công!');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('❌ Gửi thông điệp thất bại: ' + (error.message || 'Lỗi hệ thống'));
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    } else {
        // Mock send
        const customer = DATA.customers.find(item => Number(item.id) === customerId);
        getMessageHistory().push({
            id: Math.max(0, ...getMessageHistory().map(item => Number(item.id) || 0)) + 1,
            customerId,
            customerName: customer?.name || '',
            employeeId: AUTH.getCurrentUser()?.id,
            templateId: Number(templateId) || null,
            channel: type.toUpperCase(),
            subject: promoTitle,
            content,
            status: scheduled ? 'scheduled' : 'Đã gửi',
            sentDate: scheduled
                ? document.getElementById('messageScheduleTime')?.value
                : new Date().toLocaleString('vi-VN'),
            notes: document.getElementById('messageNotes')?.value.trim() || ''
        });

        closeModal('sendMessageModal');
        loadSendMessage();
    }
}
