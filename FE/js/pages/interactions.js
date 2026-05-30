// ============================================
// INTERACTIONS PAGE (REAL BACKEND API INTEGRATION)
// ============================================

let currentInteractionsList = [];

async function loadInteractions() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <h2 class="page-title">Quản lý Tương tác</h2>
        <div class="table-container">
            <div class="table-header">
                <h3>Danh sách Tương tác</h3>
                <button class="btn-add" onclick="openInteractionModal()">+ Thêm Tương tác</button>
            </div>
            <div id="interactionsLoading" style="text-align: center; padding: 40px; color: #71717a;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; margin-bottom: 10px;"></i>
                <p>Đang tải danh sách tương tác từ máy chủ...</p>
            </div>
            <table id="interactionsTable" style="display: none;">
                <thead>
                    <tr>
                        <th>Khách hàng</th>
                        <th>Nhân viên</th>
                        <th>Loại</th>
                        <th>Nội dung</th>
                        <th>Tệp đính kèm</th>
                        <th>Ngày thực hiện</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody id="interactionsTableBody">
                </tbody>
            </table>
        </div>
    `;

    try {
        // Gọi API lấy danh sách tương tác
        currentInteractionsList = await API_SERVICES.tuongTac.list();
        
        const tbody = document.getElementById('interactionsTableBody');
        const loadingDiv = document.getElementById('interactionsLoading');
        const table = document.getElementById('interactionsTable');

        loadingDiv.style.display = 'none';
        table.style.display = 'table';

        if (currentInteractionsList.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #71717a;">
                        <i class="fas fa-comments" style="font-size: 48px; margin-bottom: 15px; display: block; color: #d4d4d8;"></i>
                        Chưa có lịch sử tương tác nào được ghi nhận.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = currentInteractionsList.map(i => {
            // Hiển thị tệp đính kèm nếu có
            const attachmentsHtml = i.attachments && i.attachments.length > 0
                ? i.attachments.map(att => `
                    <div style="margin-bottom: 4px; display: inline-block;">
                        <a href="${API_CLIENT.buildUrl(att.downloadUrl)}" target="_blank" class="attachment-link" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 4px; font-size: 11.5px; color: #27272a; text-decoration: none; font-weight: 500; transition: background 0.15s;" title="Tải xuống tệp">
                            <i class="fas fa-file-download" style="color: #71717a;"></i> ${att.fileName}
                        </a>
                    </div>
                  `).join('')
                : '<span style="color: #a1a1aa; font-style: italic; font-size: 12px;">Không có</span>';

            const interactionDate = i.date ? formatDate(i.date) : 'N/A';

            return `
                <tr>
                    <td style="font-weight: 600; color: #18181b;">${i.customerName || 'N/A'}</td>
                    <td>${i.employeeName || 'N/A'}</td>
                    <td><span class="interaction-type-badge ${i.type}">${getInteractionTypeLabel(i.type)}</span></td>
                    <td style="max-width: 250px; white-space: normal; word-wrap: break-word;">
                        <div style="font-weight: 500;">${i.content}</div>
                        ${i.notes ? `<div style="font-size: 12px; color: #71717a; margin-top: 4px;">Ghi chú: ${i.notes}</div>` : ''}
                    </td>
                    <td>${attachmentsHtml}</td>
                    <td>${interactionDate}</td>
                    <td>
                        <button class="btn-edit" onclick="editInteraction(${i.id})">Sửa</button>
                        <button class="btn-delete" onclick="deleteInteraction(${i.id})">Xóa</button>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error('Lỗi tải danh sách tương tác:', error);
        document.getElementById('interactionsLoading').innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 32px; color: #ef4444; margin-bottom: 10px;"></i>
            <p style="color: #ef4444; font-weight: 600;">Lỗi tải dữ liệu tương tác từ máy chủ.</p>
            <button class="btn btn-secondary" onclick="loadInteractions()" style="margin-top: 10px; padding: 6px 12px; font-size: 12px;">Tải lại</button>
        `;
    }
}

async function openInteractionModal(selectedCustomerId = null, selectedEmployeeId = null) {
    const modal = document.getElementById('interactionModal');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Reset form
    document.getElementById('interactionForm').reset();
    document.getElementById('interactionFileName').textContent = 'Chọn file hoặc kéo thả vào đây';
    delete modal.dataset.interactionId;
    
    // Xóa danh sách tệp đính kèm cũ hiển thị trong modal (nếu có)
    const oldAttachmentContainer = document.getElementById('interactionCurrentAttachments');
    if (oldAttachmentContainer) oldAttachmentContainer.remove();

    // Populate dropdowns with selected values
    await populateCustomerDropdown('interactionCustomer', selectedCustomerId);
    await loadEmployeeDropdown('interactionEmployee', true, selectedEmployeeId);
    
    // Set default employee to current user if none selected
    if (selectedEmployeeId === null) {
        const currentUser = AUTH.getCurrentUser();
        if (currentUser) {
            // Tương thích cả id dạng int hoặc chuỗi và đảm bảo lấy đúng mã nhân viên (employeeId/maNhanVien) thay vì mã tài khoản (id)
            document.getElementById('interactionEmployee').value = currentUser.employeeId || currentUser.maNhanVien || currentUser.id || '';
        }
    }
}

async function editInteraction(id) {
    const interaction = currentInteractionsList.find(i => i.id === id);
    if (!interaction) {
        alert('❌ Không tìm thấy thông tin tương tác này.');
        return;
    }

    // Extract customer ID and employee ID with comprehensive fallback support
    const customerId = interaction.customerId || 
                       interaction.maKhachHang || 
                       (interaction.khachHang ? (interaction.khachHang.maKhachHang || interaction.khachHang.id) : null) ||
                       (interaction.customer ? (interaction.customer.id || interaction.customer.maKhachHang) : null);
                       
    const employeeId = interaction.employeeId || 
                       interaction.maNhanVien || 
                       (interaction.nhanVien ? (interaction.nhanVien.maNhanVien || interaction.nhanVien.id) : null) ||
                       (interaction.employee ? (interaction.employee.id || interaction.employee.maNhanVien) : null);

    console.log('Editing interaction:', interaction, 'Resolved Customer ID:', customerId, 'Resolved Employee ID:', employeeId);

    await openInteractionModal(customerId, employeeId);
    
    const modal = document.getElementById('interactionModal');
    modal.dataset.interactionId = id;
    modal.querySelector('h2').textContent = 'Cập nhật Tương tác';

    // Điền dữ liệu
    document.getElementById('interactionType').value = interaction.type || 'call';
    document.getElementById('interactionContent').value = interaction.content || '';
    document.getElementById('interactionNotes').value = interaction.notes || '';

    // Hiển thị tệp đính kèm hiện tại để xóa nếu cần
    let attContainer = document.getElementById('interactionCurrentAttachments');
    if (!attContainer) {
        attContainer = document.createElement('div');
        attContainer.id = 'interactionCurrentAttachments';
        attContainer.style.marginTop = '10px';
        attContainer.style.padding = '10px';
        attContainer.style.background = '#fafafa';
        attContainer.style.border = '1px dashed #e4e4e7';
        attContainer.style.borderRadius = '6px';
        
        // Chèn vào phía trên phần đính kèm file
        const fileGroup = document.getElementById('interactionFile').closest('.form-group');
        fileGroup.parentNode.insertBefore(attContainer, fileGroup);
    }

    if (interaction.attachments && interaction.attachments.length > 0) {
        attContainer.style.display = 'block';
        attContainer.innerHTML = `
            <div style="font-size: 12.5px; font-weight: 600; color: #18181b; margin-bottom: 6px;">Tệp đính kèm hiện có:</div>
            ${interaction.attachments.map(att => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 4px; margin-bottom: 4px; font-size: 12px;">
                    <span style="color: #27272a; font-weight: 500;"><i class="fas fa-file" style="color: #71717a; margin-right: 6px;"></i>${att.fileName}</span>
                    <button type="button" onclick="deleteInteractionAttachment(${id}, ${att.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 2px 6px; font-size: 13px;" title="Xóa tệp này">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `).join('')}
        `;
    } else {
        attContainer.style.display = 'none';
    }
}

