// ============================================
// ADVANCED FEATURES: TRIAL, AUTOMATION, REMINDERS, MERGE
// ============================================

function daysBetweenToday(dateString) {
    return Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
}

function loadTrialManagement() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const trials = DATA.trialCustomers || [];
    content.innerHTML = `
        <div class="page-header">
            <div>
                <h1>Quản lý dùng thử</h1>
                <p>Theo dõi khách hàng đang dùng thử và thời hạn còn lại.</p>
            </div>
            <button class="btn btn-primary" onclick="openTrialModal()"><i class="fas fa-plus"></i> Thêm dùng thử</button>
        </div>
        <div class="data-table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Khách hàng</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Còn lại</th>
                        <th>Nhắc trước</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${trials.map(trial => {
                        const daysLeft = daysBetweenToday(trial.endDate);
                        const label = daysLeft <= 0 ? 'Hết hạn' : `${daysLeft} ngày`;
                        return `
                            <tr>
                                <td><strong>${trial.customerName}</strong></td>
                                <td>${formatDate(trial.startDate)}</td>
                                <td>${formatDate(trial.endDate)}</td>
                                <td>${label}</td>
                                <td>${trial.reminderDays || 0} ngày</td>
                                <td>
                                    <button class="btn-view" onclick="viewTrialDetail(${trial.id})">Xem</button>
                                    <button class="btn-edit" onclick="editTrial(${trial.id})">Sửa</button>
                                </td>
                            </tr>
                        `;
                    }).join('') || '<tr><td colspan="6" style="text-align:center; padding:30px;">Chưa có dữ liệu dùng thử.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

function openTrialModal(trialId = null) {
    const trial = trialId ? DATA.trialCustomers.find(item => Number(item.id) === Number(trialId)) : null;
    let modal = document.getElementById('trialInlineModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'trialInlineModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${trial ? 'Cập nhật dùng thử' : 'Thêm dùng thử'}</h2>
                <button class="close-btn" onclick="closeModal('trialInlineModal')">&times;</button>
            </div>
            <form onsubmit="saveTrial(event, ${trial ? trial.id : 'null'})">
                <div class="form-group">
                    <label>Khách hàng *</label>
                    <select id="trialCustomerInline" required>
                        ${DATA.customers.filter(customer => !customer.deleted).map(customer => `
                            <option value="${customer.id}" ${Number(customer.id) === Number(trial?.customerId) ? 'selected' : ''}>${customer.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="modal-grid-2">
                    <div class="form-group">
                        <label>Ngày bắt đầu *</label>
                        <input type="date" id="trialStartDateInline" value="${trial?.startDate || new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label>Số ngày *</label>
                        <input type="number" id="trialDaysInline" value="${trial?.daysAllowed || 30}" min="1" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Nhắc trước</label>
                    <input type="number" id="trialReminderDaysInline" value="${trial?.reminderDays || 3}" min="0">
                </div>
                <div class="form-group">
                    <label>Ghi chú</label>
                    <textarea id="trialNotesInline">${trial?.notes || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('trialInlineModal')">Hủy</button>
                    <button class="btn btn-primary" type="submit">Lưu</button>
                </div>
            </form>
        </div>
    `;
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

function editTrial(trialId) {
    openTrialModal(trialId);
}

function saveTrial(e, trialId = null) {
    if (e) e.preventDefault();

    const customerId = Number(document.getElementById('trialCustomerInline')?.value);
    const customer = DATA.customers.find(item => Number(item.id) === customerId);
    const startDate = document.getElementById('trialStartDateInline')?.value;
    const days = Number(document.getElementById('trialDaysInline')?.value || 30);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    const payload = {
        customerId,
        customerName: customer?.name || '',
        startDate,
        endDate: endDate.toISOString().split('T')[0],
        daysAllowed: days,
        reminderDays: Number(document.getElementById('trialReminderDaysInline')?.value || 0),
        notes: document.getElementById('trialNotesInline')?.value || ''
    };

    if (trialId) {
        const trial = DATA.trialCustomers.find(item => Number(item.id) === Number(trialId));
        if (trial) Object.assign(trial, payload);
    } else {
        DATA.trialCustomers.push({
            id: Math.max(0, ...DATA.trialCustomers.map(item => Number(item.id) || 0)) + 1,
            ...payload
        });
    }

    closeModal('trialInlineModal');
    loadTrialManagement();
}

function updateTrialEndDate() {
    return null;
}

function viewTrialDetail(trialId) {
    const trial = DATA.trialCustomers.find(item => Number(item.id) === Number(trialId));
    if (!trial) return;
    alert(`${trial.customerName}\nTừ ${formatDate(trial.startDate)} đến ${formatDate(trial.endDate)}\nCòn lại: ${daysBetweenToday(trial.endDate)} ngày`);
}

function loadAutomation() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    content.innerHTML = `
        <div class="page-header">
            <div>
                <h1>Tự động hóa</h1>
                <p>Quản lý kịch bản chăm sóc và quy tắc chấm điểm lead.</p>
            </div>
            <button class="btn btn-primary" onclick="openWorkflowModal()"><i class="fas fa-plus"></i> Tạo kịch bản</button>
        </div>
        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab('automationWorkflowTab')">Kịch bản</button>
            <button class="tab-btn" onclick="switchTab('automationScoringTab')">Chấm điểm</button>
        </div>
        <div id="automationWorkflowTab" class="tab-content active">
            <div class="data-table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Tên</th><th>Kích hoạt</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead>
                    <tbody>
                        ${DATA.automationWorkflows.map(workflow => `
                            <tr>
                                <td><strong>${workflow.name}</strong></td>
                                <td>${workflow.trigger}</td>
                                <td>${workflow.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}</td>
                                <td>${formatDate(workflow.createdDate)}</td>
                                <td>
                                    <button class="btn-view" onclick="viewWorkflow(${workflow.id})">Xem</button>
                                    <button class="btn-edit" onclick="editWorkflow(${workflow.id})">Sửa</button>
                                    <button class="btn-delete" onclick="deleteWorkflow(${workflow.id})">Xóa</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        <div id="automationScoringTab" class="tab-content">
            <div class="table-container">
                <div class="table-header">
                    <h3>Quy tắc chấm điểm</h3>
                    <button class="btn-add" onclick="openScoringRuleModal()">Thêm quy tắc</button>
                </div>
                <table>
                    <thead><tr><th>Hành động</th><th>Điểm</th><th>Thao tác</th></tr></thead>
                    <tbody>
                        ${DATA.leadScoringRules.map(rule => `
                            <tr>
                                <td>${rule.action}</td>
                                <td><strong>+${rule.points}</strong></td>
                                <td>
                                    <button class="btn-edit" onclick="editScoringRule(${rule.id})">Sửa</button>
                                    <button class="btn-delete" onclick="deleteScoringRule(${rule.id})">Xóa</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function openWorkflowModal(workflowId = null) {
    const workflow = workflowId ? DATA.automationWorkflows.find(item => Number(item.id) === Number(workflowId)) : null;
    const name = prompt('Tên kịch bản:', workflow?.name || '');
    if (!name) return;

    if (workflow) {
        workflow.name = name;
    } else {
        DATA.automationWorkflows.push({
            id: Math.max(0, ...DATA.automationWorkflows.map(item => Number(item.id) || 0)) + 1,
            name,
            trigger: 'new_lead',
            status: 'active',
            actions: [],
            createdDate: new Date().toISOString().split('T')[0]
        });
    }
    loadAutomation();
}

function viewWorkflow(workflowId) {
    const workflow = DATA.automationWorkflows.find(item => Number(item.id) === Number(workflowId));
    if (workflow) alert(`${workflow.name}\nTrigger: ${workflow.trigger}\nStatus: ${workflow.status}`);
}

function editWorkflow(workflowId) {
    openWorkflowModal(workflowId);
}

function editWorkflowFromDetail() {
    loadAutomation();
}

function saveWorkflow(e) {
    if (e) e.preventDefault();
    loadAutomation();
}

function addWorkflowAction() {
    alert('Chức năng thêm action chi tiết sẽ nối sau.');
}

function deleteWorkflow(workflowId) {
    const workflow = DATA.automationWorkflows.find(item => Number(item.id) === Number(workflowId));
    if (!workflow || !confirm(`Xóa kịch bản "${workflow.name}"?`)) return;
    DATA.automationWorkflows = DATA.automationWorkflows.filter(item => Number(item.id) !== Number(workflowId));
    loadAutomation();
}

function openScoringRuleModal(ruleId = null) {
    const rule = ruleId ? DATA.leadScoringRules.find(item => Number(item.id) === Number(ruleId)) : null;
    const action = prompt('Hành động:', rule?.action || '');
    if (!action) return;
    const points = Number(prompt('Điểm:', rule?.points || 1));

    if (rule) {
        rule.action = action;
        rule.points = points;
    } else {
        DATA.leadScoringRules.push({
            id: Math.max(0, ...DATA.leadScoringRules.map(item => Number(item.id) || 0)) + 1,
            action,
            points,
            active: true
        });
    }
    loadAutomation();
}

function editScoringRule(ruleId) {
    openScoringRuleModal(ruleId);
}

function saveScoringRule(e) {
    if (e) e.preventDefault();
    loadAutomation();
}

function deleteScoringRule(ruleId) {
    DATA.leadScoringRules = DATA.leadScoringRules.filter(item => Number(item.id) !== Number(ruleId));
    loadAutomation();
}

function loadSmartReminders() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';

    if (isApiSession) {
        // Load from API
        content.innerHTML = `
            <div class="page-header">
                <div>
                    <h1>Nhắc nhở thông minh</h1>
                    <p>Theo dõi lịch hẹn và trạng thái chăm sóc.</p>
                </div>
                <button class="btn btn-primary" onclick="openAppointmentModal()"><i class="fas fa-plus"></i> Tạo lịch hẹn</button>
            </div>
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #0284c7;"></i>
                <p style="margin-top: 10px; color: #64748b;">Đang tải dữ liệu...</p>
            </div>
        `;

        API_SERVICES.nhacNho.cuaToi()
            .then(response => {
                const appointments = response.data || response || [];
                renderAppointmentsTable(appointments, isApiSession);
            })
            .catch(error => {
                console.error('Error loading appointments:', error);
                content.innerHTML = `
                    <div class="page-header">
                        <div>
                            <h1>Nhắc nhở thông minh</h1>
                            <p>Theo dõi lịch hẹn và trạng thái chăm sóc.</p>
                        </div>
                        <button class="btn btn-primary" onclick="openAppointmentModal()"><i class="fas fa-plus"></i> Tạo lịch hẹn</button>
                    </div>
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #ef4444;"></i>
                        <p style="margin-top: 10px; color: #64748b;">Không thể tải dữ liệu: ${error.message || 'Lỗi không xác định'}</p>
                    </div>
                `;
            });
    } else {
        // Load from local DATA
        renderAppointmentsTable(DATA.appointments, isApiSession);
    }
}

function renderAppointmentsTable(appointments, isApiSession) {
    const content = document.getElementById('mainContent');
    if (!content) return;

    content.innerHTML = `
        <div class="page-header">
            <div>
                <h1>Nhắc nhở thông minh</h1>
                <p>Theo dõi lịch hẹn và trạng thái chăm sóc.</p>
            </div>
            <button class="btn btn-primary" onclick="openAppointmentModal()"><i class="fas fa-plus"></i> Tạo lịch hẹn</button>
        </div>
        <div class="data-table-wrapper">
            <table class="data-table">
                <thead><tr><th>Khách hàng</th><th>Tiêu đề</th><th>Loại</th><th>Thời gian</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                <tbody>
                    ${appointments.length > 0 ? appointments.map(item => {
                        // Map API response fields
                        const customerName = item.khachHang?.hoTen || item.tenKhachHang || item.customerName || 'N/A';
                        const title = item.tieuDe || item.title || '';
                        const type = item.loaiNhacNho || item.loaiTuongTac || item.type || 'Gọi điện';
                        const dateTime = item.thoiGianNhac || item.thoiGianHen || item.date || '';
                        const status = item.trangThaiNhacNho || item.trangThai || item.status || 'Chờ xử lý';
                        const id = item.maNhacNho || item.id;
                        
                        // Format datetime
                        let displayDateTime = '';
                        if (dateTime) {
                            if (dateTime.includes('T')) {
                                // ISO format from API
                                const dt = new Date(dateTime);
                                displayDateTime = `${dt.toLocaleDateString('vi-VN')} ${dt.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}`;
                            } else {
                                displayDateTime = formatDate(dateTime) + (item.time ? ' ' + item.time : '');
                            }
                        }
                        
                        const isCompleted = status === 'Đã hoàn thành' || status === 'completed' || status === 'hoan_thanh';
                        
                        return `
                            <tr>
                                <td>${customerName}</td>
                                <td><strong>${title}</strong></td>
                                <td>${type}</td>
                                <td>${displayDateTime}</td>
                                <td>${isCompleted ? '<span style="color: #10b981;">Hoàn thành</span>' : '<span style="color: #f59e0b;">Chờ xử lý</span>'}</td>
                                <td>
                                    <button class="btn-view" onclick="viewAppointment(${id})">Xem</button>
                                    ${!isCompleted ? `<button class="btn-edit" onclick="completeAppointment(${id})">Hoàn thành</button>` : ''}
                                    <button class="btn-delete" onclick="deleteAppointment(${id})">Xóa</button>
                                </td>
                            </tr>
                        `;
                    }).join('') : '<tr><td colspan="6" style="text-align:center; padding:30px; color:#64748b;">Chưa có lịch hẹn nào.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

async function openAppointmentModal(appointmentId = null) {
    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    let appointment = null;
    
    if (appointmentId) {
        // Edit mode - find appointment
        if (isApiSession) {
            // For API session, we need to find from loaded data
            // Since we don't have a detail endpoint, we'll use the data from the table
            alert('Chức năng sửa lịch hẹn đang được phát triển.');
            return;
        } else {
            appointment = DATA.appointments.find(item => Number(item.id) === Number(appointmentId));
        }
    }

    // Load customers for dropdown
    let customers = [];
    if (isApiSession) {
        try {
            const response = await API_SERVICES.khachHang.list();
            customers = (response.data || response || []).filter(c => !c.daXoa);
        } catch (error) {
            console.error('Error loading customers:', error);
            alert('Không thể tải danh sách khách hàng');
            return;
        }
    } else {
        customers = DATA.customers.filter(c => !c.deleted);
    }

    // Set modal title
    document.getElementById('appointmentModalTitle').textContent = appointment ? 'Cập nhật Lịch hẹn' : 'Tạo Lịch hẹn';
    
    // Populate customer dropdown
    const customerSelect = document.getElementById('appointmentCustomer');
    customerSelect.innerHTML = '<option value="">-- Chọn khách hàng --</option>' + 
        customers.map(c => `<option value="${c.id}" ${appointment && Number(c.id) === Number(appointment.customerId || appointment.khachHangId) ? 'selected' : ''}>${c.hoTen || c.name}</option>`).join('');
    
    // Populate form fields if editing
    if (appointment) {
        document.getElementById('appointmentTitle').value = appointment.tieuDe || appointment.title || '';
        document.getElementById('appointmentType').value = appointment.loaiTuongTac || appointment.type || 'call';
        document.getElementById('appointmentDate').value = appointment.thoiGianHen || appointment.date || '';
        document.getElementById('appointmentTime').value = appointment.gioHen || appointment.time || '';
        document.getElementById('appointmentReminderBefore').value = appointment.nhacTruoc || appointment.reminderBefore || 30;
        document.getElementById('appointmentNotes').value = appointment.ghiChu || appointment.notes || '';
    } else {
        // Reset form for new appointment
        document.getElementById('appointmentForm').reset();
        document.getElementById('appointmentDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('appointmentTime').value = '09:00';
        document.getElementById('appointmentReminderBefore').value = 30;
    }
    
    // Store appointment ID if editing
    document.getElementById('appointmentForm').setAttribute('data-appointment-id', appointmentId || '');
    
    openModal('appointmentModal');
}

async function saveAppointment(e) {
    if (e) e.preventDefault();
    
    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    const appointmentId = document.getElementById('appointmentForm').getAttribute('data-appointment-id');
    
    const customerId = Number(document.getElementById('appointmentCustomer').value);
    const title = document.getElementById('appointmentTitle').value;
    const type = document.getElementById('appointmentType').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const reminderBefore = Number(document.getElementById('appointmentReminderBefore').value || 30);
    const notes = document.getElementById('appointmentNotes').value;
    
    if (!customerId) {
        alert('Vui lòng chọn khách hàng');
        return;
    }
    
    if (isApiSession) {
        // Call API to create appointment
        // Combine date and time into LocalDateTime format
        const dateTimeStr = `${date}T${time}:00`;
        
        const payload = {
            khachHang: { maKhachHang: customerId },
            tieuDe: title,
            loaiNhacNho: type === 'call' ? 'Gọi điện' : 
                        type === 'email' ? 'Email' : 
                        type === 'meeting' ? 'Cuộc họp' : 
                        type === 'message' ? 'Tin nhắn' : 'Gọi điện',
            thoiGianNhac: dateTimeStr,
            nhacTruocPhut: reminderBefore,
            moTa: notes,
            trangThaiNhacNho: 'Chờ xử lý'
        };
        
        try {
            await API_SERVICES.nhacNho.create(payload);
            closeModal('appointmentModal');
            loadSmartReminders();
            alert('✓ Tạo lịch hẹn thành công!');
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('⚠ Lỗi: ' + (error.response?.data?.message || error.message || 'Không thể tạo lịch hẹn'));
        }
    } else {
        // Local data mode
        const customer = DATA.customers.find(c => Number(c.id) === customerId);
        
        if (appointmentId) {
            // Update existing
            const appointment = DATA.appointments.find(item => Number(item.id) === Number(appointmentId));
            if (appointment) {
                appointment.customerId = customerId;
                appointment.customerName = customer?.name || '';
                appointment.title = title;
                appointment.type = type;
                appointment.date = date;
                appointment.time = time;
                appointment.reminderBefore = reminderBefore;
                appointment.notes = notes;
            }
        } else {
            // Create new
            DATA.appointments.push({
                id: Math.max(0, ...DATA.appointments.map(item => Number(item.id) || 0)) + 1,
                customerId,
                customerName: customer?.name || '',
                title,
                type,
                date,
                time,
                reminderBefore,
                notes,
                status: 'scheduled'
            });
        }
        
        closeModal('appointmentModal');
        loadSmartReminders();
    }
}

function viewAppointment(appointmentId) {
    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    let appointment = null;
    
    // Find appointment from current page data
    const rows = document.querySelectorAll('.data-table tbody tr');
    rows.forEach(row => {
        const viewBtn = row.querySelector(`button[onclick="viewAppointment(${appointmentId})"]`);
        if (viewBtn) {
            const cells = row.querySelectorAll('td');
            appointment = {
                id: appointmentId,
                customerName: cells[0]?.textContent || '',
                title: cells[1]?.textContent || '',
                type: cells[2]?.textContent || '',
                dateTime: cells[3]?.textContent || '',
                status: cells[4]?.textContent.includes('Hoàn thành') ? 'completed' : 'scheduled'
            };
        }
    });
    
    // Fallback to DATA if not found in table
    if (!appointment && !isApiSession) {
        const dataAppointment = DATA.appointments.find(item => Number(item.id) === Number(appointmentId));
        if (dataAppointment) {
            appointment = {
                id: appointmentId,
                customerName: dataAppointment.customerName || dataAppointment.tenKhachHang || '',
                title: dataAppointment.title || dataAppointment.tieuDe || '',
                type: dataAppointment.type || dataAppointment.loaiTuongTac || '',
                date: dataAppointment.date || dataAppointment.thoiGianHen || '',
                time: dataAppointment.time || dataAppointment.gioHen || '',
                status: dataAppointment.status || dataAppointment.trangThai || 'scheduled',
                reminderBefore: dataAppointment.reminderBefore || dataAppointment.nhacTruoc
            };
        }
    }
    
    if (!appointment) return;

    // Populate modal with appointment data
    document.getElementById('appointmentDetailTitle').textContent = appointment.title || '';
    document.getElementById('appointmentDetailCustomer').textContent = appointment.customerName || '';
    
    // Handle type label
    let typeLabel = appointment.type;
    if (appointment.type && !appointment.type.includes('điện') && !appointment.type.includes('Email')) {
        typeLabel = getInteractionTypeLabel(appointment.type);
    }
    document.getElementById('appointmentDetailType').textContent = typeLabel || '';
    
    // Handle date and time
    if (appointment.dateTime) {
        const parts = appointment.dateTime.split(' ');
        document.getElementById('appointmentDetailDate').textContent = parts[0] || '';
        document.getElementById('appointmentDetailTime').textContent = parts.slice(1).join(' ') || 'Chưa xác định';
    } else {
        document.getElementById('appointmentDetailDate').textContent = formatDate(appointment.date) || '';
        document.getElementById('appointmentDetailTime').textContent = appointment.time || 'Chưa xác định';
    }
    
    // Status with color coding
    const statusEl = document.getElementById('appointmentDetailStatus');
    if (appointment.status === 'completed' || appointment.status === 'hoan_thanh' || appointment.status.includes('Hoàn thành')) {
        statusEl.innerHTML = '<span style="color: #10b981; font-weight: 600;"><i class="fas fa-check-circle"></i> Hoàn thành</span>';
        document.getElementById('appointmentDetailCompleteBtn').style.display = 'none';
    } else {
        statusEl.innerHTML = '<span style="color: #f59e0b; font-weight: 600;"><i class="fas fa-clock"></i> Đã lên lịch</span>';
        document.getElementById('appointmentDetailCompleteBtn').style.display = 'inline-block';
    }
    
    // Reminder info
    if (appointment.reminderBefore) {
        document.getElementById('appointmentDetailReminder').textContent = `${appointment.reminderBefore} phút trước`;
        document.getElementById('appointmentDetailReminderSection').style.display = 'block';
    } else {
        document.getElementById('appointmentDetailReminderSection').style.display = 'none';
    }
    
    // Store appointment ID for action buttons
    document.getElementById('appointmentDetailCompleteBtn').setAttribute('data-appointment-id', appointmentId);
    document.getElementById('appointmentDetailDeleteBtn').setAttribute('data-appointment-id', appointmentId);
    
    // Open modal
    openModal('appointmentDetailModal');
}

function completeAppointmentFromModal() {
    const appointmentId = document.getElementById('appointmentDetailCompleteBtn').getAttribute('data-appointment-id');
    if (appointmentId) {
        completeAppointment(appointmentId);
        closeModal('appointmentDetailModal');
    }
}

function deleteAppointmentFromModal() {
    const appointmentId = document.getElementById('appointmentDetailDeleteBtn').getAttribute('data-appointment-id');
    if (appointmentId && confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
        deleteAppointment(appointmentId);
        closeModal('appointmentDetailModal');
    }
}

function editAppointment(appointmentId) {
    openAppointmentModal(appointmentId);
}

function editAppointmentFromDetail() {
    loadSmartReminders();
}

async function deleteAppointment(appointmentId) {
    if (!confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) return;
    
    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    
    if (isApiSession) {
        try {
            await API_SERVICES.nhacNho.delete(appointmentId);
            loadSmartReminders();
            alert('✓ Xóa lịch hẹn thành công!');
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('⚠ Lỗi: ' + (error.response?.data?.message || error.message || 'Không thể xóa lịch hẹn'));
        }
    } else {
        DATA.appointments = DATA.appointments.filter(item => Number(item.id) !== Number(appointmentId));
        loadSmartReminders();
    }
}

async function completeAppointment(appointmentId) {
    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    
    if (isApiSession) {
        try {
            await API_SERVICES.nhacNho.complete(appointmentId);
            loadSmartReminders();
            alert('✓ Đã đánh dấu hoàn thành!');
        } catch (error) {
            console.error('Error completing appointment:', error);
            alert('⚠ Lỗi: ' + (error.response?.data?.message || error.message || 'Không thể hoàn thành lịch hẹn'));
        }
    } else {
        const appointment = DATA.appointments.find(item => Number(item.id) === Number(appointmentId));
        if (!appointment) return;
        appointment.status = 'completed';
        appointment.completedDate = new Date().toISOString().split('T')[0];
        loadSmartReminders();
    }
}

function saveAppointmentResult(e) {
    if (e) e.preventDefault();
    loadSmartReminders();
}

async function loadMergeDuplicates() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    let duplicates = [];
    const ignored = JSON.parse(localStorage.getItem('ignored_duplicate_pairs') || '[]');
    
    if (isApiSession) {
        try {
            const res = await API_SERVICES.trungLap.list();
            const allDuplicates = res.data || res || [];
            duplicates = allDuplicates.filter(item => !ignored.includes(String(item.id)) && !ignored.includes(item.id));
        } catch (error) {
            console.error('Error loading duplicates:', error);
            alert('Không thể tải danh sách trùng lặp từ server.');
            return;
        }
    } else {
        const allDuplicates = DATA.duplicateCustomers || [];
        duplicates = allDuplicates.filter(item => !ignored.includes(String(item.id)) && !ignored.includes(item.id));
    }

    content.innerHTML = `
        <div class="page-header">
            <div>
                <h1>Gộp dữ liệu trùng lặp</h1>
                <p>Kiểm tra và xử lý các cặp khách hàng trùng lặp hoặc tương đồng thông tin.</p>
            </div>
        </div>
        <div class="table-container">
            <div class="table-header"><h3>Phát hiện ${duplicates.length} cặp cần xử lý</h3></div>
            <div style="display:grid; gap:16px; padding:20px;">
                ${duplicates.map(item => `
                    <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px; background:#fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
                            <div style="padding:12px; background:#f8fafc; border-radius:6px; border-left: 4px solid #0284c7;">
                                <div style="font-weight:600; color:#0284c7; margin-bottom:8px; font-size:14px; display:flex; align-items:center; gap:8px;">
                                    <i class="fas fa-user-check" style="color:#0284c7;"></i> Khách hàng 1 (Giữ lại & Gộp)
                                </div>
                                <div style="font-weight:600; font-size:15px; color:#1e293b;">${item.customer1.name}</div>
                                <div style="color:#475569; font-size:13px; margin-top:6px;"><i class="far fa-envelope" style="width:16px;"></i> ${item.customer1.email || 'N/A'}</div>
                                <div style="color:#475569; font-size:13px; margin-top:2px;"><i class="fas fa-phone-alt" style="width:16px;"></i> ${item.customer1.phone || 'N/A'}</div>
                            </div>
                            <div style="padding:12px; background:#f8fafc; border-radius:6px; border-left: 4px solid #ef4444;">
                                <div style="font-weight:600; color:#ef4444; margin-bottom:8px; font-size:14px; display:flex; align-items:center; gap:8px;">
                                    <i class="fas fa-user-minus" style="color:#ef4444;"></i> Khách hàng 2 (Xóa bỏ sau khi gộp)
                                </div>
                                <div style="font-weight:600; font-size:15px; color:#1e293b;">${item.customer2.name}</div>
                                <div style="color:#475569; font-size:13px; margin-top:6px;"><i class="far fa-envelope" style="width:16px;"></i> ${item.customer2.email || 'N/A'}</div>
                                <div style="color:#475569; font-size:13px; margin-top:2px;"><i class="fas fa-phone-alt" style="width:16px;"></i> ${item.customer2.phone || 'N/A'}</div>
                            </div>
                        </div>
                        <div style="margin:16px 0 12px 0; display:flex; align-items:center; gap:8px;">
                            <span style="font-size:13px; color:#64748b;">Độ tương đồng:</span>
                            <span style="font-weight:600; background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-size:13px;">${item.similarity}%</span>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button class="btn btn-primary btn-sm" onclick="confirmMergeCustomers('${item.id}')"><i class="fas fa-compress-alt"></i> Gộp hai khách hàng</button>
                            <button class="btn btn-secondary btn-sm" onclick="ignoreDuplicate('${item.id}')"><i class="fas fa-ban"></i> Bỏ qua</button>
                        </div>
                    </div>
                `).join('') || '<p style="padding:20px; color:#64748b; text-align:center;">Tuyệt vời! Không phát hiện thông tin khách hàng trùng lặp nào.</p>'}
            </div>
        </div>
    `;
}

function mergeDuplicateCustomers(duplicateId) {
    confirmMergeCustomers(duplicateId);
}

async function confirmMergeCustomers(duplicateId) {
    if (!confirm('Bạn có chắc chắn muốn gộp hai khách hàng này?\n\nMọi thông tin trống của Khách hàng 1 sẽ được bổ sung từ Khách hàng 2. Lịch sử tương tác, nhắc nhở, nhãn tag, chiến dịch tham gia của Khách hàng 2 sẽ được chuyển sang Khách hàng 1. Khách hàng 2 sẽ bị xóa.')) return;

    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    if (isApiSession) {
        try {
            await API_SERVICES.trungLap.gop(duplicateId);
            alert('✓ Gộp khách hàng thành công!');
            loadMergeDuplicates();
        } catch (error) {
            console.error('Error merging customers:', error);
            alert('⚠ Lỗi: ' + (error.response?.data?.message || error.message || 'Không thể gộp khách hàng'));
        }
    } else {
        const duplicate = DATA.duplicateCustomers.find(item => String(item.id) === String(duplicateId));
        if (duplicate) {
            const keep = DATA.customers.find(item => String(item.id) === String(duplicate.customer1.id));
            const remove = DATA.customers.find(item => String(item.id) === String(duplicate.customer2.id));
            if (keep && remove) {
                // Merge data fields
                Object.keys(remove).forEach(key => {
                    if (!keep[key] && remove[key]) {
                        keep[key] = remove[key];
                    }
                });
                
                DATA.interactions.forEach(interaction => {
                    if (String(interaction.customerId) === String(remove.id)) interaction.customerId = keep.id;
                });
                remove.deleted = true;
                remove.deletedDate = new Date().toLocaleDateString('vi-VN');
            }
            DATA.duplicateCustomers = DATA.duplicateCustomers.filter(item => String(item.id) !== String(duplicateId));
            alert('✓ Gộp khách hàng thành công!');
            loadMergeDuplicates();
        }
    }
}

async function ignoreDuplicate(duplicateId) {
    if (!confirm('Bạn có muốn bỏ qua trùng lặp này? Hệ thống sẽ không cảnh báo trùng lặp cho cặp khách hàng này nữa.')) return;

    const isApiSession = AUTH.getCurrentUser()?.authSource === 'api';
    if (isApiSession) {
        let ignored = JSON.parse(localStorage.getItem('ignored_duplicate_pairs') || '[]');
        if (!ignored.includes(String(duplicateId))) {
            ignored.push(String(duplicateId));
            localStorage.setItem('ignored_duplicate_pairs', JSON.stringify(ignored));
        }
        alert('✓ Đã bỏ qua trùng lặp!');
        loadMergeDuplicates();
    } else {
        let ignored = JSON.parse(localStorage.getItem('ignored_duplicate_pairs') || '[]');
        if (!ignored.includes(String(duplicateId))) {
            ignored.push(String(duplicateId));
            localStorage.setItem('ignored_duplicate_pairs', JSON.stringify(ignored));
        }
        DATA.duplicateCustomers = DATA.duplicateCustomers.filter(item => String(item.id) !== String(duplicateId));
        alert('✓ Đã bỏ qua trùng lặp!');
        loadMergeDuplicates();
    }
}