async function deleteInteractionAttachment(interactionId, fileId) {
    if (!confirm('❓ Bạn có chắc chắn muốn xóa tệp đính kèm này khỏi tương tác?')) {
        return;
    }

    try {
        await API_SERVICES.tuongTac.deleteFile(interactionId, fileId);
        alert('✓ Đã xóa tệp đính kèm thành công!');
        
        // Refresh giao diện
        closeModal('interactionModal');
        await loadInteractions();
    } catch (err) {
        console.error('Lỗi xóa tệp đính kèm:', err);
        alert('❌ Không thể xóa tệp: ' + (err.message || 'Lỗi hệ thống'));
    }
}

async function deleteInteraction(id) {
    if (!confirm('❓ Bạn có chắc chắn muốn xóa lịch sử tương tác này?')) {
        return;
    }

    try {
        await API_SERVICES.tuongTac.delete(id);
        alert('✓ Đã xóa tương tác thành công!');
        await loadInteractions();
    } catch (error) {
        console.error('Lỗi xóa tương tác:', error);
        alert('❌ Xóa tương tác thất bại: ' + (error.message || 'Lỗi hệ thống'));
    }
}

async function saveInteraction(e) {
    e.preventDefault();
    
    const modal = document.getElementById('interactionModal');
    const interactionId = modal.dataset.interactionId;
    const saveBtn = modal.querySelector('button[type="submit"]');
    const origBtnText = saveBtn.innerHTML;

    const payload = {
        customerId: parseInt(document.getElementById('interactionCustomer').value),
        employeeId: parseInt(document.getElementById('interactionEmployee').value) || null,
        type: document.getElementById('interactionType').value,
        content: document.getElementById('interactionContent').value.trim(),
        notes: document.getElementById('interactionNotes').value.trim()
    };

    if (isNaN(payload.customerId)) {
        alert('❌ Vui lòng chọn khách hàng.');
        return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

    try {
        let savedInteraction;
        if (interactionId) {
            // Cập nhật tương tác cũ
            savedInteraction = await API_SERVICES.tuongTac.update(parseInt(interactionId), payload);
            
            // Upload các file đính kèm song song nếu có chọn
            const fileInput = document.getElementById('interactionFile');
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                const uploadPromises = [];
                for (let i = 0; i < fileInput.files.length; i++) {
                    uploadPromises.push(API_SERVICES.tuongTac.uploadFile(parseInt(interactionId), fileInput.files[i]));
                }
                await Promise.all(uploadPromises);
            }
            
            alert('✓ Cập nhật tương tác thành công!');
        } else {
            // Thêm tương tác mới
            savedInteraction = await API_SERVICES.tuongTac.create(payload);
            
            // Upload các file đính kèm song song nếu có chọn
            const fileInput = document.getElementById('interactionFile');
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                const uploadPromises = [];
                for (let i = 0; i < fileInput.files.length; i++) {
                    uploadPromises.push(API_SERVICES.tuongTac.uploadFile(savedInteraction.id, fileInput.files[i]));
                }
                await Promise.all(uploadPromises);
            }
            
            alert('✓ Thêm tương tác thành công!');
        }

        closeModal('interactionModal');
        await loadInteractions();

    } catch (error) {
        console.error('Lỗi lưu tương tác:', error);
        alert('❌ Không thể lưu tương tác: ' + (error.message || 'Kiểm tra lại dữ liệu nhập.'));
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = origBtnText;
    }
}
